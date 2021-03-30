import SgButton from './sg-button.vue'

SgButton.install = function (app: Vue) {
  app.component(SgButton.name, SgButton)
}
export default SgButton