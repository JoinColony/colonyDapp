import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, FormSection, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { ActionTypes } from '~redux/actionTypes';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TokenIcon from '~dashboard/HookedTokenIcon';
import styles from './EditExpenditureDialog.css';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import Delay from '~dashboard/ExpenditurePage/Delay';
import Button from '~core/Button';

const MSG = defineMessages({
  header: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  force: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.force',
    defaultMessage: 'Force',
  },
  team: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.team',
    defaultMessage: 'Motion will be created in ',
  },
  descriptionText: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.descriptionText',
    defaultMessage: `Payment is currently at the locked stage.
    Any edits require at this point an action to be made.
    You can either enforce permission,
    or create a motion to get collective approval.`,
  },
  newRecipient: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.newRecipient',
    defaultMessage: 'New recipient',
  },
  newAmount: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.newAmount',
    defaultMessage: 'New amount',
  },
  newClaimDelay: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.newClaimDelay',
    defaultMessage: 'New claim delay',
  },
  descriptionLabel: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.descriptionLabel',
    defaultMessage: 'Explain why youre changing the payment (optional)',
  },
  cancelText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.cancelText',
    defaultMessage: 'Back',
  },
  confirmText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.confirmText',
    defaultMessage: 'Create motion',
  },
});

interface FormValues {
  forceAction: boolean;
}

type Props = {
  onClick: () => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
};

const EditExpenditureDialog = ({
  close,
  onClick,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const formValues = [
    {
      oldValues: {
        recipient: {
          id: '1',
          profile: {
            walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
            username: 'Chris',
            displayName: 'Christian Maniewski',
          },
        },
        values: [
          {
            amount: '50',
            tokenAddress: 1,
          },
        ],
        delay: { amount: '24', time: 'hours' },
      },
      changes: [
        {
          type: 'recipient',
          newValue: {
            id: '1',
            profile: {
              walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
              username: 'John',
              displayName: 'John Doe',
            },
          },
        },
        {
          type: 'value',
          newValue: [
            {
              amount: '5000',
              address: '0x0000000000000000000000000000000000000000',
              balances: [{ amount: '0', domainId: 0 }],
              decimals: 18,
              iconHash: '',
              id: '0x0000000000000000000000000000000000000000',
              name: 'Ether',
              symbol: 'ETH',
            },
          ],
        },
        {
          type: 'delay',
          newValue: { amount: 1, time: 'months' },
        },
      ],
    },
  ];

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const renderChange = useCallback(
    (changes) =>
      changes.map(({ type, newValue }) => {
        if (type === 'recipient') {
          return (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.row}>
                <span className={styles.label}>
                  <FormattedMessage {...MSG.newRecipient} />
                </span>
                <div className={styles.valueContainer}>
                  <div className={styles.userAvatarContainer}>
                    <UserAvatar
                      address={newValue.profile.walletAddress}
                      size="xs"
                      notSet={false}
                    />
                    <div className={styles.userName}>
                      <UserMention
                        username={
                          newValue.profile.username ||
                          newValue.profile.displayName ||
                          ''
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
          );
        }
        if (type === 'value') {
          return (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.row}>
                <span className={styles.label}>
                  <FormattedMessage {...MSG.newAmount} />
                </span>
                <div className={styles.valueContainer}>
                  {newValue.map(({ decimals, amount, symbol }) => (
                    <div className={styles.value}>
                      <TokenIcon
                        className={styles.tokenIcon}
                        token={symbol}
                        name={symbol.name || symbol.address}
                      />
                      <Numeral
                        unit={getTokenDecimalsWithFallback(decimals)}
                        value={amount}
                      />{' '}
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>
          );
        }
        if (type === 'delay') {
          return (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.row}>
                <span className={styles.label}>
                  <FormattedMessage {...MSG.newClaimDelay} />
                </span>
                <div className={styles.valueContainer}>
                  {newValue.amount}
                  {newValue.time}
                </div>
              </div>
            </FormSection>
          );
        }
        return null;
      }),
    [],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
    >
      {({ values, handleSubmit }: FormikProps<FormValues>) => {
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.row}>
                <FormattedMessage {...MSG.team} />
                <div className={styles.forceContainer}>
                  <FormattedMessage {...MSG.force} />
                  <div className={styles.toggleContainer}>
                    <Toggle name="force" appearance={{ theme: 'danger' }} />
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
                    <Icon
                      name="question-mark"
                      className={styles.questionIcon}
                    />
                  </Tooltip>
                </div>
              </div>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                className={styles.title}
              >
                <FormattedMessage {...MSG.header} />
              </Heading>
              <div className={styles.descriptionWrapper}>
                <FormattedMessage {...MSG.descriptionText} />
              </div>
            </DialogSection>
            <div className={styles.contentWrapper}>
              {formValues.map(({ oldValues, changes }, index) => (
                <>
                  <FormSection appearance={{ border: 'bottom' }}>
                    <div className={styles.recipientContainer}>
                      {index + 1}:{' '}
                      <UserMention
                        username={
                          oldValues.recipient.profile.username ||
                          oldValues.recipient.profile.displayName ||
                          ''
                        }
                      />
                      {', '}
                      <Delay
                        amount={oldValues?.delay?.amount}
                        time={oldValues?.delay?.time}
                      />
                    </div>
                  </FormSection>
                  {renderChange(changes)}
                </>
              ))}
            </div>
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
                onClick={(e) => {
                  handleSubmit(e as any);
                  onClick();
                  close();
                }}
              />
            </DialogSection>
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

export default EditExpenditureDialog;
