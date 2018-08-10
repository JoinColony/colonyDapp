/* @flow */

import type { ComponentType } from 'react';

export type ItemComponentType = ComponentType<{
  itemData: any,
  selected: boolean,
}>;

export type Choose = void => void;

export type Select = (idx: number) => void;

export type Data = { id: string };
