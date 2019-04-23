/* @flow */

import type { MessageDescriptor } from 'react-intl';

// $FlowFixMe Update flow
import React, { useCallback } from 'react';

import styles from './StepConfirmAllInput.css';

import Heading from '~core/Heading';

import { getNormalizedDomainText } from '~utils/strings';
import { useSelector } from '~utils/hooks';

import {
  usernameSelector,
  walletAddressSelector,
} from '../../../users/selectors';

type Row = {
  title: MessageDescriptor,
  valueKey: *,
};

type FormValues = {
  colonyName: string,
  username: string,
  tokenName: string,
  tokenSymbol: string,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: FormValues,
};

const normalize = (name: ?string) =>
  (name && getNormalizedDomainText(name)) || '';

const formatUsername = (username, values, option) =>
  `@${normalize(username || values[option.valueKey.toString()])}`;

const formatColonyName = (values, option) => {
  const normalized = normalize(values[option.valueKey]);
  return `${normalized} (colony.io/colony/${normalized})`;
};

const CardRow = ({ cardOptions, values }: CardProps): any[] => {
  const walletAddress = useSelector(walletAddressSelector);
  const username = useSelector(usernameSelector, [walletAddress]);

  const getHeadingPreviewText = useCallback(
    option => {
      switch (option.valueKey) {
        case 'colonyName':
          return formatColonyName(values, option);
        case 'username':
          return formatUsername(username, values, option);
        default:
          return `${values[option.valueKey[0]]} (${
            values[option.valueKey[1]]
          })`;
      }
    },
    [username, values],
  );

  return cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
      <Heading
        appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}
        text={getHeadingPreviewText(option, values, username)}
      />
    </div>
  ));
};

export default CardRow;
