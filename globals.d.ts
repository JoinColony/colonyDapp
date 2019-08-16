declare module '*.css' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
