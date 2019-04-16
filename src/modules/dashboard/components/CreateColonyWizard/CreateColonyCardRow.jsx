/* @flow */

import type { MessageDescriptor } from 'react-intl';

import type { UserType } from '~immutable';

import React from 'react';
import { compose } from 'recompose';

import styles from './StepConfirmAllInput.css';

import Heading from '~core/Heading';

import { userDidClaimProfile } from '../../../users/checks';
import { withCurrentUser } from '../../../users/hocs';
import { withImmutablePropsToJS } from '~utils/hoc';
import { getNormalizedDomainText } from '~utils/strings';

type Row = {
  title: MessageDescriptor,
  valueKey: string,
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
  currentUser: UserType,
};

const normalize = (name): string => {
  if (name) {
    return getNormalizedDomainText(name) || '';
  }
  return '';
};

const formatUserName = (currentUser, values, option): string => {
  if (userDidClaimProfile(currentUser)) {
    return `@${normalize(currentUser.profile.username)}`;
  }
  return `@${normalize(values[option.valueKey.toString()])}`;
};

const formatColonyName = (values, option: { valueKey: string }): string => {
  const normalized = normalize(values[option.valueKey]);
  return `${normalized} (colony.io/colony/${normalized})`;
};

const concatenatePreviewString = (
  option: { title: MessageDescriptor, valueKey: string },
  values: FormValues,
  currentUser: UserType,
) => {
  if (option.valueKey === `colonyName`) {
    return formatColonyName(values, option);
  }
  return formatUserName(currentUser, values, option);
};

const CardRow = ({ cardOptions, values, currentUser }: CardProps): any[] =>
  cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
      <Heading
        appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'medium', margin: 'small' }}
        text={
          typeof option.valueKey === 'string'
            ? concatenatePreviewString(option, values, currentUser)
            : `${values[option.valueKey[0]]} (${values[option.valueKey[1]]})`
        }
      />
    </div>
  ));

export default compose(
  withCurrentUser,
  withImmutablePropsToJS,
)(CardRow);
