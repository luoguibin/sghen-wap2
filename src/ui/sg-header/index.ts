import SgHeader from './sg-header.vue'

SgHeader.install = function (app: Vue) {
  app.component(SgHeader.name, SgHeader)
}

export default SgHeader