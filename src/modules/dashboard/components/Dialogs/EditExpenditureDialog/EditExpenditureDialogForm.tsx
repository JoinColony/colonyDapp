import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import { nanoid } from 'nanoid';

import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { ActionForm, Annotations, FormSection, Toggle } from '~core/Fields';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import { FormValuesType, MSG, validationSchema } from './EditExpenditureDialog';
import styles from './EditExpenditureDialog.css';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Dialog, { DialogSection } from '~core/Dialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { Colony } from '~data/index';
import { Tooltip } from '~core/Popover';
import Icon from '~core/Icon';
import Heading from '~core/Heading';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';

const displayName = 'dashboard.EditExpenditureDialogForm';

interface Props {
  getFormAction: (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => any;
  close: () => void;
  isForce: boolean;
  setIsForce: React.Dispatch<React.SetStateAction<boolean>>;
  colony: Colony;
  handleMotionDomainChange: (motionDomainId: number) => void;
  domainID?: number;
  confirmedValues: Partial<ValuesType> | undefined;
  oldValues: ValuesType;
  discardRecipientChange: (id: string) => void;
  discardChange: (name: string) => void;
  onClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
}

const EditExpenditureDialogForm = ({
  getFormAction,
  close,
  isForce,
  setIsForce,
  colony,
  handleMotionDomainChange,
  domainID,
  confirmedValues,
  oldValues,
  discardRecipientChange,
  discardChange,
  onClick,
}: Props) => {
  const { formatMessage } = useIntl();

  const renderRecipientChange = useCallback(
    (changedRecipient: Recipient) => {
      if (!changedRecipient) {
        return null;
      }

      if (changedRecipient.removed) {
        return (
          <div className={styles.row}>
            <div />
            <FormattedMessage {...MSG.removed} />
          </div>
        );
      }

      return Object.entries(changedRecipient).map(([type, newValue]) => {
        switch (type) {
          case 'recipient': {
            return (
              <FormSection appearance={{ border: 'bottom' }} key={nanoid()}>
                <div className={classNames(styles.row, styles.smallerPadding)}>
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
              </FormSection>
            );
          }
          case 'value': {
            const recipientValues = getRecipientTokens(
              changedRecipient,
              colony,
            );
            const multipleValues =
              recipientValues && recipientValues?.length > 1;
            return (
              <FormSection appearance={{ border: 'bottom' }} key={nanoid()}>
                <div
                  className={classNames(styles.row, {
                    [styles.valueLabel]: multipleValues,
                    [styles.smallerPadding]: multipleValues,
                  })}
                >
                  <div className={styles.label}>
                    <FormattedMessage {...MSG.newAmount} />
                  </div>
                  <div className={styles.valueContainer}>
                    {recipientValues?.map(
                      ({ amount, token }) =>
                        amount &&
                        token && (
                          <div
                            className={classNames(styles.value, {
                              [styles.paddingBottom]: multipleValues,
                            })}
                          >
                            <TokenIcon
                              className={styles.tokenIcon}
                              token={token}
                              name={token.name || token.address}
                            />
                            <Numeral
                              unit={getTokenDecimalsWithFallback(0)}
                              value={amount}
                            />{' '}
                            {token.symbol}
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </FormSection>
            );
          }
          case 'delay': {
            return (
              <FormSection appearance={{ border: 'bottom' }} key={nanoid()}>
                <div className={styles.row}>
                  <span className={styles.label}>
                    <FormattedMessage {...MSG.newClaimDelay} />
                  </span>
                  <div className={styles.valueContainer}>
                    {!newValue.amount ? (
                      '-'
                    ) : (
                      <>
                        {newValue.amount}
                        {newValue.time}
                      </>
                    )}
                  </div>
                </div>
              </FormSection>
            );
          }
          default:
            return null;
        }
      });
    },
    [colony],
  );

  const renderChange = useCallback(
    (change: any, key: string) => {
      switch (key) {
        case 'title': {
          return change || '-';
        }
        case 'description': {
          return change || '-';
        }
        case 'filteredDomainId': {
          const domain = colony?.domains.find(
            ({ ethDomainId }) => Number(change) === ethDomainId,
          );
          const defaultColor =
            change === String(ROOT_DOMAIN_ID) ? Color.LightPink : Color.Yellow;

          const color = domain ? domain.color : defaultColor;
          return (
            <div className={styles.teamWrapper}>
              <ColorTag color={color} />
              {domain?.name}
            </div>
          );
        }
        default:
          return null;
      }
    },
    [colony],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema(formatMessage(MSG.errorAnnotation))}
    >
      {({
        values,
        handleSubmit,
        isSubmitting,
      }: FormikProps<FormValuesType>) => {
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <DialogSection>
              <div
                className={classNames(
                  styles.row,
                  styles.withoutPadding,
                  styles.forceRow,
                )}
              >
                <FormattedMessage {...MSG.team} />
                <MotionDomainSelect
                  colony={colony}
                  onDomainChange={handleMotionDomainChange}
                  initialSelectedDomain={domainID}
                />
                <div className={styles.forceContainer}>
                  <FormattedMessage {...MSG.force} />
                  <div className={styles.toggleContainer}>
                    <Toggle
                      name="forceAction"
                      appearance={{ theme: 'danger' }}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Tooltip
                    content={
                      <div className={styles.tooltip}>
                        <FormattedMessage id="tooltip.forceAction" />
                      </div>
                    }
                    trigger="hover"
                    popperOptions={{
                      placement: 'top-end',
                      strategy: 'fixed',
                    }}
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
                <FormattedMessage
                  {...(isForce ? MSG.headerForce : MSG.header)}
                />
              </Heading>
              <div className={styles.descriptionWrapper}>
                <FormattedMessage {...MSG.descriptionText} />
              </div>
            </DialogSection>
            <div className={styles.contentWrapper}>
              {confirmedValues &&
                Object.entries(confirmedValues).map(([key, value], index) => {
                  if (
                    Array.isArray(value) &&
                    Object.keys(value).length > 0 &&
                    key === 'recipients'
                  ) {
                    return value.map((changedItem, changeIndex) => {
                      const oldValue:
                        | Recipient
                        | undefined = oldValues.recipients.find(
                        (recipient) => recipient?.id === changedItem?.id,
                      );
                      const recipientValues =
                        oldValue && getRecipientTokens(oldValue, colony);

                      return (
                        <React.Fragment key={oldValue?.id || index}>
                          <FormSection appearance={{ border: 'bottom' }}>
                            <div className={styles.reicpientButtonContainer}>
                              <div className={styles.recipientContainer}>
                                {changeIndex + 1}:{' '}
                                {!oldValue ? (
                                  <FormattedMessage {...MSG.newRecipient} />
                                ) : (
                                  <>
                                    <UserMention
                                      username={
                                        oldValue.recipient?.profile.username ||
                                        oldValue.recipient?.profile
                                          .displayName ||
                                        ''
                                      }
                                    />
                                    {', '}
                                    {recipientValues?.map(
                                      ({ amount, token }, idx) =>
                                        token &&
                                        amount && (
                                          <div
                                            className={styles.valueAmount}
                                            key={idx}
                                          >
                                            <span className={styles.icon}>
                                              <TokenIcon
                                                className={styles.tokenIcon}
                                                token={token}
                                                name={
                                                  token.name || token.address
                                                }
                                              />
                                            </span>

                                            <Numeral
                                              // eslint-disable-next-line max-len
                                              unit={getTokenDecimalsWithFallback(
                                                0,
                                              )}
                                              value={amount}
                                            />
                                            <span className={styles.symbol}>
                                              {token.symbol}
                                            </span>
                                          </div>
                                        ),
                                    )}
                                    {oldValue?.delay?.amount && (
                                      <>
                                        {', '}
                                        {oldValue.delay?.amount}
                                        {oldValue.delay?.time}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                              <Button
                                appearance={{ theme: 'dangerLink' }}
                                onClick={() =>
                                  discardRecipientChange(changedItem?.id || '')
                                }
                              >
                                <FormattedMessage {...MSG.discard} />
                              </Button>
                            </div>
                          </FormSection>
                          {renderRecipientChange(changedItem)}
                        </React.Fragment>
                      );
                    });
                  }
                  return (
                    <>
                      <FormSection appearance={{ border: 'bottom' }}>
                        <div className={styles.changeContainer}>
                          <span>
                            <FormattedMessage {...MSG.change} />{' '}
                            {key === 'filteredDomainId' ? (
                              <FormattedMessage {...MSG.teamCaption} />
                            ) : (
                              key
                            )}
                          </span>
                          <Button
                            appearance={{ theme: 'dangerLink' }}
                            onClick={() => discardChange(key)}
                          >
                            <FormattedMessage {...MSG.discard} />
                          </Button>
                        </div>
                      </FormSection>
                      <FormSection appearance={{ border: 'bottom' }}>
                        <div
                          className={classNames(
                            styles.changeContainer,
                            styles.changeItem,
                          )}
                        >
                          <span>
                            <FormattedMessage {...MSG.new} />{' '}
                            {key === 'filteredDomainId' ? (
                              <FormattedMessage {...MSG.teamCaption} />
                            ) : (
                              key
                            )}
                          </span>
                          <span className={styles.changeWrapper}>
                            {renderChange(value, key)}
                          </span>
                        </div>
                      </FormSection>
                    </>
                  );
                })}
            </div>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <Annotations
                label={isForce ? MSG.forceTextareaLabel : MSG.textareaLabel}
                name="annotationMessage"
                maxLength={90}
              />
            </DialogSection>
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.cancelText}
                onClick={close}
              />
              <Button
                appearance={{
                  theme: isForce ? 'danger' : 'primary',
                  size: 'large',
                }}
                autoFocus
                text={isForce ? MSG.confirmTexForce : MSG.confirmText}
                onClick={(e) => {
                  handleSubmit(e as any);
                  onClick(confirmedValues, isForce);
                  close();
                }}
                disabled={
                  confirmedValues && Object.keys(confirmedValues).length === 0
                }
              />
            </DialogSection>
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

EditExpenditureDialogForm.displayName = displayName;

export default EditExpenditureDialogForm;
