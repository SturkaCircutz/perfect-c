/// <reference types="vite/client" />

// Lets TypeScript understand `import Foo from './Foo.vue'`.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
