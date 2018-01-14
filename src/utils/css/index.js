/* @flow */

import type { Appearance, StyleObject } from '$types/css';

import { capitalize } from '../strings';

/**
 * Simple utility to generate a default value in case the provided style prop string is not one that was declared in the CSS Modules file.
 *
 * This is best used to provide fallback default values before passing the prop string down to `styleSelector()`
 *
 * @method styleWithDefaults
 *
 * @param {string} styleProp Style prop passed into the component
 * @param {string} defaultProp Default fallback style class name
 *
 * @return {string} If existent, the provided style name, or, the default fallback
 */
export const styleWithDefaults = (styleProp: string, defaultProp: string) =>
  (!styleProp || styleProp.trim() === 'default' ? defaultProp : styleProp);

/**
 * Simple logic selector to generate a class names string from an style object and provided theme and size props.
 * It works by iterating through passed in arguments (no matter how many).
 *
 * The style object is the one resulted from importing in the CSS Modules `.css` file.
 *
 * Works best if the provided style props where already passed through `styleWithDefaults()` as this will provide a fallback.
 *
 * @method styleSelector
 *
 * @param {object} styleObject The styles object resulted from importing the `.css` modules file
 * @param {arguments} restStyleProps Rest of arguments passed in (destructured). So it's more flexible for more style names.
 *
 * @return {string} The composed class names string
 */
export const styleSelector = (styleObject: StyleObject, ...restStyleProps: Array<string>) => restStyleProps
  .reduce((styleString, currentStyle) => `${styleString} ${styleObject[currentStyle] || ''}`, '')
  .trim();

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
  const modifierClasses = Object.keys(modifiers).map((key) => {
    const value = capitalize(modifiers[key]);
    return styleObject[`${key}${value}`];
  }).filter(i => !!i);
  const stateClasses = Object.keys(state).map((key) => {
    if (state[key]) {
      return styleObject[`state${capitalize(key)}`];
    }
    return '';
  }).filter(i => !!i);
  return ([styleObject[themeClass] || styleObject.main].concat(modifierClasses).concat(stateClasses)).join(' ');
};
