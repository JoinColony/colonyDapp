import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { nanoid } from 'nanoid';
import { RouteChildrenProps, useParams } from 'react-router';
import { Formik } from 'formik';
import { toFinite } from 'lodash';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import LogsSection from '~dashboard/ExpenditurePage/LogsSection';
import { LoggedInUser, useColonyFromNameQuery } from '~data/generated';
import Stages from '~dashboard/ExpenditurePage/Stages';
import TitleDescriptionSection, {
  LockedTitleDescriptionSection,
} from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { getMainClasses } from '~utils/css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { SpinnerLoader } from '~core/Preloaders';
import { Stage } from '~dashboard/ExpenditurePage/Stages/constants';
import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import { useLoggedInUser } from '~data/helpers';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
import { AnyUser } from '~data/index';
import { useDialog } from '~core/Dialog';
import EscrowFundsDialog from '~dashboard/Dialogs/EscrowFundsDialog';
import { initalRecipient } from '~dashboard/ExpenditurePage/Split/constants';
import { initalMilestone } from '~dashboard/ExpenditurePage/Staged/constants';

import ExpenditureForm from './ExpenditureForm';
import { ExpenditureTypes } from './types';
import styles from './ExpenditurePage.css';

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
  userRequiredError: {
    id: 'dashboard.ExpenditurePage.userRequiredError',
    defaultMessage: 'User is required',
  },
  teamRequiredError: {
    id: 'dashboard.ExpenditurePage.teamRequiredError',
    defaultMessage: 'Team is required',
  },
  valueError: {
    id: 'dashboard.ExpenditurePage.completed',
    defaultMessage: 'Value is required',
  },
  amountZeroError: {
    id: 'dashboard.ExpenditurePage.amountZeroError',
    defaultMessage: 'Value must be greater than zero',
  },
  milestoneNameError: {
    id: 'dashboard.ExpenditurePage.milestoneNameError',
    defaultMessage: 'Name is required',
  },
  milestoneAmountError: {
    id: 'dashboard.ExpenditurePage.milestoneAmountError',
    defaultMessage: 'Amount is required',
  },
});

const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
  filteredDomainId: yup
    .string()
    .required(() => <FormattedMessage {...MSG.teamRequiredError} />),
  recipients: yup.array().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Advanced,
    then: yup.array().of(
      yup.object().shape({
        recipient: yup.object().required(),
        value: yup
          .array(
            yup.object().shape({
              amount: yup
                .number()
                .transform((value) => toFinite(value))
                .required(() => MSG.valueError)
                .moreThan(0, () => MSG.amountZeroError),
              tokenAddress: yup.string().required(),
            }),
          )
          .min(1),
      }),
    ),
  }),
  staged: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Staged,
    then: yup.object().shape({
      user: yup.object().required(),
      amount: yup.object().shape({
        value: yup
          .number()
          .transform((value) => toFinite(value))
          .required(() => MSG.milestoneAmountError)
          .moreThan(0, () => MSG.amountZeroError),
        tokenAddress: yup.string().required(),
      }),
      milestones: yup
        .array(
          yup.object().shape({
            name: yup.string().required(() => MSG.milestoneNameError),
            percent: yup
              .number()
              .moreThan(0, () => MSG.amountZeroError)
              .required(),
            amount: yup.number(),
          }),
        )
        .min(1)
        .required(),
    }),
  }),
  title: yup.string().min(3).required(),
  description: yup.string().max(4000),
  split: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Split,
    then: yup.object().shape({
      unequal: yup.boolean().required(),
      amount: yup.object().shape({
        value: yup
          .number()
          .transform((value) => toFinite(value))
          .required(() => MSG.valueError)
          .moreThan(0, () => MSG.amountZeroError),
        tokenAddress: yup.string().required(),
      }),
      recipients: yup
        .array()
        .of(
          yup
            .object()
            .shape({
              user: yup.object().required(),
              amount: yup.number().required(),
            })
            .required(),
        )
        .min(2),
    }),
  }),
});

export interface State {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
  buttonTooltip?: string | MessageDescriptor;
}

