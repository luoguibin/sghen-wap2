import { createStore } from "vuex"
import Auth from './auth'
import SysMsg from './sys-msg'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: Auth,
    sysMsg: SysMsg
  }
})
