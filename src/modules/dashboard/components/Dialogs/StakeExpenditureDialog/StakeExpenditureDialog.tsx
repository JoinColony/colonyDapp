import React, { useCallback, useState } from 'react';

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

import styles from './StakeExpenditureDialog.css';

// Mock Data for Staking token, needs to be replaced with native token.
const activeToken = {
  address: '0x0000000000000000000000000000000000000000',
  balances: [{ amount: '0', domainId: 0 }],
  decimals: 18,
  iconHash: '',
  id: '0x0000000000000000000000000000000000000000',
  name: 'Ether',
  symbol: 'ETH',
};

const MSG = defineMessages({
  header: {
    id: 'dashboard.StakeExpenditureDialog.header',
    defaultMessage: 'Stake to Create Expenditure',
  },
  force: {
    id: 'dashboard.StakeExpenditureDialog.force',
    defaultMessage: 'Force',
  },
  stake: {
    id: 'dashboard.StakeExpenditureDialog.stake',
    defaultMessage: 'Stake',
  },
  descriptionText: {
    id: 'dashboard.StakeExpenditureDialog.descriptionText',
    defaultMessage: `Almost there! You have to provide a stake first. 
    Imagine it is like renting a permission. 
    If motion succeeds you will get your stake back.`,
  },
  descriptionText2: {
    id: 'dashboard.StakeExpenditureDialog.descriptionText2',
    defaultMessage: `
    Until expenditure is staked it won't show up publicly on list. 
    It works like an anti-spam filter.`,
  },
  cancelText: {
    id: 'dashboard.StakeExpenditureDialog.cancelText',
    defaultMessage: 'Cancel',
  },
  confirmText: {
    id: 'dashboard.StakeExpenditureDialog.confirmText',
    defaultMessage: 'Stake',
  },
});

const displayName = 'dashboard.StakeExpenditureDialog';

type Props = {
  onClick: () => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colony: Colony;
};

const StakeExpenditureDialog = ({
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
                {canCancelExpenditure && isVotingExtensionEnabled && (
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
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.cancelText}
                onClick={close}
              />
              <Button
                appearance={{
                  theme: 'primary',
                  size: 'large',
                }}
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

StakeExpenditureDialog.displayName = displayName;

export default StakeExpenditureDialog;
