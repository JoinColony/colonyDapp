import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import UploadAddresses from '~core/UploadAddresses';
import { useLoggedInUser, Colony, AnyUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';

import { FormValues, TABS } from './ManageWhitelistDialog';
import ManageWhitelistActiveToggle from './ManageWhitelistActiveToggle';
import WhitelistedAddresses from './WhitelistedAddresses';
import NoWhitelistedAddressesState from './NoWhitelistedAddressesState';

import styles from './ManageWhitelistDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.title',
    defaultMessage: 'Manage address book',
  },
  annotation: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.annotation`,
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  noPermission: {
    id:
      'dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  addAddress: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.addAddress`,
    defaultMessage: 'Add address',
  },
  whitelisted: {
    id: 'dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.whitelisted',
    defaultMessage: 'Address book',
  },
  inputLabel: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.inputLabel`,
    defaultMessage: `Add wallet address to address book.`,
  },
  inputSuccess: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.inputSuccess`,
    defaultMessage: `Address was added. You can add another one or close modal.`,
  },
  fileSuccess: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.fileSuccess`,
    defaultMessage: `File was added. You can add another one or close modal.`,
  },
});

interface Props {
  back: () => void;
  colony: Colony;
  whitelistedUsers: AnyUser[];
  showInput: boolean;
  toggleShowInput: () => void;
  formSuccess: boolean;
  setFormSuccess: (isSuccess: boolean) => void;
  tabIndex: TABS;
  setTabIndex: (index: TABS) => void;
  backButtonText?: string;
}

const ManageWhitelistDialogForm = ({
  back,
  colony,
  values,
  whitelistedUsers,
  errors,
  isValid,
  isSubmitting,
  handleSubmit,
  showInput,
  toggleShowInput,
  formSuccess,
  setFormSuccess,
  tabIndex,
  setTabIndex,
  resetForm,
  dirty,
  backButtonText,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const hasRegisteredProfile = !!username && !ethereal;
  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Tabs
          selectedIndex={tabIndex}
          onSelect={(newIndex) => {
            setTabIndex(newIndex);
            resetForm({});
          }}
        >
          <TabList
            className={styles.tabsList}
            containerClassName={styles.tabsListContainer}
          >
            <Tab>
              <FormattedMessage {...MSG.addAddress} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.whitelisted} />
            </Tab>
          </TabList>
          <TabPanel>
            <UploadAddresses
              userHasPermission={userHasPermission}
              errors={errors}
              isSubmitting={isSubmitting}
              showInput={showInput}
              toggleShowInput={toggleShowInput}
              formSuccess={formSuccess}
              setFormSuccess={(isSuccess) => setFormSuccess(isSuccess)}
              inputLabelMsg={MSG.inputLabel}
              inputSuccessMsg={MSG.inputSuccess}
              fileSuccessMsg={MSG.fileSuccess}
            />
            <Annotations
              label={MSG.annotation}
              name="annotation"
              disabled={!userHasPermission || isSubmitting}
            />
          </TabPanel>
          <TabPanel>
            {(whitelistedUsers?.length && (
              <>
                <ManageWhitelistActiveToggle
                  isWhitelistActivated={values.isWhitelistActivated}
                />
                <WhitelistedAddresses
                  colony={colony}
                  whitelistedUsers={whitelistedUsers}
                />
              </>
            )) || <NoWhitelistedAddressesState />}
            <Annotations
              label={MSG.annotation}
              name="annotation"
              disabled={!userHasPermission || isSubmitting}
            />
          </TabPanel>
        </Tabs>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{
                      id: `role.${ColonyRole.Root}`,
                    }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: backButtonText || 'button.back' }}
        />
        <Button
          appearance={{
            theme: tabIndex === TABS.ADD_ADDRESS ? 'primary' : 'pink',
            size: 'large',
          }}
          text={{ id: 'button.confirm' }}
          style={{ width: styles.wideButton }}
          disabled={
            (tabIndex === 0 ? !values.whitelistAddress : !dirty) ||
            !userHasPermission ||
            !isValid ||
            isSubmitting
          }
          type="submit"
          loading={isSubmitting}
          onClick={() => handleSubmit()}
        />
      </DialogSection>
    </>
  );
};

export default ManageWhitelistDialogForm;
