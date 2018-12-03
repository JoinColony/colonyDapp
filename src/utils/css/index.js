/* @flow */

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
export const getMainClasses = (
  appearance: Object = {},
  styleObject: { [string]: string } = {},
  state: { [string]: boolean } = {},
) => {
  const { theme, ...modifiers } = appearance;
  const styleArray = [];
  if (theme) {
    const themeClass = `theme${capitalize(theme)}`;
    styleArray.push(styleObject[themeClass]);
  } else {
    styleArray.push(styleObject.main);
  }
  const modifierClasses = Object.keys(modifiers)
    .map(key => styleObject[`${key}${capitalize(modifiers[key])}`])
    .filter(i => !!i);
  const stateClasses = Object.keys(state)
    .map(key => (state[key] ? styleObject[`state${capitalize(key)}`] : ''))
    .filter(i => !!i);
  return [...styleArray, ...modifierClasses, ...stateClasses].join(' ');
};

/**
 * This is a sripped down version of the above method, that is specifically
 * designed to generate the classes required to properly render the Popover
 * Component's various arrows.
 *
 * @NOTE It won't work anywhere else, and in all fairness it should be placed
 * inside the actual component, but to preserve code cleanliness, I've placed
 * it here.
 *
 * @method getPopoverArrowClasses
 *
 * @param {object} appearance Appearance object
 * @param {placement} string Positioning of the arrow (this is reversed from in the Popover)
 * @param {styleObject} CSS modules styles object
 *
 * @return {[type]} [description]
 */
export const getPopoverArrowClasses = (
  { theme }: Object = {},
  placement: string,
  styleObject: { [string]: string } = {},
) => {
  /*
   * @NOTE Arrows have the position encoded in the class's name
   */
  const placementClass = `${placement}Arrow`;
  const styleArray = [styleObject[placementClass]];
  if (theme) {
    /*
     * @NOTE Arrows have the theme name encoded in the class's name (which also
     * has the position encoded, as above)
     */
    const themeClass = `theme${capitalize(theme)}${capitalize(placementClass)}`;
    styleArray.push(styleObject[themeClass]);
  }
  return styleArray.join(' ');
};
