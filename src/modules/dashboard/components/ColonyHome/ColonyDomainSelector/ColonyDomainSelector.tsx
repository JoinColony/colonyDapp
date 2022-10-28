import React, { ReactNode, useCallback } from 'react';
import { ColonyVersion, ROOT_DOMAIN_ID, Extension } from '@colony/colony-js';

import ColorTag, { Color } from '~core/ColorTag';
import { Form, SelectOption } from '~core/Fields';
import DomainDropdown from '~core/DomainDropdown';
import { useDialog } from '~core/Dialog';
import EditDomainDialog from '~dialogs/EditDomainDialog';

import { Colony, useLoggedInUser, useColonyExtensionsQuery } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

import CreateDomainButton from './CreateDomainButton';

import styles from './ColonyDomainSelector.css';

interface FormValues {
  filteredDomainId: string;
}

interface Props {
  filteredDomainId?: number;
  onDomainChange?: (domainId: number) => any;
  colony: Colony;
}

const displayName = 'dashboard.ColonyHome.ColonyDomainSelector';

const ColonyDomainSelector = ({
  filteredDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  onDomainChange,
  colony: { colonyAddress },
  colony,
}: Props) => {
  const { networkId, ethereal, username } = useLoggedInUser();
  const { data } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const openEditDialog = useDialog(EditDomainDialog);
  const handleEditDomain = useCallback(
    (ethDomainId: number) =>
      openEditDialog({
        ethDomainId,
        colony,
      }),
    [openEditDialog, colony],
  );

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      const domain = colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      return domain ? domain.color : defaultColor;
    },
    [colony],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const value = option ? option.value : undefined;
      const color = getDomainColor(value);
      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} />{' '}
          <div className={styles.activeItemLabel}>{label}</div>
        </div>
      );
    },
    [getDomainColor],
  );
  const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const isSupportedColonyVersion =
    parseInt(colony.version, 10) >= ColonyVersion.LightweightSpaceship;
  const hasRegisteredProfile = !!username && !ethereal;
  const canInteract =
    isSupportedColonyVersion &&
    isNetworkAllowed &&
    hasRegisteredProfile &&
    colony?.isDeploymentFinished &&
    !mustUpgradeOneTx;

  return (
    <Form<FormValues>
      initialValues={{
        filteredDomainId: String(filteredDomainId),
      }}
      onSubmit={() => {}}
    >
      <DomainDropdown
        colony={colony}
        name="filteredDomainId"
        currentDomainId={filteredDomainId}
        onDomainChange={onDomainChange}
        onDomainEdit={canInteract ? handleEditDomain : undefined}
        footerComponent={
          canInteract ? <CreateDomainButton colony={colony} /> : undefined
        }
        renderActiveOptionFn={renderActiveOption}
        showAllDomains
        showDescription
        dataTest="colonyDomainSelector"
        itemDataTest="colonyDomainSelectorItem"
      />
    </Form>
  );
};

ColonyDomainSelector.displayName = displayName;

export default ColonyDomainSelector;
