import { useFormikContext, setNestedObjectValues, FormikTouched } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { flattenObject } from '~dashboard/ExpenditurePage/Stages/utils';
import { FIX_TRIGGER_EVENT_NAME } from '~pages/ExpenditurePage/constants';
import { StageObject, ValuesType } from '~pages/IncorporationPage/types';
import { Stages as StagesEnum } from '~pages/IncorporationPage/constants';
import { useDialog } from '~core/Dialog';
import DeleteDraftIncorporationDialog from '~dashboard/Dialogs/DeleteDraftIncorporationDialog';

import Stages from './Stages';
import styles from './Stages.css';

const displayName = 'dashboard.DAOIncorporation.Stages.FormStages';

const MSG = defineMessages({
  singleErrorMessage: {
    id: 'dashboard.DAOIncorporation.Stages.FormStages.singleErrorMessage',
    defaultMessage: '{number} required field has an error.',
  },
  mulitpleErrorMessage: {
    id: 'dashboard.DAOIncorporation.Stages.FormStages.mulitpleErrorMessage',
    defaultMessage: '{number} required fields have an error.',
  },
  errorMessageAction: {
    id: 'dashboard.DAOIncorporation.Stages.FormStages.errorMessageAction',
    defaultMessage: 'Fix it!',
  },
});

export interface Props {
  stages: StageObject[];
  activeStageId: StagesEnum;
  setFormValues: React.Dispatch<React.SetStateAction<ValuesType | undefined>>;
}

const FormStages = ({ stages, activeStageId, setFormValues }: Props) => {
  const {
    values,
    handleSubmit,
    validateForm,
    setTouched,
    errors: formikErr,
    resetForm,
  } = useFormikContext<ValuesType>() || {};

  const openDeleteDraftDialog = useDialog(DeleteDraftIncorporationDialog);

  const formikErrors = useMemo(() => {
    const errorsFlat = flattenObject(formikErr);
    return Object.keys(errorsFlat);
  }, [formikErr]);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const errorsLength = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));

    return !errorsLength && handleSubmit(values as any);
  }, [handleSubmit, setTouched, validateForm, values]);

  const handleDeleteDraft = () =>
    openDeleteDraftDialog({
      onClick: () => {
        resetForm();
        // add logic to delete the draft from database
        setFormValues(undefined);
      },
    });

  const handleFixButtonClick = useCallback(() => {
    setTouched(
      setNestedObjectValues<FormikTouched<ValuesType>>(formikErr, true),
    );
    if (!formikErrors.length) return;

    const firstError = document.getElementsByName(formikErrors[0])?.[0];

    if (firstError?.tagName.toLowerCase() === 'input') {
      (firstError as HTMLElement).focus();
    } else if (firstError?.tagName.toLowerCase() === 'textarea') {
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

      <Stages
        stages={stages}
        activeStageId={activeStageId}
        buttonAction={handleSaveDraft}
        handleDeleteDraft={handleDeleteDraft}
      />
    </div>
  );
};

FormStages.displayName = displayName;

export default FormStages;
