type KeyOfUndefined<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];

/*
 * Pick only values that are optional and create a new type from it
 */
export type DefaultValues<T> = Partial<Pick<T, KeyOfUndefined<T>>>;
