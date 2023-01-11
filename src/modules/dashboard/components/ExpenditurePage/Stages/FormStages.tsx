import { useFormikContext, setNestedObjectValues, FormikTouched } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import DeleteDraftDialog from '~dashboard/Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import StartStreamDialog from '~dashboard/Dialogs/StartStreamDialog';
import { Colony } from '~data/index';
import {
  ExpenditureTypes,
  StageObject,
  ValuesType,
} from '~pages/ExpenditurePage/types';
import { FIX_TRIGGER_EVENT_NAME } from '~pages/ExpenditurePage/constants';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import Stages from './Stages';
import StreamingStages from './StreamingStages';
import { Stage } from './types';
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
  stages: StageObject[];
  activeStageId?: string;
  setActiveStageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormValues: React.Dispatch<React.SetStateAction<ValuesType | undefined>>;
  colony: Colony;
  handleCancelExpenditure: () => void;
}

const FormStages = ({
  stages,
  activeStageId,
  setActiveStageId,
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
  const openStartStreamDialog = useDialog(StartStreamDialog);

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const formikErrors = useMemo(() => {
    const errorsFlat = flattenObject(formikErr);
    return Object.keys(errorsFlat);
  }, [formikErr]);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const errorsLength = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));

    if (values.expenditure === ExpenditureTypes.Streaming) {
      return (
        !errorsLength &&
        colony &&
        openStartStreamDialog({
          onClick: () => {
            handleSubmit(values as any);
            setActiveStageId?.(Stage.Released);
          },
          isVotingExtensionEnabled,
          values,
          colony,
        })
      );
    }

    return (
      !errorsLength &&
      colony &&
      openDraftConfirmDialog({
        onClick: () => {
          handleSubmit(values as any);
          setActiveStageId?.(Stage.Draft);
        },
        isVotingExtensionEnabled,
        colony,
      })
    );
  }, [
    colony,
    handleSubmit,
    isVotingExtensionEnabled,
    openDraftConfirmDialog,
    openStartStreamDialog,
    setActiveStageId,
    setTouched,
    validateForm,
    values,
  ]);

  const handleDeleteDraft = () =>
    openDeleteDraftDialog({
      onClick: () => {
        resetForm();
        // add logic to delete the draft from database
        setActiveStageId(undefined);
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
          name: formikErrors[0],
        },
      });

      window.dispatchEvent(customEvent);
    }
  }, [setTouched, formikErr, formikErrors]);

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
            stages,
            activeStageId,
            setActiveStageId,
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
