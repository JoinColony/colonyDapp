import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useDialog } from '~core/Dialog';
import DeleteDraftDialog from '~dashboard/Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import { State, ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { Stage } from './constants';
import Stages from './Stages';

const displayName = 'dashboard.ExpenditurePage.FormStages';

export interface Props {
  states: State[];
  activeStateId?: string;
  setActiveStateId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  pendingChanges?: boolean;
  forcedChanges?: boolean;
  setFormValues?: React.Dispatch<React.SetStateAction<ValuesType | undefined>>;
}

const FormStages = ({
  states,
  activeStateId,
  setActiveStateId,
  pendingChanges,
  forcedChanges,
  setFormValues,
}: Props) => {
  const { values, handleSubmit, validateForm, resetForm } =
    useFormikContext<ValuesType>() || {};
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;

    return (
      !hasErrors &&
      openDraftConfirmDialog({
        onClick: () => {
          handleSubmit(values as any);
          setActiveStateId?.(Stage.Draft);
        },
        isVotingExtensionEnabled: true,
      })
    );
  }, [
    handleSubmit,
    openDraftConfirmDialog,
    setActiveStateId,
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

    if (!hasErrors) {
      handleSubmit(values as any);
      activeState?.buttonAction();
    }
  }, [activeState, handleSubmit, validateForm, values]);

  return (
    <Stages
      {...{
        states,
        activeStateId,
        forcedChanges,
        pendingChanges,
        setActiveStateId,
        handleButtonClick,
        handleDeleteDraft,
        handleSaveDraft,
      }}
    />
  );
};

FormStages.displayName = displayName;

export default FormStages;
