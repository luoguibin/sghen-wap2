<template>
  <div class="peotry-list">
    <sg-header @back="$router.go(-1)">
      {{ title }}
      <template v-slot:right>
        <span
          v-show="isSelf"
          class="iconfont icon-increase"
          @click="onGoNewPeotry"
        ></span>
      </template>
    </sg-header>

    <div class="main" @click="onClickPoetry">
      <sg-scroll
        v-show="!isEmpty"
        ref="sgScroll"
        :isEnd="isEnd"
        @load="handleLoad"
        @refresh="handleRefresh"
        @scroll="handleScroll"
      >
        <template v-for="(item, index) in peotries" :key="item.id">
          <div
            v-if="item.timeLine"
            :key="item.id + '-time'"
            class="time-line sg-sticky-item"
            item-empty
          >
            {{ item.timeLine }}
          </div>

          <peotry
            :peotry="item"
            :ref="(el) => setRefPeotries(el, index)"
          ></peotry>
        </template>
      </sg-scroll>
      <div v-show="isEmpty" class="empty">暂未有诗词</div>
    </div>

    <image-viewer
      v-model:visible="viewerVisible"
      :index="imageIndex"
      :images="images"
    ></image-viewer>
  </div>
</template>

<script>
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  ref,
} from "vue";
import { useStore } from "vuex";
import { apiURL, apiGetData } from "@/api";
import { getItemIndex, getItemTypeIndex, getItemTypeObj } from "@/utils/dom";
import Cache from "@/common/cache-center";
import { useRoute } from "vue-router";

const CACHE_ROOT_ID = "peotry_list_root";

