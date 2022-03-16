import React from 'react';
import { defineMessages } from 'react-intl';
import camelCase from 'lodash/camelCase';

import Tag from '~core/Tag';

import { ColonyExtension } from '~data/index';

import styles from './ExtensionStatus.css';

const MSG = defineMessages({
  installed: {
    id: 'dashboard.Extensions.ExtensionStatus.installed',
    defaultMessage: 'Installed',
  },
  notInstalled: {
    id: 'dashboard.Extensions.ExtensionStatus.notInstalled',
    defaultMessage: 'Not installed',
  },
  missingPermissions: {
    id: 'dashboard.Extensions.ExtensionStatus.missingPermissions',
    defaultMessage: 'Missing permissions',
  },
  deprecated: {
    id: 'dashboard.Extensions.ExtensionStatus.deprecated',
    defaultMessage: 'Deprecated',
  },
  enabled: {
    id: 'dashboard.Extensions.ExtensionStatus.enabled',
    defaultMessage: 'Enabled',
  },
  notEnabled: {
    id: 'dashboard.Extensions.ExtensionStatus.notEnabled',
    defaultMessage: 'Disabled',
  },
});

interface Props {
  deprecatedOnly?: boolean;
  installedExtension?: ColonyExtension | null;
}

const ExtensionStatus = ({
  deprecatedOnly = false,
  installedExtension,
}: Props) => {
  let status;
  let theme;

  if (!installedExtension) {
    status = MSG.notInstalled;
  } else if (!installedExtension.details.initialized) {
    status = MSG.notEnabled;
    theme = 'golden';
  } else if (installedExtension.details.missingPermissions.length) {
    status = MSG.missingPermissions;
    theme = 'danger';
  } else if (installedExtension.details.initialized) {
    status = MSG.enabled;
    theme = 'primary';
  } else {
    status = MSG.installed;
  }
  return (
    <div className={styles.tagContainer}>
      {!deprecatedOnly ? (
        <Tag
          appearance={{ theme }}
          text={status}
          data-test={`${camelCase(status.defaultMessage)}StatusTag`}
        />
      ) : null}
      {installedExtension && installedExtension.details.deprecated ? (
        <Tag
          appearance={{ theme: 'danger' }}
          text={MSG.deprecated}
          data-test="deprecatedStatusTag"
        />
      ) : null}
    </div>
  );
};

ExtensionStatus.displayName = 'dashboard.Extensions.ExtensionStatus';

export default ExtensionStatus;
