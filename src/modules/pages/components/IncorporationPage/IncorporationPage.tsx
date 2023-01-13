import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Formik } from 'formik';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
import Stages, { FormStages } from '~dashboard/ExpenditurePage/Stages';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
} from './constants';
import { ValuesType } from './types';
import styles from './IncorporationPage.css';
import LockedIncorporationForm from '~dashboard/DAOIncorporation/IncorporationForm/LockedIncorporationForm';

const displayName = 'pages.IncorporationPage';

export type InitialValuesType = typeof initialValues;

const IncorporationPage = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const [isFormEditable, setFormEditable] = useState(true);
  const [formValues, setFormValues] = useState<ValuesType>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStageId, setActiveStageId] = useState(StagesEnum.Draft);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleSubmit = useCallback((values) => {
    setFormValues(values);
    setFormEditable(false);
    setActiveStageId(StagesEnum.Created);
  }, []);

  const handleProceed = useCallback(() => {
    setActiveStageId(StagesEnum.Payment);
  }, []);

  const handlePay = useCallback(() => {
    setActiveStageId(StagesEnum.Processing);
  }, []);

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

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

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
              {colonyData && (
                <>
                  {activeStageId === StagesEnum.Draft ? (
                    <FormStages
                      activeStageId={activeStageId}
                      stages={stages.map((stage) => ({
                        ...stage,
                        id: stage.id.toString(),
                        label: stage.title,
                        buttonAction,
                      }))}
                      setActiveStageId={setActiveStageId}
                      colony={colonyData.processedColony}
                      setFormValues={setFormValues}
                      handleCancelExpenditure={() => {}}
                    />
                  ) : (
                    <Stages
                      activeStageId={activeStageId}
                      stages={stages.map((stage) => ({
                        ...stage,
                        id: stage.id.toString(),
                        label: stage.title,
                        buttonAction,
                      }))}
                      appearance={{ size: 'medium' }}
                      handleButtonClick={buttonAction}
                      handleSaveDraft={handleSubmit}
                      colony={colonyData?.processedColony}
                      viewFor="incorporation"
                    />
                  )}
                </>
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
          formValues && <LockedIncorporationForm formValues={formValues} />
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
