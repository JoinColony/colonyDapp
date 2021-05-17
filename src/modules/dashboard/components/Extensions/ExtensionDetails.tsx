import React, { useState } from 'react';
import { defineMessages, FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import {
  useParams,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from 'react-router';
import { ColonyRole, ColonyVersion, Extension } from '@colony/colony-js';

import BreadCrumb, { Crumb } from '~core/BreadCrumb';
import Heading from '~core/Heading';
import InputLabel from '~core/Fields/InputLabel';
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
import extensionData from '~data/staticData/extensionData';
import MaskedAddress from '~core/MaskedAddress';
import { ActionTypes } from '~redux/index';
import { ConfirmDialog } from '~core/Dialog';
import PermissionsLabel from '~core/PermissionsLabel';
import ExternalLink from '~core/ExternalLink';
import DetailsWidgetUser from '~core/DetailsWidgetUser';
import {
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
} from '~routes/index';
import { DEFAULT_NETWORK_INFO } from '~constants';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

import styles from './ExtensionDetails.css';
import ExtensionActionButton from './ExtensionActionButton';
import ExtensionSetup from './ExtensionSetup';
import ExtensionStatus from './ExtensionStatus';
import ExtensionUpgrade from './ExtensionUpgrade';
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
  headingDeprecate: {
    id: 'dashboard.Extensions.ExtensionDetails.headingDeprecate',
    defaultMessage: 'Deprecate extension',
  },
  textDeprecate: {
    id: 'dashboard.Extensions.ExtensionDetails.textDeprecate',
    defaultMessage: `This extension must first be deprecated if you wish to uninstall it. After deprecation, any actions using this extension already ongoing may be completed, but it will no longer be possible to create new actions requiring this extension. Are you sure you wish to proceed?`,
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
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const { formatMessage } = useIntl();
  const [isWarningInputValid, setIsWarningInputValid] = useState<boolean>(false);

  const { data, loading } = useColonyExtensionQuery({
    variables: { colonyAddress, extensionId },
  });

  const { data: networkExtension } = useNetworkExtensionVersionQuery({
    variables: { extensionId },
  });
  const latestNetworkExtensionVersion =
    networkExtension?.networkExtensionVersion || 0;

  const { contractAddressLink } = DEFAULT_NETWORK_INFO;

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

  const canInstall = hasRegisteredProfile && hasRoot(allUserRoles);
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
    extensionUninstallable && installedExtension?.details.deprecated;
  const extensionCanBeUpgraded =
    hasRegisteredProfile &&
    !(extesionCanBeInstalled || extesionCanBeEnabled) &&
    latestNetworkExtensionVersion > extension.currentVersion;

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
              walletAddress={installedExtension.details.installedBy}
            />
          </span>
        ),
      },
      {
        label: MSG.dateInstalled,
        value: <FormattedDate value={installedExtension.details.installedAt} />,
      },
      {
        label: MSG.versionInstalled,
        value: `v${extension.currentVersion}`,
      },
      {
        label: MSG.contractAddress,
        value: (
          <ExternalLink
            href={`${contractAddressLink}/${installedExtension.address}`}
          >
            <MaskedAddress address={installedExtension.address} />
          </ExternalLink>
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

  const onWarningInputChange = (e) => {
    setIsWarningInputValid(e.target.value === "I UNDERSTAND");
  }

  const modalContent = (content) => (
    <div>
      {content}
      <div className={styles.inputContainer}>
        <InputLabel
          label={ExtensionsMSG.typeInBox}
          appearance={{ colorSchema: 'grey' }}
        />
        <input
          name="warning"
          className={styles.input}
          onChange={onWarningInputChange}
          placeholder={formatMessage(ExtensionsMSG.warningPlaceholder)}
        />
      </div>
    </div>
  )

  const uninstallModalProps = {
    [Extension.VotingReputation]: {
      heading: ExtensionsMSG.headingVotingUninstall,
      children: modalContent(<div className={styles.warning}><FormattedMessage {...ExtensionsMSG.textVotingUninstall} /></div>),
      disabled: !isWarningInputValid,
    },
    [Extension.OneTxPayment]: {
      heading: ExtensionsMSG.headingDefaultUninstall,
      children: modalContent(<FormattedMessage {...ExtensionsMSG.textDefaultUninstall} />),
      disabled: !isWarningInputValid,
    }
  }

  return (
    <div className={styles.main}>
      <div>
        <BreadCrumb elements={breadCrumbs} />
        <hr className={styles.headerLine} />
        <div>
          <Switch>
            <Route
              exact
              path={COLONY_EXTENSION_DETAILS_ROUTE}
              component={() => (
                <div className={styles.extensionText}>
                  <Heading
                    tagName="h3"
                    appearance={{ size: 'medium', margin: 'small' }}
                    text={extension.name}
                  />
                  <FormattedMessage {...extension.descriptionLong} />
                </div>
              )}
            />
            <Route
              exact
              path={COLONY_EXTENSION_SETUP_ROUTE}
              component={() => {
                if (
                  !canInstall ||
                  (installedExtension?.details.initialized &&
                    !installedExtension?.details.missingPermissions.length)
                ) {
                  return <Redirect to={extensionUrl} />;
                }
                return installedExtension ? (
                  <ExtensionSetup
                    extension={extension}
                    installedExtension={installedExtension}
                    colonyAddress={colonyAddress}
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
            {(extesionCanBeInstalled || extesionCanBeEnabled) && (
              <ExtensionActionButton
                colonyAddress={colonyAddress}
                colonyVersion={colonyVersion}
                installedExtension={installedExtension}
                extension={extension}
              />
            )}
            {extensionCanBeUpgraded && (
              <ExtensionUpgrade colony={colony} extension={extension} />
            )}
          </div>
          <Table appearance={{ theme: 'lined' }}>
            <TableBody>
              {tableData.map(({ label, value }) => (
                <TableRow key={label.id}>
                  <TableCell className={styles.cellLabel}>
                    <FormattedMessage {...label} />
                  </TableCell>
                  <TableCell className={styles.cellData}>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {extesionCanBeDeprecated ? (
            <div className={styles.buttonUninstall}>
              <DialogActionButton
                dialog={ConfirmDialog}
                dialogProps={{
                  heading: MSG.headingDeprecate,
                  children: <FormattedMessage {...MSG.textDeprecate} />,
                }}
                appearance={{ theme: 'blue' }}
                submit={ActionTypes.COLONY_EXTENSION_DEPRECATE}
                error={ActionTypes.COLONY_EXTENSION_DEPRECATE_ERROR}
                success={ActionTypes.COLONY_EXTENSION_DEPRECATE_SUCCESS}
                text={MSG.buttonDeprecate}
                values={{ colonyAddress, extensionId }}
                disabled={!isSupportedColonyVersion}
              />
            </div>
          ) : null}
          {extesionCanBeUninstalled ? (
            <div className={styles.buttonUninstall}>
              <DialogActionButton
                dialog={ConfirmDialog}
                dialogProps={uninstallModalProps[extensionId]}
                appearance={{ theme: 'blue' }}
                submit={ActionTypes.COLONY_EXTENSION_UNINSTALL}
                error={ActionTypes.COLONY_EXTENSION_UNINSTALL_ERROR}
                success={ActionTypes.COLONY_EXTENSION_UNINSTALL_SUCCESS}
                text={MSG.buttonUninstall}
                values={{ colonyAddress, extensionId }}
                disabled={!isSupportedColonyVersion}
              />
            </div>
          ) : null}
          <div className={styles.permissions}>
            <Heading
              appearance={{ size: 'normal' }}
              tagName="h4"
              text={MSG.permissionsNeeded}
            />
            {extension.neededColonyPermissions.map((permission: ColonyRole) => (
              <PermissionsLabel key={permission} permission={permission} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ExtensionDetails;
