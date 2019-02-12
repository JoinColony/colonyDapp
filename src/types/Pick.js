/* @flow */

export type $Pick<Origin: Object, Keys: Object> = $Exact<
  $ObjMapi<Keys, <Key>(k: Key) => $ElementType<Origin, Key>>,
>;
