import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import { RouteChildrenProps, useParams } from 'react-router';
import { Formik, FormikErrors } from 'formik';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import LogsSection from '~dashboard/ExpenditurePage/LogsSection';
import { useColonyFromNameQuery } from '~data/generated';
import { FormStages, LockedStages } from '~dashboard/ExpenditurePage/Stages';
import TitleDescriptionSection, {
  LockedTitleDescriptionSection,
} from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { getMainClasses } from '~utils/css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import {
  Motion,
  MotionStatus,
  MotionType,
  Stage,
  Status,
} from '~dashboard/ExpenditurePage/Stages/constants';
import { SpinnerLoader } from '~core/Preloaders';
import { useLoggedInUser } from '~data/helpers';
import { useDialog } from '~core/Dialog';
import EscrowFundsDialog from '~dashboard/Dialogs/EscrowFundsDialog';
import EditExpenditureDialog from '~dashboard/Dialogs/EditExpenditureDialog';
import EditButtons from '~dashboard/ExpenditurePage/EditButtons/EditButtons';
import Tag from '~core/Tag';
import CancelExpenditureDialog from '~dashboard/Dialogs/CancelExpenditureDialog';
import { newFundingSource } from '~dashboard/ExpenditurePage/Streaming/constants';
import { LOCAL_STORAGE_EXPENDITURE_TYPE_KEY } from '~constants';

import {
  findDifferences,
  updateValues,
  setClaimDate,
  isExpenditureType,
} from './utils';
import { ExpenditureTypes, ValuesType } from './types';
import LockedSidebar from './LockedSidebar';
import { initialValues, validationSchema } from './constants';
import ExpenditureForm from './ExpenditureForm';
import styles from './ExpenditurePage.css';
import { newFundingSource } from '~dashboard/ExpenditurePage/ExpenditureSettings/Streaming/constants';

const displayName = 'pages.ExpenditurePage';