export default defineComponent({
  nae: "PeotryList",

  components: {
    Peotry: defineAsyncComponent(() => import("@/components/peotry.vue")),
    ImageViewer: defineAsyncComponent(() =>
      import("@/components/image-viewer.vue")
    ),
  },

  setup() {
    const setName = ref("");
    const uuid = ref("");

    const store = useStore();
    const userID = computed(() => store.state.auth.userID);
    const isSelf = computed(() => {
      return +userID.value === +uuid.value;
    });

    const peotries = ref([]);
    const isDataReady = ref(false);
    const isEmpty = computed(() => {
      return !peotries.value.length && isDataReady.value;
    });

    const route = useRoute();
    const title = computed(() => {
      if (setName.value) {
        return setName.value;
      }
      const text = "诗词列表";
      let username = route.query.username;
      if (uuid.value !== CACHE_ROOT_ID) {
        if (isSelf.value) {
          username = "我";
        }
        return `${username || "TA"}的${text}`;
      }
      return text;
    });

    return {
      title,
      uuid,
      setId: ref(""),
      setName,
      page: ref(1),
      limit: ref(20),
      isEnd: ref(false),
      peotries,
      refPeotries: {},
      isDataReady,
      isEmpty,
      isSelf,

      viewerVisible: ref(false),
      images: ref([]),
      imageIndex: ref(0),
    };
  },

  mounted() {
    window.peotryList = this;
    this.checkRestorePageData();
  },

  beforeRouteUpdate(to, from, next) {
    this.savePageData();
    next();
    this.checkRestorePageData();
  },

  beforeRouteLeave(to, from, next) {
    if (to.name === "peotry-detail" || to.name === "personal") {
      this.savePageData();
    }
    next();
  },

  methods: {
    setRefPeotries(el, index) {
      this.refPeotries[index] = el;
    },

    getSaveID() {
      return `${this.uuid}-${this.setId}`;
    },
    savePageData() {
      Cache.PeotryPageCache.setData(this.getSaveID(), {
        peotries: this.peotries,
        page: this.page,
        isEnd: this.isEnd,
        scrollTop: this.$refs.sgScroll.getScrollTop(),
      });
    },
    restorePageData() {
      const pageCacheData = Cache.PeotryPageCache.getData(this.getSaveID());
      if (!pageCacheData) {
        return false;
      }

      this.peotries = pageCacheData.peotries;
      this.refPeotries = {};
      this.page = pageCacheData.page;
      this.isEnd = pageCacheData.isEnd;
      this.isDataReady = true;

      this.$refs.sgScroll.success();
      this.$nextTick(() => {
        this.$refs.sgScroll.setScrollTop(pageCacheData.scrollTop);
        this.checkPeotriesVisible();
      });
      return true;
    },
    checkRestorePageData() {
      const query = this.$route.query;
      // 强制转换为string作为id
      this.uuid = query.uuid ? "" + query.uuid : CACHE_ROOT_ID;
      this.setId = query.setId ? "" + query.setId : "0";
      this.setName = query.setName ? query.setName : "";
      this.scrollItemMap = {};

      // 若删除了诗词，列表应该刷新
      const optionData = Cache.OptionCache.getData(Cache.OPTION.DELETE);
      if (!optionData || optionData.type !== "peotry") {
        if (this.restorePageData()) {
          return;
        }
      }
      if (optionData) {
        Cache.OptionCache.delete(Cache.OPTION.DELETE);
      }
      this.isDataReady = false;
      this.page = 1;
      this.peotries = [];
      this.refPeotries = {};
      this.$refs.sgScroll.refresh();
    },

    handleLoad(isRefresh) {
      if (!isRefresh) {
        this.page += 1;
      }
      const params = {
        page: this.page,
        limit: this.limit,
        // needComment: true
      };
      if (this.uuid !== CACHE_ROOT_ID) {
        params.userId = this.uuid;
      }
      if (this.setId) {
        params.setId = this.setId;
      }
      const keyword = this.$route.query.keyword;
      if (keyword) {
        params.content = keyword;
      }

      apiGetData(apiURL.peotryList, params)
        .then((data) => {
          const list = data.data;

          if (isRefresh) {
            this.peotries = list;
            this.refPeotries = {};
          } else {
            this.peotries.push(...list);
          }
          // 判断添加时间线
          let currentYearMonth = 999911;
          const nowYear = new Date().getFullYear();
          this.peotries.forEach((o) => {
            const createDate = new Date(o.time);
            const tempYearMonth =
              createDate.getFullYear() * 100 + createDate.getMonth();
            if (tempYearMonth < currentYearMonth) {
              o.timeLine = `${
                createDate.getFullYear() === nowYear
                  ? "今"
                  : createDate.getFullYear()
              }年 ${createDate.getMonth() + 1}月`;
            }
            currentYearMonth = tempYearMonth;
          });
          this.isDataReady = true;
          this.isEnd = this.peotries.length === data.totalCount;

          this.$refs.sgScroll.success();
          isRefresh && this.$refs.sgScroll.onScrollToTop();

          isRefresh && this.checkPeotriesVisible();
        })
        .catch(() => {
          this.$refs.sgScroll.fail();
        });
    },
    handleRefresh() {
      this.page = 1;
      this.scrollItemMap = {};
      Cache.PeotryPageCache.delete(this.getSaveID());
      Cache.UserCache.clear();
      this.handleLoad(true);
    },
    checkPeotriesVisible() {
      this.timeHandler = setInterval(() => {
        if (Object.keys(this.refPeotries).length) {
          clearInterval(this.timeHandler);
          this.handleScroll(0, this.$el.clientHeight);
        }
      }, 100);
    },
    handleScroll(scrollTop, clientHeight) {
      const map = this.scrollItemMap;
      Object.values(this.refPeotries).forEach((o, index) => {
        const offsetTop = o.$el.offsetTop;
        if (Math.abs(offsetTop - scrollTop) <= clientHeight) {
          const id = this.peotries[index].id;
          if (!map[id]) {
            map[id] = true;
            o.setScrollIntoView();
          }
        }
      });
    },
    onClickPoetry(e) {
      const { el, itemType } = getItemTypeObj(e.target) || {};
      if (!itemType) {
        return;
      }

      const itemIndex = getItemIndex(el);
      const index = getItemTypeIndex(el, "peotry");
      const peotry = this.peotries[index];
      const instance = this.refPeotries[index];
      switch (itemType) {
        case "peotry-content":
          sessionStorage.setItem("peotry-detail", JSON.stringify(peotry));
          this.$router.push({
            name: "peotry-detail",
            params: { id: peotry.id },
          });
          break;
        case "peotry-image":
          this.images = instance.peotryImages;
          this.imageIndex = itemIndex;
          this.viewerVisible = true;
          break;
        case "peot-avatar":
          this.$router.push({
            name: "personal",
            query: { uuid: peotry.user.id, username: peotry.user.username },
          });
          break;
        default:
          break;
      }
    },
    onGoNewPeotry() {
      this.$router.push({
        name: "peotry-edit",
        params: { id: "new" },
        query: { setId: this.setId, setName: this.setName },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.peotry-list {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;

  .main {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  .peotry {
    margin-bottom: 3rem;
    &:first-child {
      margin-top: 2rem;
    }
  }

  .time-line {
    padding: 1rem;
    border-top: 1px solid white;
    font-size: 1.4rem;
    font-weight: bold;
    text-align: right;
    box-sizing: border-box;
    background-color: #f6f6f6;
  }
  .sg-sticking {
    z-index: 99;
  }

  .empty {
    padding: 50% 1rem 1rem;
    text-align: center;
    font-size: 1.2rem;
    color: rgb(161, 161, 161);
  }
}
</style>
