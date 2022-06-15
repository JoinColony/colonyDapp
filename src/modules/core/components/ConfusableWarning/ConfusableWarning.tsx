import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import MemberReputation from '~core/MemberReputation';

import styles from './ConfusableWarning.css';

interface Props {
  walletAddress?: string;
  colonyAddress?: string;
}

const MSG = {
  warningText: {
    id: 'ConfusableWarning.warningText',
    defaultMessage: `<span>Warning.</span> This username has confusable characters; it may be trying to impersonate another user.`,
  },
  warningCurrentUserText: {
    id: 'ConfusableWarning.warningCurrentUserText',
    defaultMessage: `<span>Warning.</span> Your username has confusable characters. This will show a warning when selected by users.`,
  },
  reputationLabel: {
    id: 'ConfusableWarning.reputationLabel',
    defaultMessage: "Recipient's reputation",
  },
};

const ConfusableWarning = ({ walletAddress, colonyAddress }: Props) => {
  return (
    <>
      <div
        className={classnames(styles.warningContainer, {
          [styles.noReputation]: !walletAddress && !colonyAddress,
        })}
      >
        <p className={styles.warningText}>
          <FormattedMessage
            {...(!walletAddress && !colonyAddress
              ? MSG.warningCurrentUserText
              : MSG.warningText)}
            values={{
              span: (chunks) => (
                <span className={styles.warningLabel}>{chunks}</span>
              ),
            }}
          />
        </p>
      </div>
      {walletAddress && colonyAddress && (
        <div className={styles.reputationContainer}>
          <div className={styles.reputationLabel}>
            <FormattedMessage {...MSG.reputationLabel} />
          </div>
          <MemberReputation
            walletAddress={walletAddress}
            colonyAddress={colonyAddress}
          />
        </div>
      )}
    </>
  );
};

export default ConfusableWarning;
