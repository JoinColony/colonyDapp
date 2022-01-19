import React, { useCallback, useEffect, useState, RefObject } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import { ActionForm, TextareaAutoresize, InputStatus } from '~core/Fields';
import { MiniSpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useGetRecoveryStorageSlotLazyQuery,
  useLoggedInUser,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { ensureHexPrefix } from '~utils/strings';
import { ENTER, SPACE } from '~types/index';
import { mapPayload } from '~utils/actions';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';

import styles from './InputStorageWidget.css';

export interface FormValues {
  storageSlotLocation?: string;
  newStorageSlotValue?: string;
}

interface Props {
  colony: Colony;
  startBlock?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
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

const InputStorageWidget = ({
  colony: { colonyAddress },
  colony,
  startBlock = 1,
  scrollToRef,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
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
   * Prevent entering a new line
   *
   * Based on specs we need to **fake** a multi-line input, but one
   * you can't actually create a new line manully, just if the text
   * overflows...
   *
   * While we're at it we also disable the space bar, since no value
   * that can be entered requires a space (it's just a litte nice-to-have)
   */
  const handleOnKeyDown = useCallback((event) => {
    if (event.key === ENTER || event.code === SPACE) {
      event.preventDefault();
    }
  }, []);

  /*
   * We need to handle these manually using a ref, since the TextAreaAutoresize
   * component doesn't give us access to the native React ones :(
   */
  const handleStorageSlotLocationBlur = (
    autoResizeTextarea: HTMLElement | null,
    currentValue,
    fieldError,
    updateValues,
  ) => {
    if (autoResizeTextarea) {
      /*
       * Add 0x prefix on blur and set the storage slot in state
       */
      // eslint-disable-next-line no-param-reassign
      autoResizeTextarea.onblur = () => {
        if (!fieldError && currentValue) {
          const normalizedStorageSlot = ensureHexPrefix(currentValue);
          updateValues('storageSlotLocation', normalizedStorageSlot);
          setStorageSlot(normalizedStorageSlot);
        }
        if (!currentValue) {
          setStorageSlot('');
        }
      };

      autoResizeTextarea.addEventListener('keydown', handleOnKeyDown);
    }
  };
  /*
   * We need to handle these manually using a ref, since the TextAreaAutoresize
   * component doesn't give us access to the native React ones :(
   */
  const handleNewStorageSlotValueBlur = (
    autoResizeTextarea: HTMLElement | null,
    currentValue,
    fieldError,
    updateValues,
  ) => {
    if (autoResizeTextarea) {
      /*
       * Add 0x prefix on blur and set the storage slot in state
       */
      // eslint-disable-next-line no-param-reassign
      autoResizeTextarea.onblur = () => {
        if (!fieldError && currentValue) {
          const noPrefixValue = currentValue.startsWith('0x')
            ? currentValue.slice(2)
            : currentValue;
          const paddedValue = noPrefixValue.padStart(64, '0');
          updateValues('newStorageSlotValue', ensureHexPrefix(paddedValue));
        }
      };

      autoResizeTextarea.addEventListener('keydown', handleOnKeyDown);
    }
  };

  const handleSubmitSuccess = useCallback(
    (_, { resetForm }) => {
      /*
       * Reset the storage slot form and scroll to the bottom of the page
       *
       * Note that we don't actually know where the bottom of the page is,
       * but we know where the comment box is (which is always visible if the user
       * is logged in)
       * So we use that to scroll it into view, knowing that it will always
       * scroll to the correct position
       */
      resetForm({});
      setStorageSlot('');
      scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
    },
    [scrollToRef],
  );

  const transform = useCallback(
    mapPayload(({ storageSlotLocation, newStorageSlotValue }) => ({
      colonyAddress,
      walletAddress,
      startBlock,
      storageSlotLocation,
      storageSlotValue: newStorageSlotValue,
    })),
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = userHasRole(allUserRoles, ColonyRole.Recovery);

  return (
    <ActionForm
      initialValues={{
        storageSlotLocation: '',
        newStorageSlotValue: '',
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_RECOVERY_SET_SLOT}
      error={ActionTypes.COLONY_ACTION_RECOVERY_SET_SLOT_ERROR}
      success={ActionTypes.COLONY_ACTION_RECOVERY_SET_SLOT_SUCCESS}
      transform={transform}
      onSuccess={handleSubmitSuccess}
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
                <MiniSpinnerLoader
                  className={styles.loadingSlotValue}
                  loadingText={MSG.loadingSlotValue}
                />
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
              disabled={!hasRegisteredProfile || !userHasPermission}
            />
            {newStorageSlotValueError && (
              <span className={styles.inputValidationError}>
                <InputStatus error={newStorageSlotValueError} />
              </span>
            )}
            {hasRegisteredProfile && userHasPermission && (
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
