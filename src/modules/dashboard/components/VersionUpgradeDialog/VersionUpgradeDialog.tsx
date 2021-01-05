import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { pipe, mergePayload, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { Colony, useNetworkContracts } from '~data/index';
import { WizardDialogType } from '~utils/hooks';
import { canBeUpgraded } from '../../../dashboard/checks';

import NetworkContractUpgradeDialog from '~dashboard/NetworkContractUpgradeDialog';

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
  fromDomain?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.VersionUpgradeDialog';

const VersionUpgradeDialog = ({
  colony: { colonyAddress, version, colonyName },
  colony,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  const transform = useCallback(
    pipe(
      mergePayload({ colonyAddress, version, colonyName }),
      withMeta({ history }),
    ),
    [colonyAddress, version, colonyName],
  );

  const { version: networkVersion } = useNetworkContracts();
  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_ACTION_VERSION_UPGRADE}
      error={ActionTypes.COLONY_ACTION_VERSION_UPGRADE_ERROR}
      success={ActionTypes.COLONY_ACTION_VERSION_UPGRADE_SUCCESS}
      transform={transform}
      onSuccess={close}
    >
      {({ handleSubmit }) => {
        return (
          <NetworkContractUpgradeDialog
            cancel={cancel}
            close={close}
            onClick={handleSubmit}
            disabled={
              !networkVersion ||
              !canBeUpgraded(colony, parseInt(networkVersion, 10))
            }
          />
        );
      }}
    </ActionForm>
  );
};

VersionUpgradeDialog.displayName = displayName;

export default VersionUpgradeDialog;
