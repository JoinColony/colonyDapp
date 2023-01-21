import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RouteChildrenProps, useParams } from 'react-router';
import { Formik } from 'formik';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import Stages, { FormStages } from '~dashboard/Incorporation/Stages';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
} from './constants';
import styles from './IncorporationPage.css';

const displayName = 'pages.IncorporationPage';

export type InitialValuesType = typeof initialValues;

type Props = RouteChildrenProps<{ colonyName: string }>;

const IncorporationPage = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStageId, setActiveStageId] = useState(StagesEnum.Draft);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleSubmit = useCallback(() => {
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
        return handleSubmit;
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
  }, [activeStageId, handlePay, handleProceed, handleSubmit]);

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  return (
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
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
