import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import { ActionTypes } from '~redux/actionTypes';
import { useLoggedInUser } from '~data/helpers';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { hasRoot } from '~modules/users/checks';
import { Colony } from '~data/index';

import styles from './StartApplicationDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.StartApplicationDialog.header',
    defaultMessage: 'Stake to start application',
  },
  force: {
    id: 'dashboard.StartApplicationDialog.force',
    defaultMessage: 'Force',
  },
  stake: {
    id: 'dashboard.StartApplicationDialog.stake',
    defaultMessage: 'Stake',
  },
  descriptionText: {
    id: 'dashboard.StartApplicationDialog.descriptionText',
    defaultMessage: `In order to start the incorporation process you have to provide a stake first. This is to protect the DAO from anyone wrongfully creating a corporation on it's behalf.`,
  },
  descriptionText2: {
    id: 'dashboard.StartApplicationDialog.descriptionText2',
    defaultMessage: `If the Motion succeeds or you cancel the application, you will get your stake back.`,
  },
  cancelText: {
    id: 'dashboard.StartApplicationDialog.cancelText',
    defaultMessage: 'Cancel',
  },
  confirmText: {
    id: 'dashboard.StartApplicationDialog.confirmText',
    defaultMessage: 'Stake',
  },
});

// Mock Data, needs to be replaced with the real amount.
const activeToken = {
  address: '0x0000000000000000000000000000000000000000',
  balances: [{ amount: '0', domainId: 0 }],
  decimals: 18,
  iconHash: '',
  id: '0x0000000000000000000000000000000000000000',
  name: 'Ether',
  symbol: 'ETH',
};

const displayName = 'dashboard.StartApplicationDialog';

interface FormValues {
  forceAction: boolean;
}

type Props = {
  onClick: () => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colony: Colony;
};

const StartApplicationDialog = ({
  onClick,
  close,
  isVotingExtensionEnabled,
  colony,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelExpenditure = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelExpenditure,
    isVotingExtensionEnabled,
    isForce,
  );

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
    >
      {({ values, handleSubmit, isSubmitting }: FormikProps<FormValues>) => {
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                className={styles.title}
              >
                <FormattedMessage {...MSG.header} />
                {isVotingExtensionEnabled && (
                  <div className={styles.toggleContainer}>
                    <Toggle
                      label={{ id: 'label.force' }}
                      name="forceAction"
                      appearance={{ theme: 'danger' }}
                      disabled={!userHasPermission || isSubmitting}
                      tooltipText={{ id: 'tooltip.forceAction' }}
                      tooltipPopperOptions={{
                        placement: 'top-end',
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [8, 2],
                            },
                          },
                        ],
                        strategy: 'fixed',
                      }}
                    />
                  </div>
                )}
              </Heading>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.stakeContainer}>
                <FormattedMessage {...MSG.stake} />{' '}
                <div className={styles.label}>
                  <span className={styles.icon}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={activeToken}
                      name={activeToken.name || activeToken.address}
                    />
                  </span>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(activeToken.decimals)}
                    value={
                      activeToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID]
                        .amount
                    }
                  />
                  <span className={styles.symbol}>{activeToken.symbol}</span>
                </div>
              </div>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.messageContainer}>
                <p className={styles.messageParagraph}>
                  <FormattedMessage {...MSG.descriptionText} />
                </p>
                <p className={styles.messageParagraph}>
                  <FormattedMessage {...MSG.descriptionText2} />
                </p>
              </div>
            </DialogSection>
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                className={styles.cancelButton}
                text={MSG.cancelText}
                onClick={close}
              />
              <Button
                className={styles.button}
                autoFocus
                text={MSG.confirmText}
                style={{
                  width: styles.submitButtonWidth,
                }}
                data-test="confirmButton"
                onClick={() => {
                  // onClick and close are temporary, only handleSubmit should stay here
                  onClick();
                  close();
                  handleSubmit();
                }}
              />
            </DialogSection>
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

StartApplicationDialog.displayName = displayName;

export default StartApplicationDialog;
