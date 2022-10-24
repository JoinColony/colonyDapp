import { useFormikContext, setNestedObjectValues, FormikTouched } from 'formik';
import React, { useCallback, useMemo } from 'react';
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
import { FIX_TRIGGER_EVENT_NAME } from '~pages/ExpenditurePage/constants';

import Stages from './Stages';
import StreamingStages from './StreamingStages';
import { Stage } from './constants';
import { flattenObject } from './utils';
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
  const {
    values,
    handleSubmit,
    validateForm,
    resetForm,
    setTouched,
    errors: formikErr,
  } = useFormikContext<ValuesType>() || {};
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

  const formikErrors = useMemo(() => {
    const errorsFlat = flattenObject(formikErr);
    return Object.keys(errorsFlat);
  }, [formikErr]);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const errorsLength = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));

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

  const handleFixButtonClick = useCallback(() => {
    setTouched(
      setNestedObjectValues<FormikTouched<ValuesType>>(formikErr, true),
    );
    if (!formikErrors.length) return;

    const firstError = document.getElementsByName(formikErrors[0])?.[0];

    if (firstError?.tagName.toLowerCase() === 'input') {
      (firstError as HTMLElement).focus();
    } else {
      const customEvent = new CustomEvent(FIX_TRIGGER_EVENT_NAME, {
        detail: {
          order: Number((firstError as HTMLElement).dataset.index),
        },
      });

      window.dispatchEvent(customEvent);

      if ((firstError as HTMLButtonElement).name === 'streaming.endDate') {
        (firstError as HTMLButtonElement).click();
      }
    }
  }, [formikErrors]);

  return (
    <div className={styles.formStages}>
      {!!formikErrors.length && (
        <div className={styles.formStagesMsg}>
          <p className={styles.formStagesMsgText}>
            <FormattedMessage
              {...(formikErrors.length > 1
                ? { ...MSG.mulitpleErrorMessage }
                : { ...MSG.singleErrorMessage })}
              values={{ number: formikErrors.length }}
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