export interface ValuesType {
  expenditure: string;
  filteredDomainId: string;
  owner?: Pick<
    LoggedInUser,
    'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'
  >;
  recipients?: Recipient[];
  title?: string;
  description?: string;
  staged?: {
    user?: AnyUser;
    amount?: { value?: string; tokenAddress?: string };
    milestones?: {
      id: string;
      name?: string;
      amount?: number;
    }[];
  };
  split?: {
    unequal: boolean;
    amount?: { value?: string; tokenAddress?: string };
    recipients?: { user?: AnyUser; amount?: number; percent?: number }[];
  };
}

const initialValues = {
  expenditure: 'advanced',
  recipients: [newRecipient],
  filteredDomainId: String(ROOT_DOMAIN_ID),
  owner: undefined,
  title: undefined,
  description: undefined,
  staged: {
    milestones: [{ ...initalMilestone, id: nanoid() }],
  },
  split: {
    unequal: true,
    recipients: [
      { ...initalRecipient, key: nanoid(), amount: 0 },
      { ...initalRecipient, key: nanoid(), amount: 0 },
    ],
  },
};

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
  const [activeStateId, setActiveStateId] = useState<string>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });
  const loggedInUser = useLoggedInUser();

  const initialValuesData = useMemo((): ValuesType => {
    return (
      formValues || {
        ...initialValues,
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
            tokenAddress: colonyData?.processedColony.nativeTokenAddress,
          },
        },
        staged: {
          ...initialValues.staged,
          amount: {
            tokenAddress: colonyData?.processedColony.nativeTokenAddress,
          },
        },
      }
    );
  }, [colonyData, formValues, loggedInUser]);

  const handleSubmit = useCallback((values: ValuesType) => {
    setActiveStateId(Stage.Draft);
    // setShouldValidate(true);

    if (values) {
      setFormValues(values);
    }
    // add sending form values to backend
  }, []);

  const lockValues = useCallback(() => {
    setFormEditable(false);
  }, []);

  const handleLockExpenditure = () => {
    // Call to backend will be added here, to lock the expenditure
    // fetching active state shoud be added here as well,
    // and saving the activeState in a state
    setActiveStateId(Stage.Locked);
    lockValues();
  };

  const openEscrowFundsDialog = useDialog(EscrowFundsDialog);

  const handleFundExpenditure = useCallback(
    () =>
      colonyData &&
      openEscrowFundsDialog({
        colony: colonyData?.processedColony,
        handleSubmitClick: () => {
          setActiveStateId?.(Stage.Funded);
          // add call to backend
        },
        isVotingExtensionEnabled: true, // temporary value
      }),
    [colonyData, openEscrowFundsDialog],
  );

  const handleReleaseFounds = () => {
    // Call to backend will be added here, to realese founds
    setActiveStateId(Stage.Released);
  };

  const handleClaimExpenditure = () => {
    // Call to backend will be added here, to claim the expenditure
    setActiveStateId(Stage.Claimed);
  };

  const states = [
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

  const { expenditure, filteredDomainId } = formValues || {};

  return isFormEditable ? (
    <Formik
      initialValues={initialValuesData}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      enableReinitialize
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar} ref={sidebarRef}>
          {loading ? (
            <SpinnerLoader appearance={{ size: 'medium' }} />
          ) : (
            colonyData && (
              <ExpenditureForm
                sidebarRef={sidebarRef.current}
                colony={colonyData.processedColony}
              />
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
            <Stages
              {...{
                states,
                activeStateId,
                setActiveStateId,
                lockValues,
                handleSubmit,
                setShouldValidate,
              }}
            />
          </main>
        </div>
      </div>
    </Formik>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} ref={sidebarRef}>
        <LockedExpenditureSettings
          {...{ expenditure, filteredDomainId }}
          username={loggedInUser?.username || ''}
          walletAddress={loggedInUser?.walletAddress}
          colony={colonyData?.processedColony}
        />
        {formValues?.expenditure === ExpenditureTypes.Advanced && (
          <LockedPayments
            recipients={formValues?.recipients}
            colony={colonyData?.processedColony}
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
          <Stages
            {...{
              states,
              activeStateId,
              setActiveStateId,
              lockValues,
              handleSubmit,
              setShouldValidate,
            }}
          />
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
