/* @flow */

import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';

import styles from './OrganizationsAdmins.css';

import type { FormikProps } from 'formik';
import type { UserData } from '~core/SingleUserPicker';

const MSG = defineMessages({
  labelAddAdmins: {
    id: 'admin.Organizations.OrganizationsAdmins.labelAddAdmins',
    defaultMessage: 'Add new admin',
  },
  placeholderAddAdmins: {
    id: 'admin.Organizations.OrganizationsAdmins.placeholderAddAdmins',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  buttonAddAdmin: {
    id: 'admin.Organizations.OrganizationsAdmins.buttonAddAdmin',
    defaultMessage: 'Add Admin',
  },
});

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );
const ItemWithAddress = props => <ItemDefault showMaskedAddress {...props} />;

const displayName: string = 'admin.Organizations.OrganizationsAdmins';

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

const OrganizationsAdmins = ({ availableAdmins }: Props) => (
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

OrganizationsAdmins.displayName = displayName;

export default OrganizationsAdmins;
