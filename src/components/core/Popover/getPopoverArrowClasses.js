/* @flow */

import { capitalize } from '~utils/strings';

/**
 * This is a stripped down version of the `getMainClasses` method, that is specifically
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
 * @return {string} The string of classes to pass down to the arrow element
 */
const getPopoverArrowClasses = (
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

export default getPopoverArrowClasses;
