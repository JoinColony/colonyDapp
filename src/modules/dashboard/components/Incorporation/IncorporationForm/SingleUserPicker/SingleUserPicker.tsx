import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { FieldArrayRenderProps, useField } from 'formik';

import { AnyUser } from '~data/index';
import Icon from '~core/Icon';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { Props as UserPickerProps } from '~core/UserPickerWithSearch/UserPickerWithSearch';

import styles from './SingleUserPicker.css';

export const MSG = defineMessages({
  deleteIconTitle: {
    id: `dashboard.DAOIncorporation.IncorporationForm.SingleUserPicker.deleteIconTitle`,
    defaultMessage: 'Delete recipient',
  },
});

const displayName =
  'dashboard.DAOIncorporation.IncorporationForm.SingleUserPicker';

export interface Props extends UserPickerProps {
  sidebarRef: HTMLElement | null;
  name: string;
  onSelected?: (value: AnyUser) => void;
  remove: FieldArrayRenderProps['remove'];
  index: number;
  setMainContact: (value: any, shouldValidate?: boolean | undefined) => void;
}

const SingleUserPicker = ({
  name,
  remove,
  index,
  setMainContact,
  ...rest
}: Props) => {
  const [, { error, touched, value }] = useField(name);
  const [, { value: mainContact }] = useField('mainContact');
  const { formatMessage } = useIntl();

  const errorMessage =
    error && typeof error === 'object' && formatMessage(error);

  return (
    <div className={styles.protectorWrapper} key={value?.id}>
      <div className={styles.selectWrapper}>
        <UserPickerWithSearch name={name} {...rest} />
        {errorMessage && touched && (
          <div className={styles.protectorError}>{errorMessage}</div>
        )}
      </div>
      <Icon
        name="trash"
        className={styles.deleteIcon}
        onClick={() => {
          remove(index);
          if (
            value.id === mainContact.id &&
            value.profile.walletAddress === mainContact.profile.walletAddress
          ) {
            setMainContact(undefined);
          }
        }}
        title={MSG.deleteIconTitle}
      />
    </div>
  );
};

SingleUserPicker.displayName = displayName;

export default SingleUserPicker;
