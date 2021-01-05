import React, { useState } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColorSelect from '~core/ColorSelect';
import { Color } from '~core/ColorTag';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';

import { Colony, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../transformers';
import { canArchitect } from '../../../users/checks';

import { FormValues } from './ManageDomainsDialog';
import styles from './ManageDomainsDialogForm.css';

const MSG = defineMessages({
  titleCreate: {
    id: 'dashboard.ManageDomainsDialog.ManageDomainsDialogForm.titleCreate',
    defaultMessage: 'Create a new domain',
  },
  titleEdit: {
    id: 'dashboard.ManageDomainsDialog.ManageDomainsDialogForm.titleEdit',
    defaultMessage: 'Edit domain details',
  },
  name: {
    id: 'dashboard.ManageDomainsDialog.ManageDomainsDialogForm.name',
    defaultMessage: 'Domain name',
  },
  purpose: {
    id: 'dashboard.ManageDomainsDialog.ManageDomainsDialogForm.name',
    defaultMessage: 'What is the purpose of this domain?',
  },
  annotation: {
    id: 'dashboard.ManageDomainsDialog.ManageDomainsDialogForm.annotation',
    defaultMessage: 'Explain why you’re creating this domain',
  },
  noPermission: {
    id: 'dashboard.ManageDomainsDialog.ManageDomainsDialogForm.noPermission',
    defaultMessage:
      // eslint-disable-next-line max-len
      'You need the {roleRequired} permission in {domain} to take this action.',
  },
});

interface Props {
  back: () => void;
  colony: Colony;
  id?: string;
}

const ManageDomainsDialogForm = ({
  back,
  colony,
  handleSubmit,
  id,
}: Props & FormikProps<FormValues>) => {
  const [domainColor, setDomainColor] = useState(Color.LightPink);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCreateEditDomain =
    hasRegisteredProfile && canArchitect(allUserRoles);

  return (
    <>
      <DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={id === undefined ? MSG.titleCreate : MSG.titleEdit}
          className={styles.title}
        />
      </DialogSection>
      {!canCreateEditDomain && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Architecture]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.nameAndColorContainer}>
          <div className={styles.domainName}>
            <Input
              label={MSG.name}
              name="name"
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              disabled={!canCreateEditDomain}
            />
          </div>
          <ColorSelect
            activeOption={domainColor}
            appearance={{ alignOptions: 'right' }}
            onColorChange={setDomainColor}
            disabled={!canCreateEditDomain}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="purpose"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={!canCreateEditDomain}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!canCreateEditDomain}
        />
      </DialogSection>
      {!canCreateEditDomain && (
        <DialogSection>
          <span className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Architecture}
                    name={{ id: `role.${ColonyRole.Architecture}` }}
                  />
                ),
                // placeholder for now, needs to be actual domain when `Edit` is done
                domain: id === undefined ? 'Root' : 'DOMAIN PLACEHOLDER',
              }}
            />
          </span>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          text={{ id: 'button.back' }}
          onClick={back}
          appearance={{ theme: 'secondary', size: 'large' }}
        />
        <Button
          text={{ id: 'button.confirm' }}
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          disabled={!canCreateEditDomain}
        />
      </DialogSection>
    </>
  );
};

export default ManageDomainsDialogForm;
