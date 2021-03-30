declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare interface Vue {
  component: Function
  directive: Function
}

declare interface Window {
  _sgGlobal: any
  _sgCache: any
}
