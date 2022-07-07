import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { nanoid } from 'nanoid';

import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { RouteChildrenProps, useParams } from 'react-router';
import { FormikErrors } from 'formik';
import { isEqual } from 'lodash';
import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Stages from '~dashboard/ExpenditurePage/Stages';
import TitleDescriptionSection, {
  LockedTitleDescriptionSection,
} from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { getMainClasses } from '~utils/css';
import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { Stage } from '~dashboard/ExpenditurePage/Stages/constants';
import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import { useColonyFromNameQuery } from '~data/generated';
import { useLoggedInUser } from '~data/helpers';
import { SpinnerLoader } from '~core/Preloaders';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
import EditExpenditureDialog from '~dashboard/Dialogs/EditExpenditureDialog/EditExpenditureDialog';
import { useDialog } from '~core/Dialog';
import Tag from '~core/Tag';
import EditButtons from '~dashboard/ExpenditurePage/EditButtons/EditButtons';

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
  suggestions: {
    id: 'dashboard.Expenditures.Stages.suggestions',
    defaultMessage: 'You are making suggestions ',
  },
});

const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
  filteredDomainId: yup
    .string()
    .required(() => <FormattedMessage {...MSG.teamRequiredError} />),
  recipients: yup.array(
    yup.object().shape({
      recipient: yup.object().required(),
      value: yup
        .array(
          yup.object().shape({
            amount: yup
              .number()
              .required(() => MSG.valueError)
              .moreThan(0, () => MSG.amountZeroError),
            tokenAddress: yup.string().required(),
          }),
        )
        .min(1),
    }),
  ),
  title: yup.string().min(3).required(),
  description: yup.string().max(4000),
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
  owner: string;
  recipients: Recipient[];
  title: string;
  description?: string;
}

const initialValues = {
  expenditure: 'advanced',
  recipients: [newRecipient],
  filteredDomainId: String(ROOT_DOMAIN_ID),
  owner: undefined,
  title: undefined,
  description: undefined,
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
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStateId, setActiveStateId] = useState<string>();
  const sidebarRef = useRef<HTMLElement>(null);

  const openEditExpenditureDialog = useDialog(EditExpenditureDialog);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });
  const loggedInUser = useLoggedInUser();

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
                id: nanoid(),
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

  const { expenditure, filteredDomainId } = formValues || {};

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  const [inEditMode, setInEditMode] = useState(false);

  const handleConfirmEition = useCallback(() => {
    setInEditMode(false);
    setFormEditable(false);
    // add call to the backend
  }, []);

  const handleEditLockedForm = useCallback(() => {
    setInEditMode(true);
    setFormEditable(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setInEditMode(false);
    setFormEditable(false);
  }, []);

  // add discard change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const discardChange = useCallback((name: string) => {
    // logic to change field value to initial
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

      const differentValues = Object.entries(values).reduce(
        (result, current) => {
          const [key, value] = current;

          // if the value is an array, check each item
          if (Array.isArray(value)) {
            const changes = value.map((item, index) => {
              if (typeof item === 'object') {
                const change = Object.entries(item).reduce(
                  (acc, [currKey, currVal]) => {
                    const initialVal = initialValues[key][index][currKey];

                    if (currKey === 'isExpanded') {
                      return acc;
                    }

                    if (!isEqual(currVal, initialVal)) {
                      return { ...acc, ...{ [currKey]: currVal } };
                    }

                    return acc;
                  },
                  {},
                );

                return Object.keys(change).length > 0 ? change : {};
              }

              if (!isEqual(value, initialValues[key])) {
                return value;
              }

              return {};
            });

            return Object.keys(changes).length > 0
              ? { ...result, ...{ [key]: changes } }
              : result;
          }

          if (isEqual(initialValues[key], values[key])) {
            return { ...result, [key]: value };
          }

          return result;
        },
        {},
      );

      // add previous value for recipient

      return (
        !hasErrors &&
        openEditExpenditureDialog({
          onClick: handleConfirmEition,
          isVotingExtensionEnabled: true,
          colonyName,
          formValues: differentValues,
        })
      );
    },
    [colonyName, handleConfirmEition, openEditExpenditureDialog],
  );

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
      {({ values, validateForm }) => (
        <div className={getMainClasses({}, styles)}>
          <aside className={styles.sidebar} ref={sidebarRef}>
            {loading ? (
              <SpinnerLoader appearance={{ size: 'medium' }} />
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
              {inEditMode ? (
                <EditButtons
                  handleEditSubmit={() =>
                    handleEditSubmit(values, validateForm)
                  }
                  {...{ handleEditCancel }}
                />
              ) : (
                <Stages
                  {...{
                    states,
                    activeStateId,
                    setActiveStateId,
                    lockValues,
                    handleSubmit,
                  }}
                />
              )}
            </main>
          </div>
        </div>
      )}
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
          colony={colonyData?.processedColony}
          editForm={handleEditLockedForm}
        />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <LockedTitleDescriptionSection
            title={formValues?.title}
            description={formValues?.description}
          />
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
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
