import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel, SelectHorizontal, Form } from '~core/Fields';
import Icon from '~core/Icon';
import { ValuesType } from '~pages/IncorporationPage/types';

import LockedProtectors from '../LockedProtectors';

import styles from './LockedIncorporationForm.css';

export const MSG = defineMessages({
  incorporation: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm.incorporation`,
    defaultMessage: 'Incorporation',
  },
  initialCost: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm.initialCost`,
    defaultMessage: 'Initial cost',
  },
  ongoingCost: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm.ongoingCost`,
    defaultMessage: 'Ongoing cost',
  },
  cost: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm.cost`,
    defaultMessage: '{icon} {amount} {currency}',
  },
  nameLabel: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm.nameLabel`,
    defaultMessage: 'Corporation name',
  },
  descriptionLabel: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm.descriptionLabel`,
    defaultMessage: 'DAO Purpose',
  },
});

const displayName = `dashboard.DAOIncorporation.IncorporationForm.LockedIncorporationForm`;

export interface Props {
  formValues: ValuesType;
}

const LockedIncorporationForm = ({ formValues }: Props) => {
  const alternativeNames = useMemo(
    () =>
      formValues.alternativeNames.map((name) => ({
        label: name,
        value: name,
      })),
    [formValues.alternativeNames],
  );

  return (
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
            <FormattedMessage
              {...MSG.cost}
              values={{
                icon: <Icon name="usd-coin" appearance={{ size: 'medium' }} />,
                amount: '5,300',
                currency: 'USDC',
              }}
            />
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.costRow}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.ongoingCost} />
          </div>
          <div className={styles.cost}>
            <FormattedMessage
              {...MSG.cost}
              values={{
                icon: <Icon name="usd-coin" appearance={{ size: 'medium' }} />,
                amount: '3,800 / year',
                currency: 'USDC',
              }}
            />
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        {/* A form is used here because the SelectHorizontal component must be wrapped in a Formik form. It doesn't send data anywhere. */}
        <Form initialValues={{}} onSubmit={() => {}}>
          <div className={styles.namesWrapper}>
            <SelectHorizontal
              name="name"
              label={MSG.nameLabel}
              appearance={{
                theme: 'alt',
                width: 'content',
              }}
              renderActiveOption={() => <>{formValues.name}</>}
              options={alternativeNames}
              autoHeight
              unselectable
            />
          </div>
        </Form>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.descriptionWrapper}>
          <InputLabel label={MSG.descriptionLabel} />
          <div className={styles.description}>{formValues.purpose}</div>
        </div>
      </FormSection>
      <LockedProtectors formValues={formValues} />
    </div>
  );
};

LockedIncorporationForm.displayName = displayName;

export default LockedIncorporationForm;
