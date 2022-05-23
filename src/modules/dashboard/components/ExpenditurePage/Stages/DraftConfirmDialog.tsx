import React from 'react';
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

interface Props {
  cancel: () => void;
  close: (val: any) => void;
  onClick?: () => void;

  // /** Appearance object */
  // appearance?: Appearance;
  // heading?: string | MessageDescriptor;
  // children?: ReactNode;
  // cancelButtonText?: string | MessageDescriptor;
  // confirmButtonText?: string | MessageDescriptor;
}
const activeToken = {
  address: '0x0000000000000000000000000000000000000000',
  balances: [{ amount: '0', domainId: 0 }],
  decimals: 18,
  iconHash: '',
  id: '0x0000000000000000000000000000000000000000',
  name: 'Ether',
  symbol: 'ETH',
};

const DraftConfirmDialog = ({ cancel, onClick }: Props) => {
  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading', border: 'bottom' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text="Stake to Create Expenditure"
          className={styles.title}
        >
          Stake to Create Expenditure
          <div className={styles.forceContainer}>
            Force
            <Form initialValues={{ force: false }} onSubmit={() => {}}>
              <Toggle name="force" />
            </Form>
            <Tooltip content="Lorem ipsum dolor sit amet.">
              <Icon name="question-mark" />
            </Tooltip>
          </div>
        </Heading>
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom' }}>
        <div className={styles.stakeContainer}>
          Stake{' '}
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
          Almost there! You have to provide a stake first. Imagine it is like
          renting a permission. If motion succeeds you will get your stake back.
          Until expenditure is staked it wont show up publicly on list. It works
          like an anti-spam filter.
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={() => cancel()}
          text="Cancel"
        />
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          autoFocus
          onClick={onClick}
          text="Stake"
          // style={{ width: styles.wideButton }}
          data-test="confirmButton"
        />
      </DialogSection>
    </Dialog>
  );
};

export default DraftConfirmDialog;
