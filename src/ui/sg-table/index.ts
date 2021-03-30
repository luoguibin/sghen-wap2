import SgTable from './sg-table.vue'

SgTable.install = function (app: Vue) {
  app.component(SgTable.name, SgTable)
}

export default SgTable