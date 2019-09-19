/*
 Pick all the values from an object and make them `any` (handy for immutable default props)
 */
export type DefaultValues<V> = Record<keyof V, any>;
