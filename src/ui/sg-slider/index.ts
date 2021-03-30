import SgSlider from './sg-slider.vue'

SgSlider.install = function (app: Vue) {
  app.component(SgSlider.name, SgSlider)
}

export default SgSlider