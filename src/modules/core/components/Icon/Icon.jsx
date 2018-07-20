/* @flow */

import React from 'react';

import type { IntlShape, MessageDescriptor } from 'react-intl';

import { injectIntl } from 'react-intl';

import { styleWithDefaults, styleSelector } from '~utils/css';
import { icons as iconNames } from './icons.json';

import styles from './Icon.css';

const displayName = 'Icon';

type ThemeType = 'default' | 'inverted';

type SizeType = 'xSmall' | 'small' | 'medium' | 'large';

type Props = {
  /** html class (in addition to composed classNames)  */
  className?: string,
  /** Size to display icon */
  size?: SizeType,
  /** Theme of the icon */
  theme?: ThemeType,
  /** Name of icon sprite */
  name: string,
  /** Html title for the icon element */
  title: string | MessageDescriptor,
  /** Values for html title (react-intl interpolation) */
  titleValues?: { [string]: string },
  /** SVG viewbox string */
  viewBox?: string,
  /** @ignore injected by HOC */
  composedStyles: string,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

type IconSVG = { [string]: Object };

const icons: IconSVG = iconNames.reduce((prev, current) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require, no-param-reassign
  prev[current] = require(`../../../../img/icons/${current}.svg`);
  return prev;
}, {});

const Icon = ({
  intl: { formatMessage },
  viewBox: viewBoxOverride = '0 0 30 30',
  className,
  size,
  theme,
  name,
  title,
  titleValues,
  ...props
}: Props) => {
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
  const iconHref = typeof icon == 'object' ? `#${icon.default.id}` : icon;
  const iconTitle =
    typeof title == 'object' ? formatMessage(title, titleValues) : title;
  return (
    <i title={iconTitle} className={composedStyles} {...props}>
      <svg viewBox={viewBoxOverride}>
        <use xlinkHref={iconHref} />
      </svg>
    </i>
  );
};

Icon.displayName = displayName;

export default injectIntl(Icon);
