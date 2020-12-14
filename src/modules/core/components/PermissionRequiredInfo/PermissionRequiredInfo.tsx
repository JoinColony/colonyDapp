import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import Icon from '~core/Icon';
import styles from './PermissionRequiredInfo.css';
import { Tooltip } from '~core/Popover';

const MSG = defineMessages({
  title: {
    id: 'PermissionRequiredInfo.title',
    defaultMessage: 'You need the following permission(s)',
  },
  sectionLabel: {
    id: 'PermissionRequiredInfo.sectionLabel',
    defaultMessage: 'Permission',
  },
  tooltipTextFirstParagraph: {
    id: 'PermissionRequiredInfo.tooltipTextFirstParagraph',
    defaultMessage: `Colony has six permission classes which can be assigned
      to any Ethereum address: Funding, Administration, Arbitration,
      Architecture, Root, and Recovery.`,
  },
  tooltipTextSecondParagraph: {
    id: 'PermissionRequiredInfo.tooltipTextSecondParagraph',
    defaultMessage: `Permissions are assigned at the domain level.
      If an account is granted a permission in a domain,
      it also has that same permission in all of that
      domain’s subdomains.`,
  },
});

interface Props {
  /** Array with roles required */
  requiredRoles: ColonyRole[];
}

const displayName = 'PermissionRequiredInfo';

const PermissionRequiredInfo = ({ requiredRoles }: Props) => {
  const { formatMessage } = useIntl();
  const tooltipText = (
    <div className={styles.tooltipContent}>
      <p className={styles.tooltipText}>
        <FormattedMessage {...MSG.tooltipTextFirstParagraph} />
      </p>
      <p className={styles.tooltipText}>
        <FormattedMessage {...MSG.tooltipTextSecondParagraph} />
      </p>
    </div>
  );

  return (
    <div>
      <Heading
        appearance={{ size: 'normal', weight: 'bold' }}
        text={MSG.title}
        className={styles.title}
      />
      <div className={styles.requiredPermissionSection}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>
            <FormattedMessage {...MSG.sectionLabel} />
          </p>
          <Tooltip darkTheme content={tooltipText} placement="right">
            {({ close, open, ref }) => (
              <div
                ref={ref}
                onMouseEnter={open}
                onMouseLeave={close}
                className={styles.labelIcon}
              >
                <Icon name="question-mark" title={MSG.title} />
              </div>
            )}
          </Tooltip>

          <div className={styles.permissionList}>
            {requiredRoles.map((role) => (
              <div className={styles.listItem} key={`permission.${role}`}>
                <PermissionsLabel
                  permission={role}
                  name={formatMessage({ id: `role.${role}` })}
                />
              </div>
            ))}
          </div>
        </div>
        <Icon
          name="circle-close-error"
          title="Error"
          appearance={{ size: 'normal' }}
        />
      </div>
    </div>
  );
};

PermissionRequiredInfo.displayName = displayName;

export default PermissionRequiredInfo;
