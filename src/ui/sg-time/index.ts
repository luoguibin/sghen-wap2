import SgTime from './sg-time.vue'

SgTime.install = function (app: Vue) {
  app.component(SgTime.name, SgTime)
}

export default SgTime