/* @flow */

import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';

import styles from './OrganizationAddAdmins.css';

import type { FormikProps } from 'formik';
import type { UserData } from '~core/SingleUserPicker';

const MSG = defineMessages({
  labelAddAdmins: {
    id: 'admin.Organizations.OrganizationAddAdmins.labelAddAdmins',
    defaultMessage: 'Add new admin',
  },
  placeholderAddAdmins: {
    id: 'admin.Organizations.OrganizationAddAdmins.placeholderAddAdmins',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  buttonAddAdmin: {
    id: 'admin.Organizations.OrganizationAddAdmins.buttonAddAdmin',
    defaultMessage: 'Add Admin',
  },
});

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );
const ItemWithAddress = props => <ItemDefault showMaskedAddress {...props} />;

const displayName: string = 'admin.Organizations.OrganizationAddAdmins';

const validationSchema = yup.object({
  newAdminUser: yup
    .object()
    .shape({
      id: yup.string(),
      username: yup.string(),
      fullname: yup.string(),
    })
    .required(),
});

type FormValues = {
  newAdminUser: UserData,
};

type Props = {
  availableAdmins: Array<UserData>,
};

const OrganizationAddAdmins = ({ availableAdmins }: Props) => (
  <div className={styles.main}>
    <Formik onSubmit={console.log} validationSchema={validationSchema}>
      {({ handleSubmit, isValid }: FormikProps<FormValues>) => (
        <form onSubmit={handleSubmit}>
          <div className={styles.pickerWrapper}>
            <SingleUserPicker
              name="newAdminUser"
              label={MSG.labelAddAdmins}
              placeholder={MSG.placeholderAddAdmins}
              itemComponent={ItemWithAddress}
              data={availableAdmins}
              filter={filter}
            />
          </div>
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            style={{ width: styles.wideButton }}
            text={MSG.buttonAddAdmin}
            type="submit"
            disabled={!isValid}
          />
        </form>
      )}
    </Formik>
  </div>
);

OrganizationAddAdmins.displayName = displayName;

export default OrganizationAddAdmins;
