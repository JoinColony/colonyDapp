import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RouteChildrenProps, useParams, useHistory } from 'react-router';
import { Formik, FormikErrors } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import Stages, { FormStages } from '~dashboard/Incorporation/Stages';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
import LockedIncorporationForm from '~dashboard/Incorporation/IncorporationForm/LockedIncorporationForm';
import { useDialog } from '~core/Dialog';
import IncorporationPaymentDialog from '~dashboard/Dialogs/IncorporationPaymentDialog';
import Stages, { FormStages } from '~dashboard/Incorporation/Stages';
import LockedIncorporationForm from '~dashboard/Incorporation/IncorporationForm/LockedIncorporationForm';
import { useDialog } from '~core/Dialog';
import EditButtons from '~dashboard/ExpenditurePage/EditButtons/EditButtons';
import EditIncorporationDialog from '~dashboard/Dialogs/EditIncorporationDialog';
import Tag from '~core/Tag';
import {
  MotionStatus,
  MotionType,
} from '~dashboard/ExpenditurePage/Stages/constants';
import { Motion } from '~pages/ExpenditurePage/types';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
  formValuesMock,
} from './constants';
import { findDifferences, updateValues } from './utils';
import { ValuesType } from './types';
import styles from './IncorporationPage.css';

const MSG = defineMessages({
  editMode: {
    id: 'pages.IncorporationPage.editMode',
    defaultMessage: `Edit mode. Changes require motion to pass.`,
  },
  title: {
    id: 'pages.IncorporationPage.editMode',
    defaultMessage: 'Incorporate this DAO',
  },
});

const displayName = 'pages.IncorporationPage';

const IncorporationPage = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });
  const history = useHistory();
  const [isFormEditable, setFormEditable] = useState(false);
  const [formValues, setFormValues] = useState<ValuesType>(formValuesMock);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStageId, setActiveStageId] = useState(StagesEnum.Draft);
  const [inEditMode, setInEditMode] = useState(false);
  const oldValues = useRef<ValuesType>();
  const sidebarRef = useRef<HTMLElement>(null);

  const openPayDialog = useDialog(IncorporationPaymentDialog);
  const [motion, setMotion] = useState<Motion>();

  const openEditIncorporationDialog = useDialog(EditIncorporationDialog);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const handleSubmit = useCallback((values) => {
    setFormValues(values);
    setFormEditable(false);
    setActiveStageId(StagesEnum.Created);
  }, []);

  const handleProceed = useCallback(() => {
    setActiveStageId(StagesEnum.Payment);
  }, []);

  const handleConfirmPayment = useCallback(() => {
    // Redirection to the Actions page is a mock action.
    const txHash = 'DAOIncorporation';
    history.push(`/colony/${colonyName}/tx/${txHash}`);
    setActiveStageId(StagesEnum.Processing);
  }, [colonyName, history]);

  const handlePay = useCallback(() => {
    if (!colonyData) return;

    openPayDialog({
      onClick: handleConfirmPayment,
      isVotingExtensionEnabled: true,
      colony: colonyData.processedColony,
    });
  }, [colonyData, openPayDialog, handleConfirmPayment]);

  const buttonAction = useMemo(() => {
    switch (activeStageId) {
      case StagesEnum.Draft: {
        return undefined;
      }
      case StagesEnum.Created: {
        return handleProceed;
      }
      case StagesEnum.Payment: {
        return handlePay;
      }
      default: {
        return () => {};
      }
    }
  }, [activeStageId, handlePay, handleProceed]);

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  const handleConfirmEition = useCallback(
    (confirmedValues: Partial<ValuesType> | undefined, isForced: boolean) => {
      setInEditMode(false);
      setFormEditable(false);

      if (isForced) {
        const data = updateValues(formValues, confirmedValues);
        // call to backend to set new values goes here, setting state is temorary
        setFormValues(data);
      } else {
        setMotion({ type: MotionType.Edit, status: MotionStatus.Pending });
        // setTimeout is temporary, it should be replaced with call to api
        setTimeout(() => {
          const data = updateValues(formValues, confirmedValues);
          setMotion({ type: MotionType.Edit, status: MotionStatus.Passed });
          setFormValues(data);
        }, 3000);
      }
    },
    [formValues],
  );

  const handleEditLockedForm = useCallback(() => {
    setInEditMode(true);
    setFormEditable(true);
    oldValues.current = formValues;
  }, [formValues]);

  const handleEditCancel = useCallback(() => {
    setInEditMode(false);
    setFormEditable(false);
  }, []);

  const handleEditSubmit = useCallback(
    async (
      values: ValuesType,
      validateForm: (values?: ValuesType) => Promise<FormikErrors<ValuesType>>,
    ) => {
      setInEditMode(true);
      setFormEditable(true);
      const errors = await validateForm(values);
      const hasErrors = Object.keys(errors)?.length;

      const differentValues = findDifferences(values, oldValues.current);

      return (
        !hasErrors &&
        colonyData &&
        oldValues.current &&
        openEditIncorporationDialog({
          onSubmitClick: handleConfirmEition,
          onCancelClick: handleEditCancel,
          isVotingExtensionEnabled: true,
          colony: colonyData?.processedColony,
          newValues: differentValues,
          oldValues: oldValues.current,
        })
      );
    },
    [
      colonyData,
      handleConfirmEition,
      handleEditCancel,
      openEditIncorporationDialog,
    ],
  );

  return isFormEditable ? (
    <Formik
      initialValues={formValues || initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      {({ values, validateForm }) => (
        <div className={getMainClasses({}, styles)}>
          <aside className={styles.sidebar} ref={sidebarRef}>
            {loading ? (
              <div className={styles.spinnerContainer}>
                <SpinnerLoader appearance={{ size: 'medium' }} />
              </div>
            ) : (
              colonyData && (
                <>
                  {inEditMode && (
                    <div className={styles.tagWrapper}>
                      <Tag>
                        <FormattedMessage {...MSG.editMode} />
                      </Tag>
                    </div>
                  )}
                  <IncorporationForm
                    sidebarRef={sidebarRef.current}
                    colony={colonyData.processedColony}
                  />
                </>
              )
            )}
          </aside>
          <div className={styles.mainContainer}>
            <main className={styles.mainContent}>
              <div className={styles.titleCommentsContainer}>
                <FormattedMessage {...MSG.title} />
              </div>
              {inEditMode ? (
                <EditButtons
                  handleEditSubmit={() =>
                    handleEditSubmit(values, validateForm)
                  }
                />
              ) : (
                <FormStages activeStageId={activeStageId} stages={stages} />
              )}
            </main>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} ref={sidebarRef}>
        {loading ? (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        ) : (
          colonyData &&
          formValues && (
            <LockedIncorporationForm
              formValues={formValues}
              editForm={handleEditLockedForm}
              activeStageId={activeStageId}
            />
          )
        )}
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <div className={styles.titleCommentsContainer}>
            <FormattedMessage {...MSG.title} />
          </div>
          <Stages
            activeStageId={activeStageId}
            stages={stages}
            buttonAction={buttonAction}
            motion={motion}
          />
        </main>
      </div>
    </div>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
