import SgScroll from './sg-scroll.vue'

SgScroll.install = function (app: Vue) {
  app.component(SgScroll.name, SgScroll)
}

export default SgScroll