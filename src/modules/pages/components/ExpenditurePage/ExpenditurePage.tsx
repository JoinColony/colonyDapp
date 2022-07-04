import React, { useCallback, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { nanoid } from 'nanoid';

import { RouteChildrenProps, useParams } from 'react-router';
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
  userRequiredError: {
    id: 'dashboard.Expenditures.ExpenditurePage.userRequiredError',
    defaultMessage: 'User is required',
  },
  delayRequiredError: {
    id: 'dashboard.Expenditures.ExpenditurePage.delayRequiredError',
    defaultMessage: 'Delay is required',
  },
});

const initialValues = {
  expenditure: 'advanced',
  filteredDomainId: undefined,
  owner: undefined,
  title: undefined,
  description: undefined,
  recipients: [{ ...newRecipient, id: nanoid() }],
};

export interface ValuesType {
  expenditure: string;
  filteredDomainId: { label: string; value: string };
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
  filteredDomainId: yup.string().required('Team is required'),
  recipients: yup.array(
    yup.object().shape({
      recipient: yup
        .object()
        .required(() => <FormattedMessage {...MSG.userRequiredError} />),
      value: yup
        .array(
          yup.object().shape({
            amount: yup.number().required(),
            tokenAddress: yup.string().required(),
          }),
        )
        .min(1),
      delay: yup
        .object()
        .shape({
          amount: yup.string().required(),
          time: yup
            .string()
            .required(() => <FormattedMessage {...MSG.delayRequiredError} />),
        })
        .required(),
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

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const [isFormEditable, setFormEditable] = useState(true);
  const [formValues, setFormValues] = useState<ValuesType>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStateId, setActiveStateId] = useState<string>();
  const sidebarRef = useRef<HTMLElement>(null);

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

  const { owner, expenditure, filteredDomainId } = formValues || {};

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  return isFormEditable ? (
    <Form
      initialValues={formValues || initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar} ref={sidebarRef}>
          <ExpenditureSettings />
          {colonyData && (
            <Payments
              sidebarRef={sidebarRef.current}
              colony={colonyData.processedColony}
            />
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
          {...{ expenditure, team: filteredDomainId }}
          owner={owner as any}
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