const MSG = defineMessages({
  lockValues: {
    id: 'dashboard.ExpenditurePage.lockValues',
    defaultMessage: 'Lock values',
  },
  escrowFunds: {
    id: 'dashboard.ExpenditurePage.escrowFunds',
    defaultMessage: 'Escrow funds',
  },
  releaseFunds: {
    id: 'dashboard.ExpenditurePage.releaseFunds',
    defaultMessage: 'Release funds',
  },
  claim: {
    id: 'dashboard.ExpenditurePage.claim',
    defaultMessage: 'Claim',
  },
  draft: {
    id: 'dashboard.ExpenditurePage.draft',
    defaultMessage: 'Draft',
  },
  locked: {
    id: 'dashboard.ExpenditurePage.locked',
    defaultMessage: 'Locked',
  },
  funded: {
    id: 'dashboard.ExpenditurePage.funded',
    defaultMessage: 'Funded',
  },
  released: {
    id: 'dashboard.ExpenditurePage.released',
    defaultMessage: 'Released',
  },
  claimed: {
    id: 'dashboard.ExpenditurePage.claimed',
    defaultMessage: 'Claimed',
  },
  tooltipLockValuesText: {
    id: 'dashboard.ExpenditurePage.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
  completed: {
    id: 'dashboard.ExpenditurePage.completed',
    defaultMessage: 'Completed',
  },
  suggestions: {
    id: 'dashboard.ExpenditurePage.suggestions',
    defaultMessage: 'You are making suggestions ',
  },
  activeMotion: {
    id: 'dashboard.ExpenditurePage.activeMotion',
    defaultMessage: 'There is an active motion for this expenditure',
  },
});

export type InitialValuesType = typeof initialValues;

type Props = RouteChildrenProps<{ colonyName: string }>;

const ExpenditurePage = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const [isFormEditable, setFormEditable] = useState(true);
  const [formValues, setFormValues] = useState<ValuesType>();
  const [activeStageId, setActiveStageId] = useState<string>();
  const [status, setStatus] = useState<Status>();
  const [motion, setMotion] = useState<Motion>();
  const [inEditMode, setInEditMode] = useState(false);
  const [shouldValidate, setShouldValidate] = useState(false);
  const oldValues = useRef<ValuesType>();
  const [pendingChanges, setPendingChanges] = useState<
    Partial<ValuesType> | undefined
  >();
  const sidebarRef = useRef<HTMLElement>(null);

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  const openEditExpenditureDialog = useDialog(EditExpenditureDialog);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });
  const loggedInUser = useLoggedInUser();

  const initialValuesData = useMemo((): ValuesType => {
    const savedExpenditureType = localStorage.getItem(
      LOCAL_STORAGE_EXPENDITURE_TYPE_KEY,
    );
    const initialExpenditureType = isExpenditureType(savedExpenditureType)
      ? savedExpenditureType
      : ExpenditureTypes.Advanced;

    return (
      formValues || {
        ...initialValues,
        expenditure: initialExpenditureType,
        owner: loggedInUser,
        recipients: [
          {
            ...newRecipient,
            id: nanoid(),
            value: [
              {
                id: nanoid(),
                amount: undefined,
                tokenAddress: colonyData?.processedColony?.nativeTokenAddress,
              },
            ],
          },
        ],
        split: {
          ...initialValues.split,
          amount: {
            tokenAddress: colonyData?.processedColony?.nativeTokenAddress,
          },
        },
        staged: {
          ...initialValues.staged,
          amount: {
            tokenAddress: colonyData?.processedColony?.nativeTokenAddress,
          },
        },
        streaming: {
          ...initialValues.streaming,
          fundingSources: [
            {
              ...newFundingSource,
              rates: [
                {
                  ...newFundingSource.rates[0],
                  token: colonyData?.processedColony.nativeTokenAddress,
                },
              ],
            },
          ],
        },
      }
    );
  }, [colonyData, formValues, loggedInUser]);

  const lockValues = useCallback(() => {
    setFormEditable(false);
    localStorage.removeItem(LOCAL_STORAGE_EXPENDITURE_TYPE_KEY);
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      setShouldValidate(true);
      if (!activeStageId) {
        setActiveStageId(Stage.Draft);
      }

      if (values.expenditure === ExpenditureTypes.Streaming) {
        lockValues();
        setMotion({
          type: MotionType.StartStream,
          status: MotionStatus.Pending,
        });
        setFormValues(values);

        // it's temporary timeout
        setTimeout(() => {
          setMotion({
            type: MotionType.StartStream,
            status: MotionStatus.Failed,
          });
        }, 5000);

        return;
      }

      if (values) {
        setFormValues({
          ...values,
          recipients: values.recipients?.map((reicpient) => {
            return {
              ...reicpient,
              claimDate: reicpient.delay?.amount
                ? setClaimDate({
                    amount: reicpient.delay?.amount,
                    time: reicpient.delay?.time,
                  })
                : new Date().getTime(),
            };
          }),
        });
      }
      // add sending form values to backend
    },
    [activeStageId, lockValues],
  );

  const handleLockExpenditure = useCallback(() => {
    // Call to backend will be added here, to lock the expenditure
    // fetching active state shoud be added here as well,
    // and saving the activeStage in a state
    setActiveStageId(Stage.Locked);
    lockValues();
  }, [lockValues]);

  const openEscrowFundsDialog = useDialog(EscrowFundsDialog);
  const openCancelExpenditureDialog = useDialog(CancelExpenditureDialog);

  const handleFundExpenditure = useCallback(
    () =>
      colonyData &&
      openEscrowFundsDialog({
        colony: colonyData?.processedColony,
        handleSubmitClick: () => {
          setActiveStageId?.(Stage.Funded);
          // add call to backend
        },
        isVotingExtensionEnabled: true, // temporary value
      }),
    [colonyData, openEscrowFundsDialog],
  );

  const handleReleaseFounds = () => {
    // Call to backend will be added here, to realese founds
    setActiveStageId(Stage.Released);
  };

  const handleClaimExpenditure = useCallback(() => {
    // Call to backend will be added here, to claim the expenditure
    if (!formValues) {
      return;
    }

    // If it's not 'Advanced' payment type, change te stage to claimed - mock function
    if (formValues.expenditure !== ExpenditureTypes.Advanced) {
      setActiveStageId(Stage.Claimed);
      return;
    }

    // if the claim date has passed and the amount hasn't been claimed yet it should be claimed now,
    // so we set claimed property to true
    const updatedFormValues = {
      ...{
        ...formValues,
        recipients: formValues?.recipients?.map((recipient) => {
          if (!recipient.claimed && recipient.claimDate) {
            const isClaimable = recipient.claimDate < new Date().getTime();
            return { ...{ ...recipient, claimed: !!isClaimable } };
          }
          return recipient;
        }),
      },
    };

    const isClaimed = updatedFormValues?.recipients?.every(
      (recipient) => recipient.claimed,
    );

    if (isClaimed) {
      setActiveStageId(Stage.Claimed);
    }

    setFormValues(updatedFormValues);
  }, [formValues]);

  useEffect(() => {
    const allReleased = formValues?.staged?.milestones?.every(
      (milestone) => milestone.released,
    );

    if (allReleased) {
      setActiveStageId(Stage.Released);
    }
  }, [formValues]);

  const handleReleaseMilestone = useCallback((id: string) => {
    setFormValues((stateValues) => {
      const newValues = {
        ...{
          ...stateValues,
          expenditure: stateValues?.expenditure || ExpenditureTypes.Staged,
          filteredDomainId:
            stateValues?.filteredDomainId || String(ROOT_DOMAIN_ID),
          staged: {
            ...stateValues?.staged,
            milestones: stateValues?.staged?.milestones?.map((milestone) => {
              if (milestone.id === id) {
                return { ...milestone, released: true };
              }
              return milestone;
            }),
          },
        },
      };
      return newValues;
    });
  }, []);

  useEffect(() => {
    const allReleased = formValues?.staged?.milestones?.every(
      (milestone) => milestone.released,
    );

    if (allReleased) {
      setActiveStageId(Stage.Released);
    }
  }, [formValues]);

  const stages = [
    {
      id: Stage.Draft,
      label: MSG.draft,
      buttonText: MSG.lockValues,
      buttonAction: handleLockExpenditure,
      buttonTooltip: MSG.tooltipLockValuesText,
    },
    {
      id: Stage.Locked,
      label: MSG.locked,
      buttonText: MSG.escrowFunds,
      buttonAction: handleFundExpenditure,
    },
    {
      id: Stage.Funded,
      label: MSG.funded,
      buttonText: MSG.releaseFunds,
      buttonAction: handleReleaseFounds,
    },
    {
      id: Stage.Released,
      label: MSG.released,
      buttonText: MSG.claim,
      buttonAction: handleClaimExpenditure,
    },
    {
      id: Stage.Claimed,
      label: MSG.claimed,
      buttonText: MSG.completed,
      buttonAction: () => {},
    },
  ];

  const handleCancelExpenditure = () =>
    colonyData &&
    openCancelExpenditureDialog({
      onCancelExpenditure: (isForce: boolean) => {
        if (isForce) {
          // temporary action
          setStatus(Status.ForceCancelled);
        } else {
          // setTimeout is temporary, call to backend should be added here
          setMotion({ type: MotionType.Cancel, status: MotionStatus.Pending });
          setTimeout(() => {
            setStatus(Status.Cancelled);
            setMotion({ type: MotionType.Cancel, status: MotionStatus.Passed });
          }, 5000);
        }
      },
      colony: colonyData.processedColony,
      isVotingExtensionEnabled: true, // temporary value
    });

  const handleConfirmEition = useCallback(
    (confirmedValues: Partial<ValuesType> | undefined, isForced: boolean) => {
      setInEditMode(false);
      setFormEditable(false);

      if (isForced) {
        setStatus(Status.ForceEdited);
        const data = updateValues(formValues, confirmedValues);
        // call to backend to set new values goes here, setting state is temorary
        setFormValues(data);
      } else {
        setPendingChanges(confirmedValues);
        setMotion({ type: MotionType.Edit, status: MotionStatus.Pending });
        setStatus(Status.Edited);
        // setTimeout is temporary, it should be replaced with call to api
        setTimeout(() => {
          const data = updateValues(formValues, confirmedValues);
          setPendingChanges(undefined);
          setFormValues(data);
          setStatus(undefined);
          setMotion({ type: MotionType.Edit, status: MotionStatus.Passed });
        }, 5000);
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
        openEditExpenditureDialog({
          onSubmitClick: handleConfirmEition,
          isVotingExtensionEnabled: true,
          colony: colonyData?.processedColony,
          newValues: differentValues,
          oldValues: oldValues.current,
        })
      );
    },
    [colonyData, handleConfirmEition, openEditExpenditureDialog],
  );

  return isFormEditable ? (
    <Formik
      initialValues={initialValuesData}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
      enableReinitialize
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
                      <Tag
                        appearance={{
                          theme: 'blue',
                        }}
                      >
                        <FormattedMessage {...MSG.suggestions} />
                      </Tag>
                    </div>
                  )}
                  <ExpenditureForm
                    sidebarRef={sidebarRef.current}
                    colony={colonyData.processedColony}
                    setShouldValidate={setShouldValidate}
                    inEditMode={inEditMode}
                  />
                </>
              )
            )}
          </aside>
          <div className={styles.mainContainer}>
            <main className={styles.mainContent}>
              <div className={styles.titleCommentsContainer}>
                <TitleDescriptionSection />
                {loading ? (
                  <div className={styles.spinnerContainer}>
                    <SpinnerLoader appearance={{ size: 'medium' }} />
                  </div>
                ) : (
                  <LogsSection colony={colonyData?.processedColony} />
                )}
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
                    stages={stages}
                    activeStageId={activeStageId}
                    setActiveStateId={setActiveStageId}
                    setFormValues={setFormValues}
                    handleCancelExpenditure={handleCancelExpenditure}
                    colony={colonyData.processedColony}
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
        {colonyData && (
          <LockedSidebar
            colony={colonyData?.processedColony}
            formValues={formValues}
            editForm={handleEditLockedForm}
            pendingChanges={pendingChanges}
            status={status}
            isCancelled={status === Status.Cancelled}
            pendingMotion={motion?.status === MotionStatus.Pending}
            activeStage={stages.find((stage) => stage.id === activeStageId)}
            handleReleaseMilestone={handleReleaseMilestone}
          />
        )}
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <div className={styles.titleCommentsContainer}>
            <LockedTitleDescriptionSection
              title={formValues?.title}
              description={formValues?.description}
            />
            {loading ? (
              <div className={styles.spinnerContainer}>
                <SpinnerLoader appearance={{ size: 'medium' }} />
              </div>
            ) : (
              <LogsSection colony={colonyData?.processedColony} />
            )}
          </div>
          {colonyData && (
            <LockedStages
              formValues={formValues}
              status={status}
              motion={motion}
              stages={stages}
              activeStageId={activeStageId}
              setActiveStageId={setActiveStageId}
              handleCancelExpenditure={handleCancelExpenditure}
              colony={colonyData.processedColony}
              expenditureType={formValues?.expenditure}
            />
          )}
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
