const blurHandler = function (e: any) {
  const el = e.target
  let tempEl = el.parentElement
  while (tempEl) {
    const classList = [...tempEl.classList]
    if (classList.includes('sg-form-item')) {
      tempEl.classList.remove('sg-focus-within')
      if (el.value) {
        tempEl.classList.add('sg-input-value')
      } else {
        tempEl.classList.remove('sg-input-value')
      }
      el.removeEventListener('blur', blurHandler)
      break
    }
    tempEl = tempEl.parentElement
  }
}

const focusHandler = function (e: any) {
  let tempEl = e.target.parentElement
  while (tempEl) {
    const classList = [...tempEl.classList]
    if (classList.includes('sg-form-item')) {
      tempEl.classList.add('sg-focus-within')
      e.target.addEventListener('blur', blurHandler)
      break
    }
    tempEl = tempEl.parentElement
  }
}

export default {
  install: function (app: Vue) {
    app.directive('focus-within', {
      created: function (el: HTMLElement) {
        el.addEventListener('focus', focusHandler)
      },
      mounted: function (el: HTMLElement) {
        blurHandler({ target: el })
      },
      beforeUpdate: function () { },
      updated: function () { },
      beforeUnmount: function (el: HTMLElement) {
        el.removeEventListener('focus', focusHandler)
      }
    })
  }
}
