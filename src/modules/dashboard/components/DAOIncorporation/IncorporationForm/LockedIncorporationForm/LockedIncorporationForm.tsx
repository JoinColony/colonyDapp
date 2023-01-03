import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel, SelectHorizontal, Form } from '~core/Fields';
import { Colony } from '~data/index';
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
  sidebarRef: HTMLElement | null;
  colony: Colony;
  formValues: ValuesType;
}

const LockedIncorporationForm = ({ sidebarRef }: Props) => {
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
        <div className={styles.namesWrapper}>
          {/* <InputLabel label={MSG.nameLabel} /> */}
          <Form initialValues={{}} onSubmit={() => {}}>
            <SelectHorizontal
              name="name"
              label={MSG.nameLabel}
              appearance={{
                theme: 'alt',
                width: 'content',
              }}
              options={[
                { label: 'WallStreetBets', value: 'WallStreetBets' },
                { label: 'WallStreetBets2', value: 'WallStreetBets' },
              ]}
              scrollContainer={sidebarRef}
              placement="bottom"
              withDropdownElement
              optionSizeLarge
              autoHeight
              unselectable
            />
          </Form>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.descriptionWrapper}>
          <InputLabel label={MSG.descriptionLabel} />
          <div className={styles.description}>
            WallStreetBets is on a mission to deploy decentralized satellites in
            our skies.
          </div>
        </div>
      </FormSection>
      <LockedProtectors />
    </div>
  );
};

LockedIncorporationForm.displayName = displayName;

export default LockedIncorporationForm;
