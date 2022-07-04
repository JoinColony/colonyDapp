import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { nanoid } from 'nanoid';

import { RouteChildrenProps, useParams } from 'react-router';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import Stages from '~dashboard/ExpenditurePage/Stages';
import { getMainClasses } from '~utils/css';
import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import TitleDescriptionSection, {
  LockedTitleDescriptionSection,
} from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { Stage } from '~dashboard/ExpenditurePage/Stages/constants';
import { useColonyFromNameQuery } from '~data/generated';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import { setClaimDate } from './utils';
import { SpinnerLoader } from '~core/Preloaders';
import { useLoggedInUser } from '~data/helpers';

const displayName = 'pages.ExpenditurePage';

const MSG = defineMessages({
  lockValues: {
    id: 'dashboard.Expenditures.Stages.lockValues',
    defaultMessage: 'Lock values',
  },
  escrowFunds: {
    id: 'dashboard.Expenditures.Stages.escrowFunds',
    defaultMessage: 'Escrow funds',
  },
  releaseFunds: {
    id: 'dashboard.Expenditures.Stages.releaseFunds',
    defaultMessage: 'Release funds',
  },
  claim: {
    id: 'dashboard.Expenditures.Stages.claim',
    defaultMessage: 'Claim',
  },
  draft: {
    id: 'dashboard.Expenditures.Stages.draft',
    defaultMessage: 'Draft',
  },
  locked: {
    id: 'dashboard.Expenditures.Stages.locked',
    defaultMessage: 'Locked',
  },
  funded: {
    id: 'dashboard.Expenditures.Stages.funded',
    defaultMessage: 'Funded',
  },
  released: {
    id: 'dashboard.Expenditures.Stages.released',
    defaultMessage: 'Released',
  },
  claimed: {
    id: 'dashboard.Expenditures.Stages.claimed',
    defaultMessage: 'Claimed',
  },
  tooltipLockValuesText: {
    id: 'dashboard.Expenditures.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
  completed: {
    id: 'dashboard.Expenditures.Stages.completed',
    defaultMessage: 'Completed',
  },
  valueError: {
    id: 'dashboard.Expenditures.Stages.completed',
    defaultMessage: 'Value is required',
  },
});

const initialValues = {
  expenditure: 'advanced',
  filteredDomainId: String(ROOT_DOMAIN_ID),
  owner: undefined,
  title: undefined,
  description: undefined,
  recipients: [newRecipient],
};

export interface ValuesType {
  expenditure: string;
  filteredDomainId: string;
  owner: string;
  recipients: Recipient[];
  title: string;
  description?: string;
}

export interface State {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
  buttonTooltip?: string | MessageDescriptor;
}

export type InitialValuesType = typeof initialValues;

const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
  filteredDomainId: yup.string().required(),
  recipients: yup.array(
    yup.object().shape({
      recipient: yup.object().required(),
      value: yup
        .array(
          yup.object().shape({
            amount: yup.number().required(() => MSG.valueError),
          }),
        )
        .min(1),
    }),
  ),
  title: yup.string().required(),
});

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditable, setIsEditable] = useState(true);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });
  const loggedInUser = useLoggedInUser();

  const [isFormEditable, setFormEditable] = useState(true);
  const [formValues, setFormValues] = useState<ValuesType>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStateId, setActiveStateId] = useState<string>();
  const sidebarRef = useRef<HTMLElement>(null);

  const initialValuesData = useMemo(() => {
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
                amount: undefined,
                tokenAddress: colonyData?.processedColony?.nativeTokenAddress,
              },
            ],
          },
        ],
      }
    );
  }, [colonyData, formValues, loggedInUser]);

  const handleSubmit = useCallback((values) => {
    setShouldValidate(true);
    setActiveStateId(Stage.Draft);

    if (values) {
      setFormValues({
        ...values,
        recipients: values.recipients.map((reicpient) => ({
          ...reicpient,
          claimDate: setClaimDate({
            amount: reicpient.delay.amount,
            time: reicpient.delay.time,
          }),
        })),
      });
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

  const handleFoundExpenditure = () => {
    // Call to backend will be added here, to found the expenditure
    setActiveStateId(Stage.Funded);
  };

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
      buttonAction: handleFoundExpenditure,
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
  const activeState = states.find((state) => state.id === activeStateId);

  const { expenditure, filteredDomainId } = formValues || {};

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  return isFormEditable ? (
    <Form
      initialValues={initialValuesData}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
      enableReinitialize
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar} ref={sidebarRef}>
          {loading ? (
            <SpinnerLoader appearance={{ size: 'medium' }} />
          ) : (
            colonyData && (
              <>
                <ExpenditureSettings
                  colony={colonyData.processedColony}
                  username={loggedInUser.username || ''}
                  walletAddress={loggedInUser.walletAddress}
                />
                <Payments
                  sidebarRef={sidebarRef.current}
                  colony={colonyData.processedColony}
                />
              </>
            )
          )}
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <TitleDescriptionSection />
            <Stages
              {...{
                states,
                activeStateId,
                setActiveStateId,
                lockValues,
                handleSubmit,
              }}
            />
          </main>
        </div>
      </div>
    </Form>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} ref={sidebarRef}>
        <LockedExpenditureSettings
          {...{ expenditure, filteredDomainId }}
          username={loggedInUser?.username || ''}
          walletAddress={loggedInUser?.walletAddress}
          colony={colonyData?.processedColony}
        />
        <LockedPayments
          recipients={formValues?.recipients}
          activeState={activeState}
          colony={colonyData?.processedColony}
        />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <LockedTitleDescriptionSection
            title={formValues?.title}
            description={formValues?.description}
          />
          {colonyData && (
            <Stages
              {...{
                states,
                activeStateId,
                setActiveStateId,
                lockValues,
                handleSubmit,
                colony: colonyData.processedColony,
                recipients: formValues?.recipients,
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
