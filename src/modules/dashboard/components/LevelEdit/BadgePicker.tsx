import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useField } from 'formik';
import camelcase from 'camelcase';

import { InputLabel } from '~core/Fields';
import Avatar from '~core/Avatar';
import Button from '~core/Button';

import styles from './AvatarPicker.css';

import { badges } from '../../../../img/icons.json';

const badgeIcons = badges.map(badgeName => {
  const id = camelcase(badgeName);
  return {
    id,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    Badge: require(`../../../../img/badges/${id}.svg`).default,
    title: badgeName,
  };
});

const MSG = defineMessages({
  label: {
    id: 'core.AvatarPicker.label',
    defaultMessage: 'Select Avatar',
  },
  explainer: {
    id: 'core.AvatarPicker.explainer',
    defaultMessage:
      'Users will earn the selected achievement once they complete the level.',
  },
});

interface Props {
  name: string;
}

const displayName = 'core.AvatarPicker';

const AvatarPicker = ({ name }: Props) => {
  const [, { value }, { setValue }] = useField(name);
  return (
    <div>
      <InputLabel label={MSG.label} />
      <FormattedMessage {...MSG.explainer} />
      <div className={styles.avatars}>
        {badgeIcons.map(({ Badge, id, title }) => (
          <Button
            className={value === id ? styles.avatarSelected : styles.avatar}
            onClick={() => setValue(id)}
          >
            <Avatar key={id} placeholderIcon="cup" size="m" title={title}>
              <Badge />
            </Avatar>
          </Button>
        ))}
      </div>
    </div>
  );
};

AvatarPicker.displayName = displayName;

export default AvatarPicker;
