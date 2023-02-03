import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~core/Link';

import styles from './LinkedIncorporation.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedIncorporation.title',
    defaultMessage: 'Linked Incorporation',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.LinkedIncorporation';

interface Props {
  link: string;
  name: string;
}

const LinkedIncorporation = ({ link, name }: Props) => (
  <div className={styles.wrapper}>
    <div className={styles.titleWrapper}>
      <div className={styles.line} />
      <div className={styles.dot} />
      <div className={styles.line} />
      <div className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </div>
    </div>
    <div className={styles.statusWrapper}>
      <Link to={link} className={styles.link}>
        {name}
      </Link>
    </div>
  </div>
);

LinkedIncorporation.displayName = displayName;

export default LinkedIncorporation;
