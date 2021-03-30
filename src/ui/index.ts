import { sgScroll, sgSticky } from '@/libs/sg-scroll/index'

import './config'
import './style/index.scss'

import SgButton from './sg-button'
import SgForm from './sg-form'
import SgToast from './sg-toast'
import SgConfirm from './sg-confirm'
import SgScroll from './sg-scroll'
import SgDropdown from './sg-dropdown'
import SgTime from './sg-time'
import SgHeader from './sg-header'
import SgSlider from './sg-slider'
import SgTable from './sg-table'

const uiComps = [
  SgButton,
  SgForm,
  SgToast,
  SgConfirm,
  SgScroll,
  SgDropdown,
  SgTime,
  SgHeader,
  SgSlider,
  SgTable,
]

sgScroll.init()
sgSticky.init()

export default {
  install: function (app: Vue) {
    uiComps.forEach(o => {
      app.use(o)
    })
  }
}