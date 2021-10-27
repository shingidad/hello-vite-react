import {} from 'typesafe-actions';

declare module 'typesafe-actions' {
  export type Service = typeof import('./index').default;
}
