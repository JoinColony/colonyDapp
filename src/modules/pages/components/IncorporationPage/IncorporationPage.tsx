import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Formik, FormikErrors } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import IncorporationForm from '~dashboard/Incorporation/IncorporationForm';
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
import { useLoggedInUser } from '~data/helpers';
import VerificationBanner from '~dashboard/Incorporation/VerificationBanner';
import IncorporationPaymentDialog from '~dashboard/Dialogs/IncorporationPaymentDialog';
import Stages, { FormStages } from '~dashboard/ExpenditurePage/Stages';

import {
  initialValues,
  stages,
  validationSchema,
  Stages as StagesEnum,
  formValuesMock,
  userMock,
  ownerMock,
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
  const [activeStageId, setActiveStageId] = useState(StagesEnum.Created);
  const [inEditMode, setInEditMode] = useState(false);
  const oldValues = useRef<ValuesType>();
  const sidebarRef = useRef<HTMLElement>(null);

  const notVerified = true; // temporary valule

  const openPayDialog = useDialog(IncorporationPaymentDialog);
  const [, setMotion] = useState<Motion>();

  const openEditIncorporationDialog = useDialog(EditIncorporationDialog);

  const { walletAddress } = useLoggedInUser();

  const isOwner = useMemo(
    () => formValues?.owner?.walletAddress === walletAddress,
    [formValues, walletAddress],
  );

  const handleSubmit = useCallback((values) => {
    // we temporarily store the mock owner in the formValues
    setFormValues({ ...values, owner: ownerMock });
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

  const handleConfirmEition = useCallback(
    (confirmedValues: Partial<ValuesType> | undefined, isForced: boolean) => {
      setInEditMode(false);
      setFormEditable(false);

      const data = updateValues(formValues, confirmedValues);

      if (isOwner) {
        setFormValues(data);
        return;
      }

      if (isForced) {
        // call to backend to set new values goes here, setting state is temorary
        setFormValues(data);
      } else {
        setMotion({ type: MotionType.Edit, status: MotionStatus.Pending });
        // setTimeout is temporary, it should be replaced with call to api
        setTimeout(() => {
          setMotion({ type: MotionType.Edit, status: MotionStatus.Passed });
          setFormValues(data);
        }, 3000);
      }
    },
    [formValues, isOwner],
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
          isOwner,
        })
      );
    },
    [
      colonyData,
      handleConfirmEition,
      handleEditCancel,
      isOwner,
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
                  {inEditMode && !isOwner && (
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
                  handleEditCancel={handleEditCancel}
                />
              ) : (
                colonyData && (
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
                )
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
      <div
        className={classNames(styles.mainContainer, {
          [styles.smallerPadding]:
            notVerified && activeStageId === StagesEnum.Created,
        })}
      >
        {/* user passed to VerifiactionBanner is a mock */}
        {notVerified && activeStageId === StagesEnum.Created && (
          <VerificationBanner user={userMock} />
        )}
        <main className={styles.mainContent}>
          <div className={styles.titleCommentsContainer}>
            <FormattedMessage {...MSG.title} />
          </div>
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
