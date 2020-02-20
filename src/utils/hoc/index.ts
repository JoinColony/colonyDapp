import { ComponentType, createElement } from 'react';

type HookFn<H, P extends {}, R> = (hookParams: H, props: P) => R;

export const withHooks = <H, P, R>(hookFn: HookFn<H, P, R>) => (
  Component: ComponentType<P>,
) => (hookParams: H) => (props: P) => {
  const results = hookFn(hookParams, props);
  return createElement(Component, { ...props, ...results });
};
