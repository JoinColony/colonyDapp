import React, { HTMLAttributes, useCallback } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import {
  icons as iconNames,
  multiColorIcons as multiColorIconNames,
} from '../../../../img/icons.json';
import styles from './Icon.css';

const displayName = 'Icon';

type Appearance = {
  theme?: 'primary' | 'invert';
  size?:
    | 'extraTiny'
    | 'tiny'
    | 'small'
    | 'normal'
    | 'medium'
    | 'large'
    | 'huge';
};

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Appearance object */
  appearance?: Appearance;

  /** Disallow children */
  children?: never;

  /** className for icon. Will override anything in appearance */
  className?: string;

  /** Name of icon sprite */
  name: string;

  /** Html title for the icon element */
  title: string | MessageDescriptor;

  /** Values for html title (react-intl interpolation) */
  titleValues?: SimpleMessageValues;

  /** SVG viewbox string */
  viewBox?: string;
}

const getIcons = (map: string[]) =>
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
  viewBox,
  name,
  title,
  titleValues,
  ...props
}: Props) => {
  const { formatMessage } = useIntl();
  // Remove the theme if it's a multiColor icon
  const multiColorAppearance = multiColorIcons[name]
    ? { size: appearance.size || 'normal' }
    : null;
  const icon = icons[name] || multiColorIcons[name];
  const iconHref = typeof icon === 'object' ? `#${icon.default.id}` : icon;
  const iconTitle =
    typeof title === 'object' ? formatMessage(title, titleValues) : title;
  const getViewBox = useCallback(() => {
    switch (appearance.size) {
      case 'extraTiny':
        return '0 0 12 12';
      case 'tiny':
        return '0 0 14 14';
      case 'small':
        return '0 0 16 16';
      case 'normal':
        return '0 0 18 18';
      case 'medium':
        return '0 0 28 28';
      case 'large':
        return '0 0 42 42';
      case 'huge':
        return '0 0 64 64';
      default:
        return '0 0 18 18';
    }
  }, [appearance]);
  const viewBoxOverride = viewBox || getViewBox();
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

export default Icon;
