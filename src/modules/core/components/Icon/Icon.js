/* @flow */

import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { injectIntl } from 'react-intl';

import { styleWithDefaults, styleSelector } from '../../../../utils/css';
import { icons as iconsList } from './icons.json';

import styles from './Icon.css';
import Icon from './Icon.jsx';

/* eslint-disable import/no-dynamic-require */
const icons = iconsList.reduce((prev, current) => {
  prev[current] = require(`../../../../img/icons/${current}.svg`);
  return prev;
}, {});

export default compose(
  injectIntl,
  withProps(
    ({ size, theme, name, className, title, intl: { formatMessage } }) => {
      const sizeWithDefaults = styleWithDefaults(size, 'small');
      const themeWithDefaults = styleWithDefaults(theme, 'default');
      /*
     * I've left in the ability to add new styles (in addition to the existent ones) as most likely we are going to need
     * this in the future when implementing various non-standard icon sizes, shapes and colors
     */
      const composedStyles = `${styleSelector(
        styles,
        sizeWithDefaults,
        themeWithDefaults,
      )} ${className || ''}`.trim();
      return {
        icon: icons[name],
        iconTitle:
          title && title.id ? formatMessage(title, title.values) : title,
        composedStyles,
      };
    },
  ),
)(Icon);
