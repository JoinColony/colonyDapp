/* @flow */

import React from 'react';
import { injectIntl } from 'react-intl';

import type { IntlShape, MessageDescriptor } from 'react-intl';

import { getMainClasses } from '~utils/css';

import { icons as iconNames } from './icons.json';
import styles from './Icon.css';

const displayName = 'Icon';

type Appearance = {
  theme?: 'primary' | 'invert',
  size?: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge',
};

type Props = {
  appearance?: Appearance,
  /** Name of icon sprite */
  name: string,
  /** Html title for the icon element */
  title: string | MessageDescriptor,
  /** Values for html title (react-intl interpolation) */
  titleValues?: { [string]: string },
  /** SVG viewbox string */
  viewBox?: string,
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
  appearance = { size: 'normal', theme: 'primary' },
  intl: { formatMessage },
  viewBox: viewBoxOverride = '0 0 30 30',
  name,
  title,
  titleValues,
  ...props
}: Props) => {
  const icon = icons[name];
  const iconHref = typeof icon == 'object' ? `#${icon.default.id}` : icon;
  const iconTitle =
    typeof title == 'object' ? formatMessage(title, titleValues) : title;
  return (
    <i
      title={iconTitle}
      className={getMainClasses(appearance, styles)}
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
