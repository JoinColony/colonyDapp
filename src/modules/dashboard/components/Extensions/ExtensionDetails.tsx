import React, { useCallback, useEffect } from 'react';
import { FormattedDate, defineMessages, FormattedMessage } from 'react-intl';
import {
  useParams,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from 'react-router';
import {
  ColonyRole,
  ColonyVersion,
  Extension,
  extensionsIncompatibilityMap,
} from '@colony/colony-js';
import isEmpty from 'lodash/isEmpty';
import { useMediaQuery } from 'react-responsive';

import BreadCrumb, { Crumb } from '~core/BreadCrumb';
import Heading from '~core/Heading';
import Warning from '~core/Warning';
import Icon from '~core/Icon';
import NetworkContractUpgradeDialog from '~dialogs/NetworkContractUpgradeDialog';
import { useDialog, ConfirmDialog } from '~core/Dialog';
import {
  Colony,
  useLoggedInUser,
  useColonyExtensionQuery,
  useNetworkExtensionVersionQuery,
} from '~data/index';
import { SpinnerLoader } from '~core/Preloaders';
import { DialogActionButton } from '~core/Button';
import { Table, TableBody, TableCell, TableRow } from '~core/Table';
import { useTransformer } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import extensionData from '~data/staticData/extensionData';
import MaskedAddress from '~core/MaskedAddress';
import { ActionTypes } from '~redux/index';

import PermissionsLabel from '~core/PermissionsLabel';
import DetailsWidgetUser from '~core/DetailsWidgetUser';
import {
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
} from '~routes/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';

import { query700 as query } from '~styles/queries.css';
import styles from './ExtensionDetails.css';
import ExtensionActionButton from './ExtensionActionButton';
import ExtensionSetup from './ExtensionSetup';
import ExtensionStatus from './ExtensionStatus';
import ExtensionUpgrade from './ExtensionUpgrade';
import ExtensionUninstallConfirmDialog from './ExtensionUninstallConfirmDialog';
import { ExtensionsMSG } from './extensionsMSG';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.ExtensionDetails.title',
    defaultMessage: 'Extensions',
  },
  buttonAdd: {
    id: 'dashboard.Extensions.ExtensionDetails.buttonAdd',
    defaultMessage: 'Add',
  },
  status: {
    id: 'dashboard.Extensions.ExtensionDetails.status',
    defaultMessage: 'Status',
  },
  installedBy: {
    id: 'dashboard.Extensions.ExtensionDetails.installedBy',
    defaultMessage: 'Installed by',
  },
  dateCreated: {
    id: 'dashboard.Extensions.ExtensionDetails.dateCreated',
    defaultMessage: 'Date created',
  },
  dateInstalled: {
    id: 'dashboard.Extensions.ExtensionDetails.dateInstalled',
    defaultMessage: 'Date installed',
  },
  latestVersion: {
    id: 'dashboard.Extensions.ExtensionDetails.latestVersion',
    defaultMessage: 'Latest version',
  },
  versionInstalled: {
    id: 'dashboard.Extensions.ExtensionDetails.versionInstalled',
    defaultMessage: 'Version installed',
  },
  contractAddress: {
    id: 'dashboard.Extensions.ExtensionDetails.contractAddress',
    defaultMessage: 'Contract address',
  },
  developer: {
    id: 'dashboard.Extensions.ExtensionDetails.developer',
    defaultMessage: 'Developer',
  },
  permissionsNeeded: {
    id: 'dashboard.Extensions.ExtensionDetails.permissionsNeeded',
    defaultMessage: 'Permissions the extension needs in the colony:',
  },
  buttonUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.buttonUninstall',
    defaultMessage: 'Uninstall',
  },
  buttonDeprecate: {
    id: 'dashboard.Extensions.ExtensionDetails.buttonDeprecate',
    defaultMessage: 'Deprecate',
  },
  buttonReEnable: {
    id: 'dashboard.Extensions.ExtensionDetails.buttonReEnable',
    defaultMessage: 'Re-enable',
  },
  headingDeprecate: {
    id: 'dashboard.Extensions.ExtensionDetails.headingDeprecate',
    defaultMessage: 'Deprecate extension',
  },
  textDeprecate: {
    id: 'dashboard.Extensions.ExtensionDetails.textDeprecate',
    defaultMessage: `This extension must first be deprecated if you wish to uninstall it. After deprecation, any actions using this extension already ongoing may be completed, but it will no longer be possible to create new actions requiring this extension. Are you sure you wish to proceed?`,
  },
  headingReEnable: {
    id: 'dashboard.Extensions.ExtensionDetails.headingReEnable',
    defaultMessage: 'Re-enable extension',
  },
  textReEnable: {
    id: 'dashboard.Extensions.ExtensionDetails.textDeprecate',
    defaultMessage: `The extension will be re-enabled with the same parameters. Are you sure you wish to proceed?`,
  },
  headingUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.headingUninstall',
    defaultMessage: 'Uninstall extension',
  },
  textUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.textUninstall',
    defaultMessage: `This extension is currently deprecated, and may be uninstalled. Doing so will remove it from the colony and any processes requiring it will no longer work. Are you sure you wish to proceed?`,
  },
  setup: {
    id: 'dashboard.Extensions.ExtensionDetails.setup',
    defaultMessage: 'Setup',
  },
  warning: {
    id: 'dashboard.Extensions.ExtensionDetails.warning',
    defaultMessage: `This extension is incompatible with your current colony version. You must upgrade your colony before installing it.`,
  },
});

