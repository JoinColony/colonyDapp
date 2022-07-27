import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import { nanoid } from 'nanoid';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Annotations, FormSection, Toggle } from '~core/Fields';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Dialog, { DialogSection } from '~core/Dialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { Colony, useLoggedInUser } from '~data/index';
import Heading from '~core/Heading';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';

import { FormValuesType, MSG } from './EditExpenditureDialog';
import styles from './EditExpenditureDialog.css';

const displayName = 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm';

interface Props {
  close: () => void;
  colony: Colony;
  handleMotionDomainChange: (motionDomainId: number) => void;
  domainID?: number;
  confirmedValues: Partial<ValuesType> | undefined;
  oldValues: ValuesType;
  discardRecipientChange: (id: string) => void;
  discardChange: (name: string) => void;
  onSubmitClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
  isVotingExtensionEnabled: boolean;
}

const EditExpenditureDialogForm = ({
  close,
  colony,
  handleMotionDomainChange,
  domainID,
  confirmedValues,
  oldValues,
  discardRecipientChange,
  discardChange,
  onSubmitClick,
  isVotingExtensionEnabled,
  isSubmitting,
  handleSubmit,
  values,
}: Props & FormikProps<FormValuesType>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelExpenditure = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelExpenditure,
    isVotingExtensionEnabled,
    values.forceAction,
  );
  const noChanges =
    confirmedValues && Object.keys(confirmedValues).length === 0;

  const convertToValuesWithIds = useMemo(
    () => (object: Partial<ValuesType> | undefined) => {
      if (!object) {
        return [];
      }

      return Object.entries(object).map(([key, value]) => ({
        key,
        value,
        id: nanoid(),
      }));
    },
    [],
  );

  const confirmedValuesWithIds = convertToValuesWithIds(confirmedValues);

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
                      ({ amount, token }, index) =>
                        amount &&
                        token && (
                          <div
                            className={classNames(styles.value, {
                              [styles.paddingBottom]: multipleValues,
                            })}
                            key={index}
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
                  <div className={styles.value}>
                    {!newValue.amount ? (
                      '-'
                    ) : (
                      <>
                        {newValue.amount} {newValue.time}
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
    <Dialog cancel={close}>
      <DialogSection>
        <div
          className={classNames(
            styles.row,
            styles.withoutPadding,
            styles.forceRow,
          )}
        >
          <MotionDomainSelect
            colony={colony}
            onDomainChange={handleMotionDomainChange}
            initialSelectedDomain={domainID}
            disabled={noChanges}
          />
          {canCancelExpenditure && isVotingExtensionEnabled && (
            <div className={styles.toggleContainer}>
              <Toggle
                label={{ id: 'label.force' }}
                name="forceAction"
                appearance={{ theme: 'danger' }}
                disabled={!userHasPermission || isSubmitting || noChanges}
                tooltipText={{ id: 'tooltip.forceAction' }}
                tooltipPopperOptions={{
                  placement: 'top-end',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [-5, 6],
                      },
                    },
                  ],
                  strategy: 'fixed',
                }}
              />
            </div>
          )}
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
        {!confirmedValues || noChanges ? (
          <div className={styles.noChanges}>
            <FormattedMessage {...MSG.noChanges} />
          </div>
        ) : (
          confirmedValuesWithIds.map(({ key, value, id }, index) => {
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
                                  oldValue.recipient?.profile.displayName ||
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
                                          name={token.name || token.address}
                                        />
                                      </span>

                                      <Numeral
                                        // eslint-disable-next-line max-len
                                        unit={getTokenDecimalsWithFallback(0)}
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
              <React.Fragment key={id}>
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
              </React.Fragment>
            );
          })
        )}
      </div>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotationsWrapper}>
          <Annotations
            label={
              values.forceAction ? MSG.forceTextareaLabel : MSG.descriptionLabel
            }
            name="annotationMessage"
            maxLength={90}
            disabled={noChanges}
          />
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
            theme: values.forceAction ? 'danger' : 'primary',
            size: 'large',
          }}
          autoFocus
          text={values.forceAction ? MSG.confirmTexForce : MSG.confirmText}
          onClick={(e) => {
            handleSubmit(e as any);
            onSubmitClick(confirmedValues, values.forceAction);
            close();
          }}
          disabled={noChanges}
        />
      </DialogSection>
    </Dialog>
  );
};

EditExpenditureDialogForm.displayName = displayName;

export default EditExpenditureDialogForm;
