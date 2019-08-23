/*
 * Given an object type, iterate over its keys and return an exact
 * object type with all of the properties required.
 *
 * Example:
 *
 * type MyType = { description?: string, title?: string };
 * type MyTypeRequired = $Required<MyType>;
 * // ^ {| description: string, title: string |};
 *
 */
export type $Required<T extends {}> = T;
