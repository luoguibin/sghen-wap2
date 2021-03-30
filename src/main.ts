import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'
import Xss from 'xss'
import SgComponents from './ui/index'
import SgDirectives from './directives/index'
import './filters/index.js'
import './style/index.scss'

const app = createApp(App)
const prototype = app.config.globalProperties
prototype.$xss = Xss
prototype.$store = store // 为了让路由第一次拦截时能使用$store
prototype.$toastLogin = function (msg = '请#{ 登陆 }后再操作', params: any) {
  if (this.$store.getters['auth/isLogin']) {
    return
  }
  this.$toast(msg, {
    ...params,
    btnCall: (index: Number) => {
      this.$router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    }
  })
}

app.use(store).use(router)
app.use(SgComponents).use(SgDirectives)
const appComp = app.mount('#app')

window.app = app
window.appComp = appComp