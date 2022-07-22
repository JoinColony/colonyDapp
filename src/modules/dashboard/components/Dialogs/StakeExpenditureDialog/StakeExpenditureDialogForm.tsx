import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

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
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.header',
    defaultMessage: 'Stake to Create Expenditure',
  },
  force: {
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.force',
    defaultMessage: 'Force',
  },
  stake: {
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.stake',
    defaultMessage: 'Stake',
  },
  descriptionText: {
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.descriptionText',
    defaultMessage: `Almost there! You have to provide a stake first. 
    Imagine it is like renting a permission. 
    If motion succeeds you will get your stake back.`,
  },
  descriptionText2: {
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.descriptionText2',
    defaultMessage: `
    Until expenditure is staked it won’t show up publicly on list. 
    It works like an anti-spam filter.`,
  },
  cancelText: {
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.cancelText',
    defaultMessage: 'Cancel',
  },
  confirmText: {
    id: 'dashboard.ExpenditurePage.StakeExpenditureDialog.confirmText',
    defaultMessage: 'Stake',
  },
});

const displayName =
  'dashboard.StakeExpenditureDialog.StakeExpenditureDialogForm';

interface Props {
  onClick: () => void;
  close: () => void;
  isForce: boolean;
  setIsForce: React.Dispatch<React.SetStateAction<boolean>>;
}

const StakeExpenditureDialogForm = ({
  onClick,
  close,
  isForce,
  setIsForce,
}: Props) => {
  const { values, handleSubmit } = useFormikContext<{
    forceAction: boolean;
  }>();

  useEffect(() => {
    if (values.forceAction !== isForce) {
      setIsForce(values.forceAction);
    }
  }, [isForce, setIsForce, values]);

  return (
    <Dialog cancel={close}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.header} />
          <div className={styles.forceContainer}>
            <FormattedMessage {...MSG.force} />
            <div className={styles.toggleContainer}>
              <Toggle name="forceAction" appearance={{ theme: 'danger' }} />
            </div>

            <Tooltip
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage id="tooltip.forceAction" />
                </div>
              }
              trigger="hover"
              placement="top-end"
            >
              <Icon name="question-mark" className={styles.questionIcon} />
            </Tooltip>
          </div>
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
                activeToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount
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
};

StakeExpenditureDialogForm.displayName = displayName;

export default StakeExpenditureDialogForm;
