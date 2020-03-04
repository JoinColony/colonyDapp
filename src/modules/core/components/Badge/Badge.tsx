import React from 'react';
import camelcase from 'camelcase';

import Avatar from '~core/Avatar';

import styles from './Badge.css';

import { badges } from '../../../../img/icons.json';

const badgeIcons = badges.reduce((badgeObj, badgeName) => {
  const id = camelcase(badgeName);
  return {
    ...badgeObj,
    // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require
    [id]: require(`../../../../img/badges/${id}.svg`).default,
  };
}, {});

interface Props {
  name: string;
  title: string;
}

const displayName = 'Badge';

const Badge = ({ name, title }: Props) => {
  const BadgeIcon = badgeIcons[name];
  return (
    <Avatar
      className={styles.main}
      placeholderIcon="question-mark"
      size="m"
      title={title}
    >
      <BadgeIcon />
    </Avatar>
  );
};

Badge.displayName = displayName;

export default Badge;
