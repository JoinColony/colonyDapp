/* @flow */

import React from 'react';

import type { IntlShape } from 'react-intl';

import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { injectIntl } from 'react-intl';

import { styleWithDefaults, styleSelector } from '~utils/css';
import { icons as iconsList } from './icons.json';

import styles from './Icon.css';

const displayName = 'core.Icon';

type Props = {
  iconTitle: string | Object,
  intl: IntlShape,
  composedStyles: string,
  className: string,
  size: string,
  theme: string,
  icon: string | Object,
  viewBox: string,
};

const Icon = ({
  iconTitle,
  composedStyles,
  icon,
  intl,
  viewBox: viewBoxOverride,
  className,
  size,
  theme,
  ...props
}: Props) => (
  <i title={iconTitle} className={composedStyles} {...props}>
    <svg viewBox={viewBoxOverride || '0 0 30 30'}>
      <use xlinkHref={icon} />
    </svg>
  </i>
);

Icon.displayName = displayName;

/* eslint-disable import/no-dynamic-require */
const icons = iconsList.reduce((prev, current) => {
  const iconObject = prev;
  iconObject[current] = require(`../../../../img/icons/${current}.svg`); // eslint-disable-line global-require
  return iconObject;
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
      const icon = icons[name];
      return {
        icon: typeof icon == 'object' ? `#${icon.default.id}` : icon,
        iconTitle:
          title && title.id ? formatMessage(title, title.values) : title,
        composedStyles,
      };
    },
  ),
)(Icon);
