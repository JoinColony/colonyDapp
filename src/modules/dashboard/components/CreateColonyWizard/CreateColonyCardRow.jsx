/* @flow */

import type { MessageDescriptor } from 'react-intl';

import type { UserType } from '~immutable';

// $FlowFixMe Update flow
import React, { useCallback } from 'react';

import styles from './StepConfirmAllInput.css';

import Heading from '~core/Heading';

import { userDidClaimProfile } from '../../../users/checks';
import { currentUserSelector } from '../../../users/selectors';
import { getNormalizedDomainText } from '~utils/strings';
import { useSelector } from '~utils/hooks';

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
  if (userDidClaimProfile(currentUser)) {
    return `@${normalize(currentUser.profile.username)}`;
  }
  return `@${normalize(values[option.valueKey.toString()])}`;
};

const formatColonyName = (values, option: { valueKey: string }) => {
  const normalized = normalize(values[option.valueKey]);
  return `${values.displayName} (colony.io/colony/${normalized})`;
};

const CardRow = ({ cardOptions, values }: CardProps): any[] => {
  const currentUser: UserType = useSelector(currentUserSelector);

  const getHeadingPreviewText = useCallback(
    option => {
      switch (option.valueKey) {
        case 'colonyName':
          return formatColonyName(values, option);
        case 'username':
          return formatUsername(currentUser, values, option);
        default:
          return `${values[option.valueKey[0]]} (${
            values[option.valueKey[1]]
          })`;
      }
    },
    [values, currentUser],
  );

  return cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
      <Heading
        appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}
        text={getHeadingPreviewText(option, values, currentUser)}
      />
    </div>
  ));
};

export default CardRow;
