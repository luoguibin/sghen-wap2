import SgForm from './sg-form.vue'

SgForm.install = function (app: Vue) {
  app.component(SgForm.name, SgForm)
}

export default SgForm