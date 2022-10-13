import { useFormikContext, setNestedObjectValues, FormikTouched } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import DeleteDraftDialog from '~dashboard/Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import { Colony } from '~data/index';
import {
  ExpenditureTypes,
  State,
  ValuesType,
} from '~pages/ExpenditurePage/types';
import { fixTriggerEventName } from '~pages/ExpenditurePage/constants';

import { Stage, useObserver } from './constants';
import Stages from './Stages';
import StreamingStages from './StreamingStages';

import styles from './FormStages.css';

const displayName = 'dashboard.ExpenditurePage.Stages.FormStages';

const MSG = defineMessages({
  singleErrorMessage: {
    id: 'dashboard.ExpenditurePage.Stages.FormStages.singleErrorMessage',
    defaultMessage: '{number} required field has an error.',
  },
  mulitpleErrorMessage: {
    id: 'dashboard.ExpenditurePage.Stages.FormStages.mulitpleErrorMessage',
    defaultMessage: '{number} required fields have an error.',
  },
  errorMessageAction: {
    id: 'dashboard.ExpenditurePage.Stages.FormStages.errorMessageAction',
    defaultMessage: 'Fix it!',
  },
});

interface Props {
  states: State[];
  activeStateId?: string;
  setActiveStateId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormValues?: React.Dispatch<React.SetStateAction<ValuesType | undefined>>;
  colony: Colony;
  handleCancelExpenditure: () => void;
}

const FormStages = ({
  states,
  activeStateId,
  setActiveStateId,
  setFormValues,
  colony,
  handleCancelExpenditure,
}: Props) => {
  const { values, handleSubmit, validateForm, resetForm, setTouched } =
    useFormikContext<ValuesType>() || {};
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);
  const [fieldErrorsAmount, setFieldErrorsAmount] = useState<number>(0);
  const { observer } = useObserver(setFieldErrorsAmount);

  const handleSaveDraft = useCallback(async () => {
    setFieldErrorsAmount(0);
    const errors = await validateForm(values);
    const errorsLength = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));

    const invalidFields = document
      .getElementById('expenditurePage')
      ?.querySelectorAll('[aria-invalid="true"]');
    const invalidFieldsLength = invalidFields?.length;
    setFieldErrorsAmount(
      errors && invalidFieldsLength ? invalidFieldsLength : 0,
    );

    if (invalidFields) {
      Array.from(invalidFields).map((el) => {
        return observer.observe(el, {
          attributes: true,
        });
      });
    }

    return !errorsLength && colony
      ? openDraftConfirmDialog({
          onClick: () => {
            handleSubmit(values as any);
            setActiveStateId?.(Stage.Draft);
          },
          isVotingExtensionEnabled: true, // 'true' is temporary value
          colony,
        })
      : errorsLength;
  }, [
    colony,
    handleSubmit,
    openDraftConfirmDialog,
    setActiveStateId,
    setTouched,
    validateForm,
    values,
    observer,
  ]);

  const handleDeleteDraft = () =>
    openDeleteDraftDialog({
      onClick: () => {
        resetForm?.();
        // add logic to delete the draft from database
        setActiveStateId?.(undefined);
        setFormValues?.(undefined);
      },
    });

  const activeState = states.find((state) => state.id === activeStateId);

  const handleButtonClick = useCallback(async () => {
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));

    if (!hasErrors) {
      handleSubmit(values as any);
      activeState?.buttonAction();
    }
  }, [activeState, handleSubmit, setTouched, validateForm, values]);

  const handleFixButtonClick = useCallback(() => {
    // error fields should have aria invalid attr if the validation does not pass - for input it is auto-added
    const invalidFields = document
      .getElementById('expenditurePage')
      ?.querySelectorAll('[aria-invalid="true"]');
    const invalidFieldsLength = invalidFields?.length;

    if (invalidFieldsLength !== fieldErrorsAmount) {
      // check if the invalid fields amount has changed (fieldErrorsAmount was prev set only during the submit)
      setFieldErrorsAmount(invalidFieldsLength ?? 0);
    }

    if (!invalidFieldsLength) return;

    const firstInvalidEl = invalidFields && invalidFields[0];

    if (firstInvalidEl?.tagName.toLowerCase() === 'input') {
      (firstInvalidEl as HTMLElement).focus();
    } else {
      const customEvent = new CustomEvent(fixTriggerEventName, {
        detail: {
          order: Number((firstInvalidEl as HTMLElement).dataset.index),
        },
      });

      window.dispatchEvent(customEvent);
    }
  }, [fieldErrorsAmount]);

  return (
    <div className={styles.formStages}>
      {!!fieldErrorsAmount && (
        <div className={styles.formStagesMsg}>
          <p className={styles.formStagesMsgText}>
            <FormattedMessage
              {...(fieldErrorsAmount > 1
                ? { ...MSG.mulitpleErrorMessage }
                : { ...MSG.singleErrorMessage })}
              values={{ number: fieldErrorsAmount }}
            />
          </p>
          <button
            type="button"
            onClick={handleFixButtonClick}
            className={styles.formStagesMsgAction}
          >
            <FormattedMessage {...MSG.errorMessageAction} />
          </button>
        </div>
      )}
      {values.expenditure === ExpenditureTypes.Streaming ? (
        <StreamingStages handleSaveDraft={handleSaveDraft} />
      ) : (
        <Stages
          {...{
            states,
            activeStateId,
            setActiveStateId,
            handleButtonClick,
            handleDeleteDraft,
            handleSaveDraft,
            handleCancelExpenditure,
            colony,
          }}
        />
      )}
    </div>
  );
};

FormStages.displayName = displayName;

export default FormStages;
