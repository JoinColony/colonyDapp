/* @flow */

import React from 'react';
import { injectIntl } from 'react-intl';

import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';

import { getMainClasses } from '~utils/css';

import {
  icons as iconNames,
  multiColorIcons as multiColorIconNames,
} from './icons.json';
import styles from './Icon.css';

const displayName = 'Icon';

type Appearance = {
  theme?: 'primary' | 'invert',
  size?: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge' | 'image',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** className for icon. Will override anything in appearance */
  className?: string,
  /** Name of icon sprite */
  name: string,
  /** Html title for the icon element */
  title: string | MessageDescriptor,
  /** Values for html title (react-intl interpolation) */
  titleValues?: MessageValues,
  /** SVG viewbox string */
  viewBox?: string,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const getIcons = (map: Array<string>) =>
  map.reduce((prev, current) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, no-param-reassign
    prev[current] = require(`../../../../img/icons/${current}.svg`);
    return prev;
  }, {});

const icons = getIcons(iconNames);
const multiColorIcons = getIcons(multiColorIconNames);

const Icon = ({
  appearance = { size: 'normal', theme: 'primary' },
  className,
  intl: { formatMessage },
  viewBox: viewBoxOverride = '0 0 30 30',
  name,
  title,
  titleValues,
  ...props
}: Props) => {
  // Remove the theme if it's a multiColor icon
  const multiColorAppearance = multiColorIcons[name]
    ? { size: appearance.size || 'normal' }
    : null;
  const icon = icons[name] || multiColorIcons[name];
  const iconHref = typeof icon == 'object' ? `#${icon.default.id}` : icon;
  const iconTitle =
    typeof title == 'object' ? formatMessage(title, titleValues) : title;
  return (
    <i
      title={iconTitle}
      className={
        className || getMainClasses(multiColorAppearance || appearance, styles)
      }
      {...props}
    >
      <svg viewBox={viewBoxOverride}>
        <use xlinkHref={iconHref} />
      </svg>
    </i>
  );
};

Icon.displayName = displayName;

export default injectIntl(Icon);
