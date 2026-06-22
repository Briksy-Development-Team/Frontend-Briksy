/// <reference types="vite/client" />

declare module 'bootstrap' {
  export class Tab {
    static getOrCreateInstance(element: Element): Tab
  }
}