interface Props {
  colony: Colony;
}

const ExtensionDetails = ({
  colony: { colonyAddress, version: colonyVersion },
  colony,
}: Props) => {
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();
  const match = useRouteMatch();
  const onSetupRoute = useRouteMatch(COLONY_EXTENSION_SETUP_ROUTE);
  const { walletAddress, username, ethereal, networkId } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const openUpgradeVersionDialog = useDialog(NetworkContractUpgradeDialog);

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  const handleUpgradeColony = useCallback(
    () =>
      openUpgradeVersionDialog({
        colony,
        isVotingExtensionEnabled,
      }),
    [colony, openUpgradeVersionDialog, isVotingExtensionEnabled],
  );

  const { data, loading } = useColonyExtensionQuery({
    variables: { colonyAddress, extensionId },
  });

  const { data: networkExtensionData } = useNetworkExtensionVersionQuery({
    variables: { extensionId },
  });
  const [networkExtension] =
    networkExtensionData?.networkExtensionVersion || [];

  const latestNetworkExtensionVersion = networkExtension?.version || 0;

  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const isSupportedColonyVersion =
    parseInt(colonyVersion || '1', 10) >= ColonyVersion.LightweightSpaceship;

  const extension = extensionData[extensionId];
  /*
   * Either the current version (only if it's installed), or the latest version
   * available from the network (since that's the one that it going to get
   * installed)
   */
  extension.currentVersion =
    data?.colonyExtension?.details?.version || latestNetworkExtensionVersion;

  const canInstall =
    hasRegisteredProfile &&
    hasRoot(allUserRoles) &&
    !ethereal &&
    isNetworkAllowed;
  const installedExtension = data ? data.colonyExtension : null;

  const extensionInstallable = !onSetupRoute && canInstall;
  const extensionUninstallable = canInstall && extension?.uninstallable;

  const extesionCanBeInstalled =
    extensionInstallable && !installedExtension?.details?.initialized;
  const extesionCanBeEnabled =
    extensionInstallable &&
    !!installedExtension?.details?.missingPermissions?.length;
  const extesionCanBeDeprecated =
    extensionUninstallable &&
    installedExtension &&
    !installedExtension?.details?.deprecated;
  const extesionCanBeUninstalled =
    extensionUninstallable && installedExtension?.details?.deprecated;
  const extensionCanBeUpgraded =
    hasRegisteredProfile &&
    !(extesionCanBeInstalled || extesionCanBeEnabled) &&
    latestNetworkExtensionVersion > extension.currentVersion;

  const extensionEnabled =
    installedExtension &&
    installedExtension.details?.initialized &&
    !installedExtension.details?.deprecated;

  const extensionCompatible = extension?.currentVersion
    ? !extensionsIncompatibilityMap[extensionId][extension.currentVersion].find(
        (version: number) => version === parseInt(colonyVersion, 10),
      )
    : false;

  const isMobile = useMediaQuery({ query });

  /*
   * @NOTE: The following useEffect scrolls the user to the top
   * of the page on mobile so that they don't have to do it themselves
   * when moving from a scrolled position on the `Extensions` page
   * to `ExtensionDetails`.
   */

  useEffect(() => {
    if (isMobile) window.scrollTo(0, 0);
  }, [isMobile]);

  let tableData;

  if (installedExtension) {
    tableData = [
      {
        label: MSG.status,
        value: <ExtensionStatus installedExtension={installedExtension} />,
      },
      {
        label: MSG.installedBy,
        value: (
          <span className={styles.installedBy}>
            <DetailsWidgetUser
              colony={colony}
              walletAddress={installedExtension.details?.installedBy}
            />
          </span>
        ),
      },
      {
        label: MSG.dateInstalled,
        value: (
          <FormattedDate value={installedExtension.details?.installedAt} />
        ),
      },
      {
        label: MSG.versionInstalled,
        value: `v${extension.currentVersion}`,
      },
      {
        label: MSG.contractAddress,
        value: (
          <InvisibleCopyableAddress address={installedExtension.address}>
            <span className={styles.contractAddress}>
              <MaskedAddress address={installedExtension.address} />
            </span>
          </InvisibleCopyableAddress>
        ),
      },
      {
        label: MSG.developer,
        value: 'Colony',
      },
    ];
  } else {
    tableData = [
      {
        label: MSG.status,
        value: <ExtensionStatus installedExtension={installedExtension} />,
      },
      {
        label: MSG.dateCreated,
        value: <FormattedDate value={extension.createdAt} />,
      },
      {
        label: MSG.latestVersion,
        value: `v${extension.currentVersion}`,
        icon: !extensionCompatible && (
          <Icon name="triangle-warning" title={MSG.warning} />
        ),
      },
      {
        label: MSG.developer,
        value: 'Colony',
      },
    ];
  }

  const extensionUrl = `/colony/${colonyName}/extensions/${extensionId}`;
  const breadCrumbs: Crumb[] = [
    [MSG.title, `/colony/${colonyName}/extensions`],
    [extension.name, match.url === extensionUrl ? '' : extensionUrl],
  ];

  if (match.path === COLONY_EXTENSION_SETUP_ROUTE) {
    breadCrumbs.push(MSG.setup);
  }

  if (loading) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  const uninstallModalProps = {
    [Extension.VotingReputation]: {
      heading: ExtensionsMSG.headingVotingUninstall,
      children: <Warning text={ExtensionsMSG.textVotingUninstall} />,
    },
    DEFAULT: {
      heading: ExtensionsMSG.headingDefaultUninstall,
      children: <FormattedMessage {...ExtensionsMSG.textDefaultUninstall} />,
    },
  };

  const ExtnHeading = () => (
    <>
      <BreadCrumb elements={breadCrumbs} />
      <hr className={styles.headerLine} />
    </>
  );

  return (
    <div className={styles.main}>
      {isMobile && <ExtnHeading />}
      <div className={styles.content}>
        {!isMobile && <ExtnHeading />}
        <div>
          {!extensionCompatible && (
            <Warning
              text={MSG.warning}
              buttonText={{ id: 'button.upgrade' }}
              handleClick={handleUpgradeColony}
              disabled={!canInstall}
            />
          )}
          <Switch>
            <Route
              exact
              path={COLONY_EXTENSION_DETAILS_ROUTE}
              component={() => (
                <div className={styles.extensionText}>
                  <Heading
                    tagName="h3"
                    appearance={{
                      size: 'medium',
                      margin: 'small',
                      theme: 'dark',
                    }}
                    text={extension.header || extension.name}
                  />
                  {typeof extension.descriptionLong === 'object' ? (
                    <FormattedMessage
                      {...extension.descriptionLong}
                      values={{
                        h4: (chunks) => (
                          <Heading
                            tagName="h4"
                            appearance={{ size: 'medium', margin: 'small' }}
                            text={chunks}
                          />
                        ),
                        link0: extension.descriptionLinks?.[0],
                      }}
                    />
                  ) : (
                    extension.descriptionLong
                  )}
                  {extension.info && (
                    <div className={styles.extensionSubtext}>
                      {typeof extension.info === 'object' ? (
                        <FormattedMessage
                          {...extension.info}
                          values={{
                            link0: extension.descriptionLinks?.[0],
                          }}
                        />
                      ) : (
                        extension.info
                      )}
                    </div>
                  )}
                  {extensionEnabled &&
                    extension.enabledExtensionBody &&
                    extension.enabledExtensionBody({ colony })}
                </div>
              )}
            />
            <Route
              exact
              path={COLONY_EXTENSION_SETUP_ROUTE}
              component={() => {
                if (
                  !canInstall ||
                  (installedExtension?.details?.initialized &&
                    !installedExtension?.details?.missingPermissions.length)
                ) {
                  return <Redirect to={extensionUrl} />;
                }
                return installedExtension ? (
                  <ExtensionSetup
                    extension={extension}
                    installedExtension={installedExtension}
                    colony={colony}
                  />
                ) : (
                  <Redirect to={extensionUrl} />
                );
              }}
            />
          </Switch>
        </div>
      </div>
      <aside>
        <div className={styles.extensionDetails}>
          <hr className={styles.headerLine} />
          <div className={styles.buttonWrapper}>
            {(extesionCanBeInstalled || extesionCanBeEnabled) &&
              isNetworkAllowed && (
                <ExtensionActionButton
                  colonyAddress={colonyAddress}
                  colonyVersion={colonyVersion}
                  installedExtension={installedExtension}
                  extension={extension}
                  extensionCompatible={extensionCompatible}
                />
              )}
            {extensionCanBeUpgraded && isNetworkAllowed && (
              <ExtensionUpgrade
                colony={colony}
                extension={extension}
                canUpgrade={canInstall}
              />
            )}
          </div>
          <Table appearance={{ theme: 'lined' }}>
            <TableBody>
              {tableData.map(({ label, value, icon }) => (
                <TableRow key={label.id}>
                  <TableCell className={styles.cellLabel}>
                    <FormattedMessage {...label} />
                    {icon && <span className={styles.iconWrapper}>{icon}</span>}
                  </TableCell>
                  <TableCell className={styles.cellData}>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {extesionCanBeDeprecated ? (
            <div className={styles.actionButtons}>
              <DialogActionButton
                dialog={ConfirmDialog}
                dialogProps={{
                  heading: MSG.headingDeprecate,
                  children: <FormattedMessage {...MSG.textDeprecate} />,
                }}
                appearance={{ theme: 'blue' }}
                submit={ActionTypes.EXTENSION_DEPRECATE}
                error={ActionTypes.EXTENSION_DEPRECATE_ERROR}
                success={ActionTypes.EXTENSION_DEPRECATE_SUCCESS}
                text={MSG.buttonDeprecate}
                values={{ colonyAddress, extensionId, isToDeprecate: true }}
                disabled={!isSupportedColonyVersion || !isNetworkAllowed}
                data-test="deprecateExtensionButton"
              />
            </div>
          ) : null}
          {extesionCanBeUninstalled ? (
            <div className={styles.actionButtons}>
              <DialogActionButton
                dialog={ConfirmDialog}
                dialogProps={{
                  heading: MSG.headingReEnable,
                  children: <FormattedMessage {...MSG.textReEnable} />,
                }}
                appearance={{ theme: 'blue' }}
                submit={ActionTypes.EXTENSION_DEPRECATE}
                error={ActionTypes.EXTENSION_DEPRECATE_ERROR}
                success={ActionTypes.EXTENSION_DEPRECATE_SUCCESS}
                text={MSG.buttonReEnable}
                values={{ colonyAddress, extensionId, isToDeprecate: false }}
                disabled={!isSupportedColonyVersion || !isNetworkAllowed}
                data-test="reenableExtensionButton"
              />
              <DialogActionButton
                dialog={ExtensionUninstallConfirmDialog}
                dialogProps={
                  uninstallModalProps[extensionId] ||
                  uninstallModalProps.DEFAULT
                }
                appearance={{ theme: 'blue' }}
                submit={ActionTypes.EXTENSION_UNINSTALL}
                error={ActionTypes.EXTENSION_UNINSTALL_ERROR}
                success={ActionTypes.EXTENSION_UNINSTALL_SUCCESS}
                text={MSG.buttonUninstall}
                values={{ colonyAddress, extensionId }}
                disabled={!isSupportedColonyVersion || !isNetworkAllowed}
                data-test="uninstallExtensionButton"
              />
            </div>
          ) : null}
          {!isEmpty(extension.neededColonyPermissions) && (
            <div className={styles.permissions}>
              <Heading
                appearance={{ size: 'normal' }}
                tagName="h4"
                text={MSG.permissionsNeeded}
              />
              {extension.neededColonyPermissions.map(
                (permission: ColonyRole) => (
                  <PermissionsLabel key={permission} permission={permission} />
                ),
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ExtensionDetails;
