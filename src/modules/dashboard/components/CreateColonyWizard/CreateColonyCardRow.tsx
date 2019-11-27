import { MessageDescriptor } from 'react-intl';
import React, { useCallback } from 'react';

import Heading from '~core/Heading';
import ENS from '~lib/ENS';
import { useCurrentUser } from '~data/helpers';

import styles from './CreateColonyCardRow.css';

export interface Row {
  title: MessageDescriptor;
  valueKey: string | [string, string];
}

interface FormValues {
  colonyName: string;
  displayName: string;
  tokenAddress?: string;
  tokenChoice: 'create' | 'select';
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  username: string;
}

interface CardProps {
  cardOptions: Row[];
  values: FormValues;
}

const normalize = (name): string =>
  name ? ENS.normalizeAsText(name) || '' : '';

const formatUsername = (username, values, option) => {
  const normalizedUsername = normalize(
    username || values[option.valueKey.toString()],
  );
  return (
    <span title={`@${normalizedUsername}`} className={styles.username}>
      {`@${normalizedUsername}`}
    </span>
  );
};

const formatColonyName = (values, option: { valueKey: string }) => {
  const normalized = normalize(values[option.valueKey]);
  return (
    <>
      <span title={values.displayName} className={styles.firstValue}>
        {values.displayName}
      </span>
      <span
        title={`(colony.io/colony/${normalized})`}
        className={styles.secondValue}
      >
        {`(colony.io/colony/${normalized})`}
      </span>
    </>
  );
};

const formatToken = (values, { valueKey }) => (
  <>
    <span title={values[valueKey[0]]} className={styles.tokenSymbol}>
      {values[valueKey[0]]}
    </span>
    <span title={`(${values[valueKey[1]]})`} className={styles.tokenName}>
      {`(${values[valueKey[1]]})`}
    </span>
  </>
);

const formatGeneralEntry = (values, { valueKey }) => (
  <>
    <span title={values[valueKey[0]]} className={styles.firstValue}>
      {values[valueKey[0]]}
    </span>
    <span title={`(${values[valueKey[1]]})`} className={styles.secondValue}>
      {`(${values[valueKey[1]]})`}
    </span>
  </>
);

const CardRow = ({ cardOptions, values }: CardProps) => {
  const { username } = useCurrentUser();

  const getHeadingPreviewText = useCallback(
    option => {
      if (option.valueKey === 'colonyName') {
        return formatColonyName(values, option);
      }
      if (option.valueKey === 'username') {
        return formatUsername(username, values, option);
      }
      if (option.valueKey.length && option.valueKey[0] === 'tokenSymbol') {
        return formatToken(values, option);
      }
      return formatGeneralEntry(values, option);
    },
    [values, username],
  );

  return (
    <>
      {cardOptions.map(option => (
        <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
          <Heading
            appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }}
            text={option.title}
          />
          <Heading
            appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}
          >
            {getHeadingPreviewText(option)}
          </Heading>
        </div>
      ))}
    </>
  );
};

export default CardRow;
