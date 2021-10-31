declare module 'react' {
  function memo<T extends React.ComponentType<any>>(
    component: T,
    areEqual?: (
      prev: Readonly<React.ComponentProps<T>>,
      next: Readonly<React.ComponentProps<T>>
    ) => boolean
  ): T;
}
export {};
