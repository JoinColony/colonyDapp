import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Input } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';

import styles from './InputStorageWidgetForm.css';
import { FormValues } from './InputStorageWidget';

const LEARN_MORE_URL = '#CHANGEME';
const CURRENT_VALUE_PLACEHOLDER =
  '0x0000000000000000000000000000000000 000000000000000004939EF6B04812';

const MSG = defineMessages({
  inputStorageLot: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.inputStorageLot',
    defaultMessage: 'Input storage lot',
  },
  inputNewValue: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.inputNewValue',
    defaultMessage: 'Input new value',
  },
  currentValueLabel: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.currentValueLabel',
    defaultMessage: 'Current value:',
  },
  currentValue: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.currentValue',
    defaultMessage: '{currentValue}',
  },
  token: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.address',
    defaultMessage: 'Token',
  },
  learnMoreLink: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.learnMoreLink',
    defaultMessage: 'Learn more',
  },
});

const InputStorageWidgetForm = ({
  handleSubmit,
  isSubmitting,
  isValid,
}: FormikProps<FormValues>) => {
  return (
    <div className={styles.widgetForm}>
      <ExternalLink
        className={styles.learnMoreLink}
        text={MSG.learnMoreLink}
        href={LEARN_MORE_URL}
      />
      <Input
        label={MSG.inputStorageLot}
        name="inputStorageLot"
        appearance={{
          theme: 'fat',
        }}
      />
      <p className={styles.currentValueText}>
        <FormattedMessage {...MSG.currentValueLabel} />
      </p>
      <p className={styles.currentValueText}>
        <FormattedMessage
          {...MSG.currentValue}
          values={{ currentValue: CURRENT_VALUE_PLACEHOLDER }}
        />
      </p>
      <Input
        label={MSG.inputNewValue}
        name="inputNewValue"
        appearance={{
          theme: 'fat',
        }}
      />
      <div className={styles.formFooter}>
        <Button
          appearance={{ theme: 'primary', size: 'medium' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.submit' }}
          loading={isSubmitting}
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

InputStorageWidgetForm.displayName =
  'dashboard.InputStorageWidget.InputStorageWidgetForm';

export default InputStorageWidgetForm;
