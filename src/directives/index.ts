import FocusWithin from './focus-within'

const directives = [FocusWithin]

export default {
  install: function (app: Vue) {
    directives.forEach(o => {
      o.install(app)
    })
  }
}
