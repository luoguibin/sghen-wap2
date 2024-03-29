<template>
  <div class="my-msgs sg-flex-column">
    <sg-header @back="$router.go(-1)">
      <span>我的消息</span>
    </sg-header>

    <div class="main sg-flex-one">
      <sg-scroll ref="sgScroll" :isEnd="true" @refresh="handleRefresh">
        <div v-for="item in msgs" :key="item.id" class="msg-item">
          <!-- 消息内容 -->
          <p>{{ filterMsgText(item) }}</p>

          <!-- 消息简介 -->
          <div class="msg-bottom sg-flex">
            <div class="title">
              {{ filterMsgType(item) }}
            </div>
            <div class="sg-flex-one time">
              {{ filterTime(item.createTime) }}
            </div>
            <sg-button
              :disabled="item.status > 0"
              type="text"
              @click="onReadMsg(item)"
            >
              {{ item.status > 0 ? "已读" : "了解" }}</sg-button
            >
          </div>
        </div>

        <div class="msg-bottom-tip">暂只展示最新{{ maxCount }}条消息</div>
      </sg-scroll>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { mapActions, useStore } from "vuex";
import { apiURL, apiPostData } from "@/api";
import { timeFilter } from "@/filters/index";

const SYS_MODULE = {
  SYS: 1000,
  SYS_BLESS: 1001,
  USER: 2000,
  USER_CREATE: 2001,
  PEOTRY: 3000,
};

export default defineComponent({
  name: "MyMsgs",

  setup() {
    const store = useStore();
    const msgs = computed(() => store.state.sysMsg.msgs);

    return {
      maxCount: ref(100),
      msgs,
    };
  },

  created() {
    window.myMsgs = this;
  },

  methods: {
    filterTime(v) {
      return timeFilter(v);
    },
    filterMsgType(item) {
      switch (item.msgType) {
        case SYS_MODULE.SYS_BLESS:
          return "系统祝福";
        case SYS_MODULE.PEOTRY:
          return "诗词消息";
        default:
          return "系统消息";
      }
    },
    filterMsgText(item) {
      switch (item.msgType) {
        case SYS_MODULE.USER_CREATE:
          return item.content || "欢迎注册Sghen三行~";
        default:
          return item.content || "--";
      }
    },

    onReadMsg(item) {
      if (item.loading) {
        return;
      }
      item.loading = true;
      apiPostData(apiURL.readSysMsg, { id: item.id })
        .then(() => {
          item.status = 1;
        })
        .finally(() => {
          item.loading = false;
        });
    },

    handleRefresh() {
      this.getSysMsgs({ limit: this.maxCount })
        .then(() => {
          this.$refs.sgScroll.success();
        })
        .catch(() => {
          this.$refs.sgScroll.fail();
        });
    },
    ...mapActions({
      getSysMsgs: "sysMsg/getSysMsgs",
    }),
  },
});
</script>

<style lang="scss" scoped>
.my-msgs {
  position: relative;
  height: 100%;
  overflow: hidden;

  .main {
    flex: 1;
    overflow: hidden;
  }
}

.msg-item {
  padding: 0.5rem 1rem 1rem;
  font-size: 1.2rem;
  line-height: 2rem;
  align-items: flex-end;
  &:nth-child(2n) {
    background-color: white;
  }

  .msg-bottom {
    font-size: 1rem;
    color: #888888;
    border-bottom: 1px dashed gray;
  }
  .title {
    width: 100px;
    text-align: left;
  }
  .time {
    text-align: right;
    margin-right: 3rem;
  }
  p {
    margin-bottom: 0.5rem;
  }
}

.msg-bottom-tip {
  text-align: center;
  font-size: 0.8rem;
  color: #999999;
  margin: 1rem 0;
}
</style>
