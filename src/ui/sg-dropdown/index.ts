import SgDropdown from './sg-dropdown.vue'

SgDropdown.install = function (app: Vue) {
  app.component(SgDropdown.name, SgDropdown)
}

export default SgDropdown