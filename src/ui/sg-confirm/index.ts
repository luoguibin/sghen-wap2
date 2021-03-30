import SgConfirm from './sg-confirm.vue'
import { createVNode, render } from "vue"

SgConfirm.install = function (app: Vue) {
  app.component(SgConfirm.name, SgConfirm)
  setPrototype(app)
}

let _sgInstance
const setPrototype = function (app) {
  const prototype = app.config.globalProperties

  prototype.$confirm = function (options = {}) {
    let confirm = _sgInstance
    if (!confirm) {
      const vnode = createVNode(SgConfirm)
      const div = document.createElement('DIV')
      render(vnode, div)
      document.body.append(div.firstElementChild)
      confirm = vnode.component?.proxy
      _sgInstance = confirm
    }
    if (confirm.visible) {
      return
    }
    confirm.show(options)
  }
  prototype.$confirm.hide = function () {
    _sgInstance.hide()
  }
}

export default SgConfirm