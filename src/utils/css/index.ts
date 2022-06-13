/* eslint-disable import/prefer-default-export */

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
 * @param {state} State styles object
 *
 * @return {string} The composed class names string
 */
export const getMainClasses = (
  { theme, ...modifiers }: any = {},
  styleObject: { [k: string]: string } = {},
  state: { [k: string]: boolean } = {},
) => {
  const styles = [styleObject[theme ? `theme${capitalize(theme)}` : 'main']];
  const modifierClasses = Object.keys(modifiers)
    .map((key) => styleObject[`${key}${capitalize(modifiers[key])}`])
    .filter(Boolean);
  const stateClasses = Object.keys(state)
    .map((key) => (state[key] ? styleObject[`state${capitalize(key)}`] : ''))
    .filter(Boolean);
  return [...styles, ...modifierClasses, ...stateClasses].join(' ');
};

export const removeValueUnits = (valueWithUnit: string): number => {
  /*
   * Taken from MDN: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
   */
  const measurementUnits = [
    'cm',
    'mm',
    'Q',
    'in',
    'pc',
    'pt',
    'px',
    'em',
    'ex',
    'ch',
    'rem',
    'lh',
    'vw',
    'vh',
    'vmin',
    'vmax',
    /*
     * Percent char is escaped for sanity
     */

    // eslint-disable-next-line no-useless-escape, prettier/prettier
    '\%', 
  ];
  return parseInt(
    valueWithUnit.replace(
      new RegExp(`(${measurementUnits.join('|')})$`, 'g'),
      '',
    ),
    10,
  );
};
