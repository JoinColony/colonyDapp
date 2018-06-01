/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

const displayName = 'core.Icon';

const propTypes = {
  iconTitle: PropTypes.string,
  intl: intlShape,
  composedStyles: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  theme: PropTypes.string,
  icon: PropTypes.string,
  viewBox: PropTypes.string,
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
}) => (
  <i title={iconTitle} className={composedStyles} {...props}>
    <svg viewBox={viewBoxOverride || '0 0 30 30'}>
      <use xlinkHref={icon} />
    </svg>
  </i>
);

Icon.displayName = displayName;

Icon.propTypes = propTypes;

export default Icon;
