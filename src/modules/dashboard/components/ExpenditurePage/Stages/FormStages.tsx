import { useFormikContext, setNestedObjectValues, FormikTouched } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import DeleteDraftDialog from '~dashboard/Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import { Colony } from '~data/index';
import {
  ExpenditureTypes,
  StageObject,
  ValuesType,
} from '~pages/ExpenditurePage/types';

import { Stage } from './constants';
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
    id: 'dashboard.ExpenditurePage.Stages.FormStages.singleErrorMessage',
    defaultMessage: '{number} required fields have an error.',
  },
  errorMessageAction: {
    id: 'dashboard.ExpenditurePage.Stages.FormStages.errorMessageAction',
    defaultMessage: 'Fix it!',
  },
});

interface Props {
  stages: StageObject[];
  activeStageId?: string;
  setActiveStateId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormValues: React.Dispatch<React.SetStateAction<ValuesType | undefined>>;
  colony: Colony;
  handleCancelExpenditure: () => void;
}

const FormStages = ({
  stages,
  activeStageId,
  setActiveStateId,
  setFormValues,
  colony,
  handleCancelExpenditure,
}: Props) => {
  const {
    values,
    handleSubmit,
    validateForm,
    resetForm,
    setTouched,
    errors: formikErrors,
  } = useFormikContext<ValuesType>() || {};
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);
  const [fieldErrors, setFieldErrors] = useState<number>(0);
  const invalidElementRef = useRef<HTMLElement | null>(null);

  const handleSaveDraft = useCallback(async () => {
    setFieldErrors(0);
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));
    const invalidFieldsLength = document
      .getElementById('expenditurePage')
      ?.querySelectorAll('[aria-invalid="true"]').length;
    setFieldErrors(invalidFieldsLength ?? 0);

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
        resetForm();
        // add logic to delete the draft from database
        setActiveStateId(undefined);
        setFormValues(undefined);
      },
    });
  const activeStage = stages.find((stage) => stage.id === activeStageId);

  const handleButtonClick = useCallback(async () => {
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));

    if (!hasErrors) {
      handleSubmit(values as any);
      activeStage?.buttonAction();
    }
  }, [activeStage, handleSubmit, setTouched, validateForm, values]);

  const handleSubmitButtonClick = () => {
    if (fieldErrors) {
      // error fields should have aria invalid attr if the validation does not pass - for most elements it is auto-added
      const firstInvalidEl = document
        .getElementById('expenditurePage')
        ?.querySelector('[aria-invalid="true"]');
      invalidElementRef.current = firstInvalidEl as HTMLElement;
      invalidElementRef?.current?.focus();
    }
  };

  return (
    <div className={styles.formStages}>
      {!!fieldErrors && (
        <div className={styles.formStagesMsg}>
          <p className={styles.formStagesMsgText}>
            <FormattedMessage
              {...(fieldErrors > 1
                ? { ...MSG.mulitpleErrorMessage }
                : { ...MSG.singleErrorMessage })}
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
            stages,
            activeStageId,
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
