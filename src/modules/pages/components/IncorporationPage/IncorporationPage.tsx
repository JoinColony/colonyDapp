import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import Stages, { FormStages } from '~dashboard/Incorporation/Stages';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
import LockedIncorporationForm from '~dashboard/Incorporation/IncorporationForm/LockedIncorporationForm';
import CancelIncorporationDialog from '~dashboard/Dialogs/CancelIncorporationDialog';
import { useDialog } from '~core/Dialog';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
  formValuesMock,
  Motion,
  MotionType,
  MotionStatus,
} from './constants';
import { ValuesType } from './types';
import styles from './IncorporationPage.css';

const displayName = 'pages.IncorporationPage';

export type InitialValuesType = typeof initialValues;

const IncorporationPage = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const [isFormEditable, setFormEditable] = useState(false);
  const [formValues, setFormValues] = useState<ValuesType>(formValuesMock);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStageId, setActiveStageId] = useState(StagesEnum.Payment);
  const sidebarRef = useRef<HTMLElement>(null);
  const openCancelIncorporationDialog = useDialog(CancelIncorporationDialog);
  const [motions, setMotions] = useState<Motion[]>([]);

  const handleSubmit = useCallback((values) => {
    setFormValues(values);
    setFormEditable(false);
    setActiveStageId(StagesEnum.Created);
  }, []);

  const handleProceed = useCallback(() => {
    setActiveStageId(StagesEnum.Payment);
  }, []);

  const handlePay = useCallback(() => {
    setMotions((prevState) => [
      ...prevState,
      { status: MotionStatus.Pending, type: MotionType.Payment },
    ]);
    setTimeout(() => {
      // mock
      const passed = Math.floor(Math.random() * 10) > 5;
      setMotions((prevState) =>
        prevState.map((motionItem) => {
          if (
            motionItem.type === MotionType.Payment &&
            motionItem.status === MotionStatus.Pending
          ) {
            return {
              ...motionItem,
              status: passed ? MotionStatus.Passed : MotionStatus.Failed,
            };
          }
          return motionItem;
        }),
      );
      if (passed) {
        setActiveStageId(StagesEnum.Processing);
      }
    }, 5000);
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

  const handleCancel = (isForce: boolean) => {
    if (isForce) {
      // temporary action
      setMotions((prevState) => [
        ...prevState,
        {
          type: MotionType.Cancel,
          status: MotionStatus.Passed,
        },
      ]);
    } else {
      // setTimeout is temporary, call to backend should be added here
      setMotions((prevState) => [
        ...prevState,
        {
          type: MotionType.Cancel,
          status: MotionStatus.Pending,
        },
      ]);
      setTimeout(() => {
        setMotions((prevState) =>
          prevState.map((motionItem) => {
            if (motionItem.type !== MotionType.Cancel) {
              return motionItem;
            }
            return { ...motionItem, status: MotionStatus.Passed };
          }),
        );
      }, 5000);
    }
  };

  const handleCancelIncorporation = useCallback(() => {
    if (!colonyData) {
      return null;
    }

    return (
      colonyData &&
      openCancelIncorporationDialog({
        onCancelIncorporation: (isForce: boolean) => handleCancel(isForce),
        colony: colonyData.processedColony,
        isVotingExtensionEnabled: true, // temporary value
      })
    );
  }, [colonyData, openCancelIncorporationDialog]);

  const pendingMotion = useMemo(
    () =>
      motions?.find((motionItem) => motionItem.status === MotionStatus.Pending),
    [motions],
  );

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
              <FormStages activeStageId={activeStageId} stages={stages} />
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
              activeStageId={activeStageId}
              pendingMotion={!isEmpty(pendingMotion)}
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
            handleCancelIncorporation={handleCancelIncorporation}
            motions={motions}
          />
        </main>
      </div>
    </div>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
