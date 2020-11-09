import React from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import {
  useColonyExtensionQuery,
  useColonyRolesQuery,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { Table, TableBody, TableCell, TableRow } from '~core/Table';
import CopyableAddress from '~core/CopyableAddress';
import Tag from '~core/Tag';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useTransformer } from '~utils/hooks';
import extensionData from '~data/staticData/extensionData';
import MaskedAddress from '~core/MaskedAddress';

import { getUserRolesForDomain } from '../../../transformers';

import styles from './ExtensionDetails.css';
import ExtensionActionButton from './ExtensionActionButton';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.ExtensionDetails.title',
    defaultMessage: 'Extensions',
  },
  buttonAdd: {
    id: 'dashboard.Extensions.ExtensionDetails.buttonAdd',
    defaultMessage: 'Add',
  },
  tagInstalled: {
    id: 'dashboard.Extensions.ExtensionDetails.tagInstalled',
    defaultMessage: 'Installed',
  },
  tagNotInstalled: {
    id: 'dashboard.Extensions.ExtensionDetails.tagNotInstalled',
    defaultMessage: 'Not installed',
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
});

const UserAvatar = HookedUserAvatar();

interface Props {
  colonyAddress: Address;
}

const ExtensionDetails = ({ colonyAddress }: Props) => {
  const { extensionId } = useParams();
  const { walletAddress } = useLoggedInUser();
  const { data, loading } = useColonyExtensionQuery({
    variables: { colonyAddress, extensionId },
  });

  const { data: colonyRolesData } = useColonyRolesQuery({
    variables: { address: colonyAddress },
  });

  const rootUserRoles = useTransformer(getUserRolesForDomain, [
    colonyRolesData && colonyRolesData.colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  if (loading) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  const canInstall = rootUserRoles.includes(ColonyRole.Root);

  const installedExtension = data ? data.colonyExtension : null;
  const extension = extensionData[extensionId];

  let tableData;

  if (installedExtension) {
    tableData = [
      {
        label: MSG.status,
        value: (
          <Tag appearance={{ theme: 'primary' }} text={MSG.tagInstalled} />
        ),
      },
      {
        label: MSG.installedBy,
        value: (
          <span className={styles.installedBy}>
            <UserAvatar
              address={installedExtension.details.installedBy}
              size="xs"
              notSet={false}
            />
            <span className={styles.installedByAddress}>
              <MaskedAddress address={installedExtension.details.installedBy} />
            </span>
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
        value: <CopyableAddress>{installedExtension.address}</CopyableAddress>,
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
        value: <Tag text={MSG.tagNotInstalled} />,
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
  return (
    <div className={styles.main}>
      <BreadCrumb elements={[MSG.title, extension.name]} />
      <hr />
      <div className={styles.content}>
        <div>
          <Heading
            tagName="h3"
            appearance={{ size: 'medium', margin: 'small' }}
            text={extension.name}
          />
          <FormattedMessage {...extension.description} />
        </div>
        <aside>
          <div className={styles.buttonWrapper}>
            <ExtensionActionButton
              canInstall={canInstall}
              installedExtension={installedExtension}
              extension={extension}
            />
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
          <div className={styles.permissions}>
            <Heading
              appearance={{ size: 'normal' }}
              tagName="h4"
              text={MSG.permissionsNeeded}
            />
            {extension.neededColonyPermissions.map((permission: ColonyRole) => (
              <Tag
                key={permission}
                appearance={{ theme: 'golden' }}
                text={{ id: `permission.${permission}` }}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExtensionDetails;
