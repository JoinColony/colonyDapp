import { ComponentType, createElement, forwardRef, Ref } from 'react';

type HookFn<H, P extends {}, R> = (hookParams: H, props: P) => R;

export const withHooks = <H, P, R>(hookFn: HookFn<H, P, R>) => (
  Component: ComponentType<P>,
) => (hookParams: H) => (props: P) => {
  const results = hookFn(hookParams, props);
  return createElement(Component, { ...props, ...results });
};

export interface ForwardedRefProps {
  forwardedRef: Ref<any>;
}

export const withForwardingRef = <Props extends Record<string, any>>(
  BaseComponent: React.ReactType<Props>,
) =>
  forwardRef<ForwardedRefProps, Props>((props, ref) =>
    createElement(BaseComponent, { ...props, forwardedRef: ref }),
  );
