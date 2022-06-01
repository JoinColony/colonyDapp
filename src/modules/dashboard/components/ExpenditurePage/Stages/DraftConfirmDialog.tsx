import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import styles from './DraftConfirmDialog.css';

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
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.header',
    defaultMessage: 'Stake to Create Expenditure',
  },
  force: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.force',
    defaultMessage: 'Force',
  },
  stake: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.stake',
    defaultMessage: 'Stake',
  },
  descriptionText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.descriptionText',
    defaultMessage: `Almost there! You have to provide a stake first. 
    Imagine it is like renting a permission. 
    If motion succeeds you will get your stake back.`,
  },
  descriptionText2: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.descriptionText2',
    defaultMessage: `
    Until expenditure is staked it won’t show up publicly on list. 
    It works like an anti-spam filter.`,
  },
  cancelText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.cancelText',
    defaultMessage: 'Cancel',
  },
  confirmText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.confirmText',
    defaultMessage: 'Stake',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  onClick?: () => void;
}

const DraftConfirmDialog = ({ cancel, onClick, close }: Props) => {
  const handleSubmit = useCallback(() => {
    onClick?.();
    close();
  }, [onClick, close]);

  return (
    <Dialog cancel={cancel}>
      <div className={styles.dialogContainer}>
        <DialogSection appearance={{ theme: 'heading', border: 'bottom' }}>
          <Heading
            appearance={{ size: 'medium', margin: 'none' }}
            text="Stake to Create Expenditure"
            className={styles.title}
          >
            <FormattedMessage {...MSG.header} />
            <div className={styles.forceContainer}>
              <FormattedMessage {...MSG.force} />
              {/* Connect to the form in next PR */}
              <Form initialValues={{ force: false }} onSubmit={() => {}}>
                <div className={styles.toggleContainer}>
                  <Toggle name="force" appearance={{ theme: 'danger' }} />
                </div>
              </Form>
              <Tooltip
                content={
                  <div className={styles.tooltip}>
                    <FormattedMessage id="tooltip.forceAction" />
                  </div>
                }
                trigger="hover"
              >
                <Icon name="question-mark" className={styles.questionIcon} />
              </Tooltip>
            </div>
          </Heading>
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom' }}>
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
        <DialogSection>
          <div className={styles.messageContainer}>
            <p className={styles.messageParagraph}>
              <FormattedMessage {...MSG.descriptionText} />
            </p>
            <p className={styles.messageParagraph}>
              <FormattedMessage {...MSG.descriptionText2} />
            </p>
          </div>
        </DialogSection>
      </div>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'small' }}
          onClick={() => cancel()}
          text={MSG.cancelText}
          style={{
            color: styles.textColor,
            fontWeight: 400,
            fontSize: styles.sizeNormal,
          }}
        />
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          autoFocus
          onClick={handleSubmit}
          text={MSG.confirmText}
          style={{
            fontWeight: 700,
            width: styles.submitButtonWidth,
            marginLeft: styles.buttonMarginLeft,
          }}
          data-test="confirmButton"
        />
      </DialogSection>
    </Dialog>
  );
};

export default DraftConfirmDialog;
