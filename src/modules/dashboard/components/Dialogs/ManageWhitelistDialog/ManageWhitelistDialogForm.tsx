import React, { useState } from 'react';
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

import { FormValues } from './ManageWhitelistDialog';
import ManageWhitelistActiveToggle from './ManageWhitelistActiveToggle';
import WhitelistedAddresses from './WhitelistedAddresses';
import NoWhitelistedAddressesState from './NoWhitelistedAddressesState';

import styles from './ManageWhitelistDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.title',
    defaultMessage: 'Manage whitelist',
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
    defaultMessage: 'Whitelisted',
  },
  inputSuccess: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.inputSuccess`,
    defaultMessage: `Address is whitelisted now. You can add another one or close modal.`,
  },
  fileSuccess: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.fileSuccess`,
    defaultMessage: `File was added. You can add another one or close modal.`,
  },
});

const TABS = {
  ADD_ADDRESS: 0,
  WHITELISTED: 1,
};

interface Props {
  back: () => void;
  colony: Colony;
  whitelistedUsers: AnyUser[];
  showInput: boolean;
  toggleShowInput: () => void;
  formSuccess: boolean;
  setFormSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
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
}: Props & FormikProps<FormValues>) => {
  const [tabIndex, setTabIndex] = useState<number>(TABS.ADD_ADDRESS);
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
              setFormSuccess={setFormSuccess}
              inputSuccessMsg={MSG.inputSuccess}
              fileSuccessMsg={MSG.fileSuccess}
            />
          </TabPanel>
          <TabPanel>
            {(whitelistedUsers?.length && (
              <>
                <ManageWhitelistActiveToggle
                  isWhiletlistActivated={values.isWhiletlistActivated}
                />
                <WhitelistedAddresses
                  colony={colony}
                  whitelistedUsers={whitelistedUsers}
                />
              </>
            )) || <NoWhitelistedAddressesState />}
          </TabPanel>
        </Tabs>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!userHasPermission}
        />
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
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'pink', size: 'large' }}
          text={{ id: 'button.confirm' }}
          style={{ width: styles.wideButton }}
          disabled={
            (tabIndex === TABS.WHITELISTED && !whitelistedUsers?.length) ||
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
