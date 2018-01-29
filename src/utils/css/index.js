/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Appearance, StyleObject } from '~types/css';

import { capitalize } from '../strings';

/**
 * This function maps an appearance object onto CSS modules classes
 * The theme replaces the main class, the others will be treated as modifiers for the main class.
 * Example:
 *
 * appearance={{ theme: 'foo', colorSchema: 'dark', direction: 'horizontal' }}
 * yields
 * Component_themeFoo_xxx Component_colorSchemaDark_xxx Component_directionHorizontal_xxx
 *
 * appearance={{ colorSchema: 'dark', direction: 'horizontal' }}
 * yields
 * Component_main_xxx Component_colorSchemaDark_xxx Component_directionHorizontal_xxx
 *
 * @method getMainClasses
 *
 * @param {object} appearance Appearance object
 * @param {styleObject} CSS modules styles object
 *
 * @return {string} The composed class names string
 */
export const getMainClasses = (appearance: Appearance = {}, styleObject: StyleObject = {}, state: { [string]: boolean } = {}) => {
  const { theme, ...modifiers } = appearance;
  const themeClass = `theme${capitalize(theme)}`;
  const modifierClasses = Object.keys(modifiers)
    .map(key => styleObject[`${key}${capitalize(modifiers[key])}`])
    .filter(i => !!i);
  const stateClasses = Object.keys(state)
    .map(key => (state[key] ? styleObject[`state${capitalize(key)}`] : ''))
    .filter(i => !!i);
  return [styleObject[themeClass] || styleObject.main, ...modifierClasses, ...stateClasses].join(' ');
};
