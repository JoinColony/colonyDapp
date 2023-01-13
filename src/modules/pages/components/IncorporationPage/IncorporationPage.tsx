import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Formik } from 'formik';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import Stages, { FormStages } from '~dashboard/Incorporation/Stages';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
import LockedIncorporationForm from '~dashboard/Incorporation/IncorporationForm/LockedIncorporationForm';
import { useDialog } from '~core/Dialog';
import IncorporationPaymentDialog from '~dashboard/Dialogs/IncorporationPaymentDialog';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
  formValuesMock,
} from './constants';
import { ValuesType } from './types';
import styles from './IncorporationPage.css';

const displayName = 'pages.IncorporationPage';

export type InitialValuesType = typeof initialValues;

const IncorporationPage = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });
  const [isFormEditable, setFormEditable] = useState(false);
  const [formValues, setFormValues] = useState<ValuesType>(formValuesMock);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStageId, setActiveStageId] = useState(StagesEnum.Payment);
  const sidebarRef = useRef<HTMLElement>(null);

  const openPayDialog = useDialog(IncorporationPaymentDialog);

  const handleSubmit = useCallback((values) => {
    setFormValues(values);
    setFormEditable(false);
    setActiveStageId(StagesEnum.Created);
  }, []);

  const handleProceed = useCallback(() => {
    setActiveStageId(StagesEnum.Payment);
  }, []);

  const handlePay = useCallback(() => {
    if (!colonyData) return;

    openPayDialog({
      onClick: () => {
        // add a logic to pay for incorporation
        setActiveStageId(StagesEnum.Processing);
      },
      isVotingExtensionEnabled: true,
      colony: colonyData.processedColony,
    });
  }, [colonyData, openPayDialog]);

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

  return isFormEditable ? (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      {() => (
        <div className={getMainClasses({}, styles)}>
          <aside className={styles.sidebar} ref={sidebarRef}>
            {loading ? (
              <div className={styles.spinnerContainer}>
                <SpinnerLoader appearance={{ size: 'medium' }} />
              </div>
            ) : (
              colonyData && (
                <IncorporationForm
                  sidebarRef={sidebarRef.current}
                  colony={colonyData.processedColony}
                />
              )
            )}
          </aside>
          <div className={styles.mainContainer}>
            <main className={styles.mainContent}>
              <div />
              {activeStageId === StagesEnum.Draft ? (
                <FormStages activeStageId={activeStageId} stages={stages} />
              ) : (
                <Stages
                  activeStageId={activeStageId}
                  stages={stages}
                  buttonAction={buttonAction}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <div className={getMainClasses({}, styles)} id="expenditurePage">
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
              activeStageId={activeStageId}
            />
          )
        )}
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <div />
          <Stages
            activeStageId={activeStageId}
            stages={stages}
            buttonAction={buttonAction}
          />
        </main>
      </div>
    </div>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
