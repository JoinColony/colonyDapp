/* @flow */

import type { MessageDescriptor } from 'react-intl';

import type { UserType } from '~immutable';

// $FlowFixMe Update flow
import React, { useCallback } from 'react';

import Heading from '~core/Heading';

import { userDidClaimProfile } from '../../../users/checks';
import { currentUserSelector } from '../../../users/selectors';
import { getNormalizedDomainText } from '~utils/strings';
import { useSelector } from '~utils/hooks';

import styles from './CreateColonyCardRow.css';

type Row = {
  title: MessageDescriptor,
  valueKey: string | [string, string],
};

type FormValues = {
  colonyName: string,
  displayName: string,
  username: string,
  tokenName: string,
  tokenSymbol: string,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: FormValues,
};

const normalize = (name): string => {
  if (name) {
    return getNormalizedDomainText(name) || '';
  }
  return '';
};

const formatUsername = (currentUser, values, option) => {
  const username = normalize(
    userDidClaimProfile(currentUser)
      ? currentUser.profile.username
      : values[option.valueKey.toString()],
  );
  return (
    <span title={`@${username}`} className={styles.username}>
      {`@${username}`}
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

const CardRow = ({ cardOptions, values }: CardProps): any[] => {
  const currentUser: UserType = useSelector(currentUserSelector);

  const getHeadingPreviewText = useCallback(
    option => {
      if (option.valueKey === 'colonyName') {
        return formatColonyName(values, option);
      }
      if (option.valueKey === 'username') {
        return formatUsername(currentUser, values, option);
      }
      if (option.valueKey.length && option.valueKey[0] === 'tokenSymbol') {
        return formatToken(values, option);
      }
      return formatGeneralEntry(values, option);
    },
    [values, currentUser],
  );

  return cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
      <Heading
        appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }}
        text={option.title}
      />
      <Heading appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}>
        {getHeadingPreviewText(option, values, currentUser)}
      </Heading>
    </div>
  ));
};

export default CardRow;
