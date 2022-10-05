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

import { Stage } from './constants';
import Stages from './Stages';
import StreamingStages from './StreamingStages';

import styles from './FormStages.css';

const displayName = 'dashboard.ExpenditurePage.Stages.FormStages';

const MSG = defineMessages({
  errorMessage: {
    id: 'dashboard.ExpenditurePage.Stages.FormStages.errorMessage',
    defaultMessage: '{number} required field has an error.',
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
  const [fieldErrors, setFieldErrors] = useState<number>(0);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));
    setFieldErrors(errorsLength);

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

  const handleSubmitButtonClick = () => {
    // const firstInvalidEl = document
    //   .getElementById('expenditureForm')
    //   ?.querySelectorAll('[aria-invalid="true"]')[0];
    // test - to be changed
    // firstInvalidEl.style.border = '1px solid deeppink';
    // firstInvalidEl?.focus();
  };

  return (
    <div className={styles.formStages}>
      {!!fieldErrors && (
        <div className={styles.formStagesMsg}>
          <p className={styles.formStagesMsgText}>
            <FormattedMessage
              {...MSG.errorMessage}
              values={{ number: fieldErrors }}
            />
          </p>
          <button
            type="button"
            onClick={handleSubmitButtonClick}
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
