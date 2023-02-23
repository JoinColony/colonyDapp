import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Formik } from 'formik';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
import Stages from '~dashboard/ExpenditurePage/Stages';

import { initialValues, stages, Stages as StagesEnum } from './constants';
import styles from './IncorporationPage.css';

const displayName = 'pages.IncorporationPage';

export type InitialValuesType = typeof initialValues;

const IncorporationPage = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
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

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
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
            </main>
          </div>
        </div>
      )}
    </Formik>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
