import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import Icon from '~core/Icon';
import styles from './PermissionRequiredInfo.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.title',
    defaultMessage: 'You need the following permission(s)',
  },
});

interface Props {
  /** Array with roles required */
  requiredRoles: ColonyRole[];
}

const displayName = 'PermissionRequiredInfo';

const PermissionRequiredInfo = ({ requiredRoles }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <Heading
        appearance={{ size: 'normal', weight: 'bold' }}
        text={MSG.title}
        className={styles.title}
      />
      <div className={styles.requiredPermissionSection}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Permission</p>
          <Icon
            name="question-mark"
            title="Info"
            className={styles.labelIcon}
          />
          <div className={styles.permissionList}>
            {requiredRoles.map((role) => (
              <div className={styles.listItem}>
                <PermissionsLabel
                  key={`permission.${role}`}
                  permission={role}
                  name={formatMessage({ id: `role.${role}` })}
                />
              </div>
            ))}
          </div>
        </div>
        <Icon name="circle-close" title="Error" className={styles.errorIcon} />
      </div>
    </div>
  );
};

PermissionRequiredInfo.displayName = displayName;

export default PermissionRequiredInfo;
