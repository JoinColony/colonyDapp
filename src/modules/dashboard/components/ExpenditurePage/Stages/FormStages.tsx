import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';

import { useDialog } from '~core/Dialog';
import DeleteDraftDialog from '~dashboard/Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import { Colony } from '~data/index';
import { State, ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';

import { Stage } from './constants';
import Stages from './Stages';

const displayName = 'dashboard.ExpenditurePage.Stages.FormStages';

interface Props {
  states: State[];
  activeStateId?: string;
  setActiveStateId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormValues?: React.Dispatch<React.SetStateAction<ValuesType | undefined>>;
  colony?: Colony;
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
  const { values, handleSubmit, validateForm, resetForm } =
    useFormikContext<ValuesType>() || {};
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;

    return (
      !hasErrors &&
      colony &&
      openDraftConfirmDialog({
        onClick: () => {
          handleSubmit(values as any);
          setActiveStateId?.(Stage.Draft);
        },
        isVotingExtensionEnabled: true,
        colony,
      })
    );
  }, [
    colony,
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
        setActiveStateId,
        handleButtonClick,
        handleDeleteDraft,
        handleSaveDraft,
        handleCancelExpenditure,
      }}
    />
  );
};

FormStages.displayName = displayName;

export default FormStages;
