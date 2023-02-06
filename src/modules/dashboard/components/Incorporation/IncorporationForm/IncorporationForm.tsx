import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, Input, Textarea, InputLabel } from '~core/Fields';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import Protectors from './Protectors';
import { cost } from './constants';
import styles from './IncorporationForm.css';

export const MSG = defineMessages({
  incorporation: {
    id: 'dashboard.Incorporation.IncorporationForm.incorporation',
    defaultMessage: 'Incorporation',
  },
  initialCost: {
    id: 'dashboard.Incorporation.IncorporationForm.initialCost',
    defaultMessage: 'Initial cost',
  },
  ongoingCost: {
    id: 'dashboard.Incorporation.IncorporationForm.ongoingCost',
    defaultMessage: 'Ongoing cost',
  },
  cost: {
    id: 'dashboard.Incorporation.IncorporationForm.cost',
    defaultMessage: '{icon} {amount} {currency}',
  },
  nameLabel: {
    id: 'dashboard.Incorporation.IncorporationForm.nameLabel',
    defaultMessage: 'Name of Corporation',
  },
  alternativelNamesLabel: {
    id: 'dashboard.Incorporation.IncorporationForm.alternativelNamesLabel',
    defaultMessage: 'Alternative names',
  },
  alternativeNamesTooltip: {
    id: 'dashboard.Incorporation.IncorporationForm.alternativeNamesTooltip',
    defaultMessage: `If your first choice is unavailable, we will try to register one of these alternatives. Please avoid trademark infringement.`,
  },
  descriptionLabel: {
    id: 'dashboard.Incorporation.IncorporationForm.descriptionLabel',
    defaultMessage: 'Describe the purpose of the DAO',
  },
  submit: {
    id: 'dashboard.Incorporation.IncorporationForm.submit',
    defaultMessage: 'Submit',
  },
});

const displayName = 'dashboard.Incorporation.IncorporationForm';

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const IncorporationForm = ({ colony, sidebarRef }: Props) => (
  <div className={styles.container}>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.incorporation} />
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.costRow}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.initialCost} />
        </div>
        <div className={styles.cost}>
          <TokenIcon
            token={cost.initial.token}
            name={cost.initial.token.name}
            size="xs"
          />
          <Numeral
            value={cost.initial.amount || 0}
            unit={getTokenDecimalsWithFallback(
              cost.initial.token && cost.initial.token.decimals,
            )}
          />
          {cost.initial.token.symbol}
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.costRow}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.ongoingCost} />
        </div>
        <div className={styles.cost}>
          <TokenIcon
            token={cost.reneval.token}
            name={cost.reneval.token.name}
            size="xs"
          />
          <Numeral
            value={cost.reneval.amount || 0}
            unit={getTokenDecimalsWithFallback(
              cost.reneval.token && cost.reneval.token.decimals,
            )}
          />
          {cost.reneval.token.symbol} / year
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.nameInputs}>
        <Input name="name" label={MSG.nameLabel} />
        <div className={styles.labelWrapper}>
          <InputLabel label={MSG.alternativelNamesLabel} />
          <QuestionMarkTooltip tooltipText={MSG.alternativeNamesTooltip} />
        </div>
        <div className={styles.altNameWrapper}>
          <Input name="alternativeName1" elementOnly />
        </div>
        <div className={styles.altNameWrapper}>
          <Input name="alternativeName2" elementOnly />
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.textareaWrapper}>
        <Textarea
          name="description"
          label={MSG.descriptionLabel}
          maxLength={90}
        />
      </div>
    </FormSection>
    <Protectors colony={colony} sidebarRef={sidebarRef} />
    <button type="submit" tabIndex={-1} className={styles.hiddenSubmit}>
      <FormattedMessage {...MSG.submit} />
    </button>
  </div>
);

IncorporationForm.displayName = displayName;

export default IncorporationForm;
