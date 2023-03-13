import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel, SelectHorizontal, Form } from '~core/Fields';
import Icon from '~core/Icon';
import { Stages } from '~pages/IncorporationPage/constants';
import { ValuesType } from '~pages/IncorporationPage/types';
import { multiLineTextEllipsis } from '~utils/strings';

import LockedProtectors from '../LockedProtectors';

import styles from './LockedIncorporationForm.css';

export const MSG = defineMessages({
  incorporation: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.incorporation`,
    defaultMessage: 'Incorporation',
  },
  initialCost: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.initialCost`,
    defaultMessage: 'Initial cost',
  },
  ongoingCost: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.ongoingCost`,
    defaultMessage: 'Ongoing cost',
  },
  cost: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.cost`,
    defaultMessage: '{icon} {amount} {currency}',
  },
  nameLabel: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.nameLabel`,
    defaultMessage: 'Corporation name',
  },
  descriptionLabel: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.descriptionLabel`,
    defaultMessage: 'DAO Purpose',
  },
  editApplication: {
    id: `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm.editApplication`,
    defaultMessage: 'Edit application',
  },
});

const displayName = `dashboard.Incorporation.IncorporationForm.LockedIncorporationForm`;

export interface Props {
  formValues: ValuesType;
  editForm: VoidFunction;
  activeStageId: Stages;
}

const LockedIncorporationForm = ({
  formValues,
  activeStageId,
  editForm,
}: Props) => {
  const { alternativeName1: altName1, alternativeName2: altName2 } = formValues;
  const alternativeNames = useMemo(
    () => [
      { label: multiLineTextEllipsis(altName1, 20), value: altName1 },
      { label: multiLineTextEllipsis(altName2, 20), value: altName2 },
    ],
    [altName1, altName2],
  );

  return (
    <div className={styles.container}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.title}>
          <FormattedMessage {...MSG.incorporation} />
          {activeStageId !== Stages.Complete && (
            <span className={styles.editIcon}>
              <Icon
                name="edit"
                appearance={{ size: 'medium' }}
                title={MSG.editApplication}
                onClick={editForm}
              />
            </span>
          )}
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
              renderActiveOption={() => (
                <>{multiLineTextEllipsis(formValues.name || '', 20)}</>
              )}
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
