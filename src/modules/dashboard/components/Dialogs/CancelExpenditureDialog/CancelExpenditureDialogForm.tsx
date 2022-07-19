import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import Dialog, { DialogSection } from '~core/Dialog';
import styles from './CancelExpenditureDialog.css';
import { tokens as tokensMock } from '~dashboard/ExpenditurePage/ExpenditureSettings/constants';
import { Annotations, Radio, SelectOption, Toggle } from '~core/Fields';
import { FormValues } from './CancelExpenditureDialog';
import { Colony } from '~data/index';
import Icon from '~core/Icon';
import Heading from '~core/Heading';
import { Tooltip } from '~core/Popover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import DomainDropdown from '~core/DomainDropdown';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelExpenditureDialog.header',
    defaultMessage: 'Cancel payment',
  },
  force: {
    id: 'dashboard.CancelExpenditureDialog.force',
    defaultMessage: 'Force',
  },
  ownersStake: {
    id: 'dashboard.CancelExpenditureDialog.ownersStake',
    defaultMessage: `Owner's stake`,
  },
  shouldBePenalized: {
    id: 'dashboard.CancelExpenditureDialog.shouldBePenalized',
    defaultMessage: 'Do you want to penalize the owner?',
  },
  penalize: {
    id: 'dashboard.CancelExpenditureDialog.penalize',
    defaultMessage: 'Penalize',
  },
  showMercy: {
    id: 'dashboard.CancelExpenditureDialog.showMercy',
    defaultMessage: 'Show mercy',
  },
  penalizeMessage: {
    id: 'dashboard.CancelExpenditureDialog.penalizeMessage',
    defaultMessage: 'Owner will lose their stake and equivalent reputation.',
  },
  mercyMessage: {
    id: 'dashboard.CancelExpenditureDialog.mercyMessage',
    defaultMessage: 'Owner will keep their stake and reputation.',
  },
  submit: {
    id: 'dashboard.CancelExpenditureDialog.submit',
    defaultMessage: 'Submit',
  },
  textareaLabel: {
    id: 'dashboard.CancelExpenditureDialog.textareaLabel',
    defaultMessage: `Explain why you're cancelling this payment (optional)`,
  },
  effectTooltip: {
    id: 'dashboard.CancelExpenditureDialog.effectTooltip',
    defaultMessage: `Decide what to do with the owner's stake when cancelling this Advanced Payment.`,
  },
  createDomain: {
    id: 'dashboard.EscrowFundsDialog.creationTarget',
    defaultMessage: 'Motion will be created in',
  },
});

const displayName =
  'dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm';

interface Props {
  close: () => void;
  colony?: Colony;
  onClick: (isForce: boolean) => void;
  isForce: boolean;
  setIsForce: React.Dispatch<React.SetStateAction<boolean>>;
}

const CancelExpenditureDialogForm = ({
  close,
  colony,
  onClick,
  isForce,
  setIsForce,
}: Props) => {
  const { isSubmitting, values, handleSubmit } = useFormikContext<FormValues>();
  const [domainID, setDomainID] = useState<number>();
  // temporary data
  const tokens = [tokensMock[0]];
  const { formatMessage } = useIntl();

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  const filterDomains = useCallback((optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);

    return optionDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID;
  }, []);

  const renderActiveDomainOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      let displayLabel =
        parseInt(option?.value || `${ROOT_DOMAIN_ID}`, 10) === ROOT_DOMAIN_ID
          ? `${formatMessage(MSG.createDomain)} ${label}`
          : `${formatMessage(MSG.createDomain)} ${formatMessage({
              id: 'domain.root',
            })}/${label}`;

      if (!option) {
        displayLabel = `${formatMessage({ id: 'domain.root' })}`;
      }
      return <div className={styles.motionActiveItem}>{displayLabel}</div>;
    },
    [formatMessage],
  );

  useEffect(() => {
    if (values.forceAction !== isForce) {
      setIsForce(values.forceAction);
    }
  }, [isForce, setIsForce, values]);

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
          {colony && (
            <div>
              <DomainDropdown
                colony={colony}
                name="motionDomainId"
                currentDomainId={domainID}
                renderActiveOptionFn={renderActiveDomainOption}
                filterOptionsFn={filterDomains}
                onDomainChange={handleMotionDomainChange}
                showAllDomains={false}
                showDescription={false}
              />
            </div>
          )}
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
              <Icon name="question-mark" className={styles.questionIcon} />
            </Tooltip>
          </div>
        </div>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.header} />
        </Heading>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div
          className={classNames(styles.row, styles.tokens, {
            [styles.top]: tokens.length > 1,
          })}
        >
          <FormattedMessage {...MSG.ownersStake} />
          <div className={styles.tokensWarpper}>
            {tokens?.map((token, index) => (
              <div
                className={classNames(styles.value, {
                  [styles.paddingBottom]:
                    tokens.length > 1 && index !== tokens.length - 1,
                })}
                key={token.id}
              >
                <TokenIcon
                  className={styles.tokenIcon}
                  token={token}
                  name={token.name || token.address}
                />
                <Numeral unit={getTokenDecimalsWithFallback(0)} value={0.1} />
                {token.symbol}
              </div>
            ))}
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.radioGroup}>
          <div className={styles.textWrapper}>
            <FormattedMessage {...MSG.shouldBePenalized} />
            <Tooltip
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage {...MSG.effectTooltip} />
                </div>
              }
              trigger="hover"
              popperOptions={{
                placement: 'top-end',
                strategy: 'fixed',
              }}
            >
              <Icon name="question-mark" className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: values.effect === 'penalize',
            })}
          >
            <Radio
              name="effect"
              value="penalize"
              checked={values.effect === 'penalize'}
              elementOnly
            >
              <FormattedMessage {...MSG.penalize} />
            </Radio>
          </div>
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: values.effect === 'mercy',
            })}
          >
            <Radio
              name="effect"
              value="mercy"
              checked={values.effect === 'mercy'}
              elementOnly
            >
              <FormattedMessage {...MSG.showMercy} />
            </Radio>
          </div>
        </div>
        <div
          className={classNames(styles.message, {
            [styles.messageWarning]: values.effect === 'penalize',
          })}
        >
          <FormattedMessage
            {...(values.effect === 'penalize'
              ? MSG.penalizeMessage
              : MSG.mercyMessage)}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotations}>
          <Annotations
            label={MSG.textareaLabel}
            name="annotation"
            maxLength={90}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          style={{
            width: styles.buttonWidth,
          }}
          autoFocus
          text={MSG.submit}
          type="submit"
          onClick={() => {
            // onClick and close are temporary, only handleSubmit should stay here
            onClick(isForce);
            close();
            handleSubmit();
          }}
        />
      </DialogSection>
    </Dialog>
  );
};

CancelExpenditureDialogForm.displayName = displayName;

export default CancelExpenditureDialogForm;
