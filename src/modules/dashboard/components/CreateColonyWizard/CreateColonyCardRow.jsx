/* @flow */

import type { MessageDescriptor } from 'react-intl';

import type { UserType } from '~immutable';

import React from 'react';
import { compose } from 'recompose';

import styles from './StepConfirmAllInput.css';

import Heading from '~core/Heading';

import { withCurrentUser } from '../../../users/hocs';
import { withImmutablePropsToJS } from '~utils/hoc';

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

const formatUserName = (currentUser, values, option) =>
  `@${
    currentUser && currentUser.profile && currentUser.profile.username
      ? currentUser.profile.username
      : values[option.valueKey.toString()]
  }`;

const formatColonyName = (values, option: { valueKey: string }) =>
  `${values[option.valueKey]} (colony.io/${values[option.valueKey]})`;

const concatenatePreviewString = (
  option: { title: MessageDescriptor, valueKey: string },
  values: FormValues,
  currentUser?: UserType,
) =>
  `${
    option.valueKey === `colonyName`
      ? formatColonyName(values, option)
      : formatUserName(currentUser, values, option)
  }`;

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
