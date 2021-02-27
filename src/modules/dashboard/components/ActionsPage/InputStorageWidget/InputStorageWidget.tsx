import React, { useCallback, useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionForm, TextareaAutoresize, InputStatus } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';

import { ActionTypes } from '~redux/index';
import { ensureHexPrefix } from '~utils/strings';
import { ENTER, SPACE } from '~types/index';
import {
  Colony,
  useGetRecoveryStorageSlotLazyQuery,
  useLoggedInUser,
} from '~data/index';

import styles from './InputStorageWidget.css';

export interface FormValues {
  storageSlotLocation?: string;
  newStorageSlotValue?: string;
}

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  inputStorageSlot: {
    id: 'dashboard.ActionsPage.InputStorageWidget.inputStorageSlot',
    defaultMessage: 'Input storage slot',
  },
  inputNewValue: {
    id: 'dashboard.ActionsPage.InputStorageWidget.inputNewValue',
    defaultMessage: 'Input new value',
  },
  currentValueLabel: {
    id: 'dashboard.ActionsPage.InputStorageWidget.currentValueLabel',
    defaultMessage: 'Current value: {slotValue}',
  },
  token: {
    id: 'dashboard.ActionsPage.InputStorageWidget.address',
    defaultMessage: 'Token',
  },
  loadingSlotValue: {
    id: 'dashboard.ActionsPage.InputStorageWidget.loadingSlotValue',
    defaultMessage: 'Fetching storage slot value ...',
  },
});

const validationSchema = yup.object().shape({
  storageSlotLocation: yup.string().max(66).hexString(),
  newStorageSlotValue: yup.string().max(66).hexString(),
});

const InputStorageWidget = ({ colony: { colonyAddress } }: Props) => {
  const { username, ethereal } = useLoggedInUser();
  const [storageSlot, setStorageSlot] = useState('');

  const [
    fetchStorageSlotValue,
    { data, loading: loadinStorageSlotValue },
  ] = useGetRecoveryStorageSlotLazyQuery();

  useEffect(() => {
    if (storageSlot) {
      fetchStorageSlotValue({ variables: { colonyAddress, storageSlot } });
    }
  }, [storageSlot, colonyAddress, fetchStorageSlotValue]);

  /*
   * We need to handle these manually using a ref, since the TextAreaAutoresize
   * component doesn't give us access to the native React ones :(
   */
  const handleStorageSlotLocationBlur = useCallback(
    (textarea, currentValue, fieldError, updateValues) => {
      if (textarea?._ref) {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        const autoResizeTextareaComponent = textarea?._ref;
        /*
         * Add 0x prefix on blur and set the storage slot in state
         */
        autoResizeTextareaComponent.onblur = () => {
          if (!fieldError && currentValue) {
            const normalizedStorageSlot = ensureHexPrefix(currentValue);
            updateValues('storageSlotLocation', normalizedStorageSlot);
            setStorageSlot(normalizedStorageSlot);
          }
          if (!currentValue) {
            setStorageSlot('');
          }
        };
        /*
         * Prevent entering a new line
         *
         * Based on specs we need to **fake** a multi-line input, but one
         * you can't actually create a new line manully, just if the text
         * overflows...
         *
         * While we're at it we also disable the space bar, since no value
         * that can be entered requires a space (it's just a litte nice-to-have)
         */
        autoResizeTextareaComponent.onkeypress = (event) => {
          if (event.code === ENTER || event.code === SPACE) {
            event.preventDefault();
          }
        };
      }
    },
    [],
  );

  /*
   * We need to handle these manually using a ref, since the TextAreaAutoresize
   * component doesn't give us access to the native React ones :(
   */
  const handleNewStorageSlotValueBlur = useCallback(
    (textarea, currentValue, fieldError, updateValues) => {
      if (textarea?._ref) {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        const autoResizeTextareaComponent = textarea?._ref;
        /*
         * Add 0x prefix on blur and set the storage slot in state
         */
        autoResizeTextareaComponent.onblur = () => {
          if (!fieldError && currentValue) {
            const noPrefixValue = currentValue.startsWith('0x')
              ? currentValue.slice(2)
              : currentValue;
            const paddedValue = noPrefixValue.padStart(64, '0');
            updateValues('newStorageSlotValue', ensureHexPrefix(paddedValue));
            // ;
          }
        };
        /*
         * Prevent entering a new line
         *
         * Based on specs we need to **fake** a multi-line input, but one
         * you can't actually create a new line manully, just if the text
         * overflows...
         *
         * While we're at it we also disable the space bar, since no value
         * that can be entered requires a space (it's just a litte nice-to-have)
         */
        autoResizeTextareaComponent.onkeypress = (event) => {
          if (event.code === ENTER || event.code === SPACE) {
            event.preventDefault();
          }
        };
      }
    },
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <ActionForm
      initialValues={{
        storageSlotLocation: '',
        newStorageSlotValue: '',
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC} // @TODO: Add in correct ActionTypes
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
    >
      {({
        handleSubmit,
        isSubmitting,
        isValid,
        values: {
          storageSlotLocation: storageSlotLocationValue,
          newStorageSlotValue,
        },
        errors: {
          storageSlotLocation: storageSlotLocationError,
          newStorageSlotValue: newStorageSlotValueError,
        },
        setFieldValue,
      }: FormikProps<FormValues>) => (
        <div className={styles.widgetForm}>
          <div className={styles.inputStorageSlotContainer}>
            <TextareaAutoresize
              label={MSG.inputStorageSlot}
              name="storageSlotLocation"
              innerRef={(ref) =>
                handleStorageSlotLocationBlur(
                  ref,
                  storageSlotLocationValue,
                  storageSlotLocationError,
                  setFieldValue,
                )
              }
              appearance={{
                theme: 'fat',
                colorSchema: 'grey',
              }}
              disabled={!hasRegisteredProfile}
            />
            {storageSlotLocationError && (
              <span className={styles.inputValidationError}>
                <InputStatus error={storageSlotLocationError} />
              </span>
            )}
            <div className={styles.currentValueText}>
              {loadinStorageSlotValue && (
                <div className={styles.loadingSlotValue}>
                  <SpinnerLoader />
                  <FormattedMessage tagName="span" {...MSG.loadingSlotValue} />
                </div>
              )}
              {data?.getRecoveryStorageSlot && storageSlot && (
                <FormattedMessage
                  {...MSG.currentValueLabel}
                  values={{
                    slotValue: <span>{data.getRecoveryStorageSlot}</span>,
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.inputStorageSlotContainer}>
            <TextareaAutoresize
              label={MSG.inputNewValue}
              name="newStorageSlotValue"
              innerRef={(ref) =>
                handleNewStorageSlotValueBlur(
                  ref,
                  newStorageSlotValue,
                  newStorageSlotValueError,
                  setFieldValue,
                )
              }
              appearance={{
                theme: 'fat',
                colorSchema: 'grey',
              }}
              disabled={!hasRegisteredProfile}
            />
            {newStorageSlotValueError && (
              <span className={styles.inputValidationError}>
                <InputStatus error={newStorageSlotValueError} />
              </span>
            )}
            {hasRegisteredProfile && (
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  onClick={() => handleSubmit()}
                  text={{ id: 'button.submit' }}
                  loading={isSubmitting}
                  disabled={
                    !isValid ||
                    !storageSlotLocationValue ||
                    !newStorageSlotValue
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </ActionForm>
  );
};

InputStorageWidget.displayName = 'dashboard.ActionsPage.InputStorageWidget';

export default InputStorageWidget;
