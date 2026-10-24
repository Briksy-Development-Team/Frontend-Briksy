/// <reference types="vite/client" />

declare module "matter-js" {
  const content: any;
  export default content;
  export const Constraint: any;
  export const Engine: any;
  export const Render: any;
  export const Runner: any;
  export const Bodies: any;
  export const Composite: any;
  export const Mouse: any;
  export const MouseConstraint: any;
  export const Events: any;
  export const Body: any;
  export const Vector: any;
  export type Constraint = any;
  export type Body = any;
}

declare namespace Matter {
  type Constraint = any;
  type Body = any;
}