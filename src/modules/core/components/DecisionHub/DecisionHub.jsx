/* @flow */

import React from 'react';
import { injectIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';

import styles from './DecisionHub.css';

import Icon from '../Icon';
import Heading from '../Heading';

const displayName = 'DecisionHub';

type RowProps = {
  title: MessageDescriptor,
  subTitle: MessageDescriptor,
  rowIndex: number,
  icons: Array,
};

type DecisionProps = {
  icons: Array,
  rowTitles: Object,
  rowSubTitles: Object,
  icons: Array,
  slugs: Array,
};

const DecisionOption = ({ title, subTitle, rowIndex, icons }: RowProps) => (
  <div className={styles.row}>
    {icons && (
      <div className={styles.rowIcon}>
        <Icon name={icons[rowIndex]} title={icons[rowIndex]} />
      </div>
    )}
    <div className={styles.rowContent}>
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={title}
      />
      <Heading
        appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
        text={subTitle}
      />
    </div>
    <Icon name="caret-right" title="caret-right" />
  </div>
);

const DecisionHub = ({
  icons,
  rowTitles,
  rowSubTitles,
  slugs,
}: DecisionProps) =>
  Object.keys(rowTitles).map((key, i) => {
    const keys = Object.keys(rowSubTitles);
    const title = rowTitles[key];
    const subTitle = rowSubTitles[keys[i]];

    return (
      <Link key={`Link${title.id}`} to={slugs[i]}>
        <DecisionOption
          icons={icons}
          title={title}
          subTitle={subTitle}
          key={`row${title.id}`}
          rowIndex={i}
        />
      </Link>
    );
  });

DecisionHub.displayName = displayName;

export default injectIntl(DecisionHub);
