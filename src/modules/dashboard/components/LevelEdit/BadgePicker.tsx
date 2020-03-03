import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useField } from 'formik';
import camelcase from 'camelcase';

import { InputLabel } from '~core/Fields';
import Avatar from '~core/Avatar';
import Button from '~core/Button';

import styles from './BadgePicker.css';

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
    id: 'core.BadgePicker.label',
    defaultMessage: 'Select Avatar',
  },
  explainer: {
    id: 'core.BadgePicker.explainer',
    defaultMessage:
      'Users will earn the selected achievement once they complete the level.',
  },
  badgeTitleNone: {
    id: 'core.BadgePicker.badgeTitleNone',
    defaultMessage: 'None',
  },
});

interface Props {
  name: string;
}

const displayName = 'core.BadgePicker';

const BadgePicker = ({ name }: Props) => {
  const [, { value }, { setValue }] = useField(name);
  return (
    <div className={styles.main}>
      <InputLabel label={MSG.label} />
      <FormattedMessage {...MSG.explainer} />
      <div className={styles.avatars}>
        {badgeIcons.map(({ Badge, id, title }) => (
          <Button
            key={id}
            className={value === id ? styles.avatarSelected : styles.avatar}
            onClick={() => setValue(id)}
          >
            <Avatar placeholderIcon="question-mark" size="m" title={title}>
              <Badge />
            </Avatar>
          </Button>
        ))}
      </div>
    </div>
  );
};

BadgePicker.displayName = displayName;

export default BadgePicker;
