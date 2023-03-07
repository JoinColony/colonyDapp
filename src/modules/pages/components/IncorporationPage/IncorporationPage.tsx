import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Formik } from 'formik';
import classNames from 'classnames';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
import Stages, { FormStages } from '~dashboard/ExpenditurePage/Stages';
import LockedIncorporationForm from '~dashboard/Incorporation/IncorporationForm/LockedIncorporationForm';
import VerificationBanner from '~dashboard/Incorporation/VerificationBanner';
import {
  Motion,
  MotionStatus,
  MotionType,
  Status,
} from '~dashboard/ExpenditurePage/Stages/constants';
import { useDialog } from '~core/Dialog';
import CancelIncorporationDialog from '~dashboard/Dialogs/CancelIncorporationDialog';
import IncorporationPaymentDialog from '~dashboard/Dialogs/IncorporationPaymentDialog';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
  formValuesMock,
  userMock,
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
  const openCancelIncorporationDialog = useDialog(CancelIncorporationDialog);
  const [, setMotion] = useState<Motion>();
  const [, setStatus] = useState<Status>();

  const notVerified = true; // temporary valule

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

  const handleCancel = (isForce: boolean) => {
    if (isForce) {
      // temporary action
      setStatus(Status.ForceCancelled);
    } else {
      // setTimeout is temporary, call to backend should be added here
      setMotion({
        type: MotionType.Cancel,
        status: MotionStatus.Pending,
      });
      setTimeout(() => {
        setStatus(Status.Cancelled);
        setMotion({
          type: MotionType.Cancel,
          status: MotionStatus.Passed,
        });
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

  return isFormEditable ? (
    <Formik
      initialValues={initialValues} // mock values are used here to fill in the form
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
                  handleCancel={handleCancelIncorporation}
                />
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
              activeStageId={activeStageId}
            />
          )
        )}
      </aside>
      <div
        className={classNames(styles.mainContainer, {
          [styles.smallerPadding]: notVerified,
        })}
      >
        {/* user passed to VerifiactionBanner is a mock */}
        {notVerified && <VerificationBanner user={userMock} />}
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
              handleButtonClick={buttonAction || (() => {})}
              colony={colonyData?.processedColony}
              viewFor="incorporation"
              handleCancel={handleCancelIncorporation}
            />
          )}
        </main>
      </div>
    </div>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
