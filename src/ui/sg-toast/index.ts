import SgToast from './sg-toast.vue'
import { createVNode, render } from "vue"

SgToast.install = function (app: Vue) {
  app.component(SgToast.name, SgToast)
  setPrototype(app)
}

let _sgInstance: any
const toastFunc = function (msg, options = {}) {
  let toast = _sgInstance
  if (!toast) {
    const div = document.createElement('DIV')
    const vnode = createVNode(SgToast)
    render(vnode, div)
    toast = vnode.component?.proxy

    document.body.append(div.firstElementChild)
    _sgInstance = toast
    window._sgGlobal.mToast = toast
    window._sgGlobal.mToastVnode = vnode
  }
  toast.show(msg, options)
}

const setPrototype = function (app) {
  const prototype = app.config.globalProperties

  prototype.$toast = toastFunc
  window._sgGlobal.$toast = toastFunc
}

export default SgToast