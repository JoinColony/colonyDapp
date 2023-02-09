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
import IncorporationPaymentDialog from '~dashboard/Dialogs/IncorporationPaymentDialog';
import { useDialog } from '~core/Dialog';
import { useLoggedInUser } from '~data/helpers';
import { VerificationStatus } from '~dashboard/Incorporation/IncorporationForm/constants';

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

  const user = useLoggedInUser();

  const isNominated = useMemo(
    () =>
      user.walletAddress &&
      formValues?.protectors?.find(
        (protector) =>
          user.walletAddress === protector?.user?.profile?.walletAddress,
      ),
    [formValues, user],
  );

  const isNominated = useMemo(
    () =>
      user.walletAddress &&
      formValues?.protectors?.find(
        (protector) =>
          user.walletAddress === protector?.user?.profile?.walletAddress,
      ),
    [formValues, user],
  );

  // mock data, add here fetching verification status from backend
  const verificationStatuses = useMemo(
    () =>
      formValues?.protectors?.map((protector) => {
        return {
          id: protector.user?.id,
          walletAddress: protector.user?.profile?.walletAddress,
          verified: VerificationStatus.Verified,
        };
      }),
    [formValues],
  );

  // Mock data
  const isOwner = false;
  const hasPermissions = isNominated || isOwner;

  const isVerified = useMemo(() => {
    const verificationStatus = verificationStatuses?.find(
      (protector) => protector.walletAddress === user.walletAddress,
    );
    return verificationStatus?.verified;
  }, [user.walletAddress, verificationStatuses]);

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
        return hasPermissions ? handlePay : undefined;
      }
      default: {
        return () => {};
      }
    }
  }, [activeStageId, handlePay, handleProceed, hasPermissions]);

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

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
                  handleCancelExpenditure={() => {}}
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
              verificationStatuses={verificationStatuses}
            />
          )
        )}
      </aside>
      <div
        className={classNames(styles.mainContainer, {
          [styles.smallerPadding]: isNominated && !isVerified,
        })}
      >
        {isNominated && isVerified === VerificationStatus.Unverified && (
          <VerificationBanner user={user} />
        )}
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
            />
          )}
        </main>
      </div>
    </div>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
