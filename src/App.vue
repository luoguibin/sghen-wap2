<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore, mapActions } from "vuex";

export default defineComponent({
  name: "App",

  setup() {
    const store = useStore();
    return {
      isLogin: computed(() => store.getters["auth/isLogin"]),
    };
  },

  mounted() {
    window.app = this;
    this.getUserMsgs();
  },

  methods: {
    getUserMsgs() {
      if (!this.isLogin) {
        return;
      }
      this.getSysMsgs();
    },

    ...mapActions({
      getSysMsgs: "sysMsg/getSysMsgs",
    }),
  },
});
</script>

<style lang="scss">
#app {
  height: 100%;
  background-color: #f6f6f6;
}
</style>
