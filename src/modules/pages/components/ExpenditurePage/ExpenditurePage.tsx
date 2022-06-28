import React, { useCallback, useRef, useState } from 'react';
import * as yup from 'yup';
import isEqual from 'lodash/isEqual';

import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { nanoid } from 'nanoid';
import { FormikErrors } from 'formik';
import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import Stages from '~dashboard/ExpenditurePage/Stages';
import { getMainClasses } from '~utils/css';
import styles from './ExpenditurePage.css';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import TitleDescriptionSection from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { Stage } from '~dashboard/ExpenditurePage/Stages/constants';
import EditButtons from '~dashboard/ExpenditurePage/EditButtons/EditButtons';
import Tag from '~core/Tag';
import { useDialog } from '~core/Dialog';
import EditExpenditureDialog from '~dashboard/Dialogs/EditExpenditureDialog/EditExpenditureDialog';
import LockedTitleDescriptionSection from '~dashboard/ExpenditurePage/TitleDescriptionSection/LockedTitleDescriptionSection';

const displayName = 'pages.ExpenditurePage';

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
  recipients: {
    recipient: string;
    value: { amount: number; tokenAddress: number }[];
    delay: { amount: string; time: string };
    isExpanded: boolean;
  }[];
  title: string;
  description?: string;
}

export interface FormValues {
  expenditure?: string;
  filteredDomainId?: string;
  owner?: string;
  recipients?: {
    recipient?: string;
    value?: { amount: number; tokenAddress: number }[];
    delay?: { amount: string; time: string };
    isExpanded?: boolean;
  }[];
  title?: string;
  description?: string;
}

export interface State {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
}

interface Props {
  colonyName: string;
}

const MSG = defineMessages({
  userRequiredError: {
    id: 'dashboard.Expenditures.ExpenditurePage.userRequiredError',
    defaultMessage: 'User is required',
  },
  delayRequiredError: {
    id: 'dashboard.Expenditures.ExpenditurePage.delayRequiredError',
    defaultMessage: 'Delay is required',
  },
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
  suggestions: {
    id: 'dashboard.Expenditures.Stages.suggestions',
    defaultMessage: 'You are making suggestions ',
  },
});

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

const ExpenditurePage = ({ colonyName }: Props) => {
  const [isFormEditable, setFormEditable] = useState(true);
  const [isInEditMode, setIsInEditMode] = useState(false);
  // initialFormValues is temporary value
  // const initialFormValues = mockFormValues;
  const [formValues, setFormValues] = useState<typeof initialValues>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const [activeStateId, setActiveStateId] = useState<string>(Stage.Draft);

  const openEditExpenditureDialog = useDialog(EditExpenditureDialog);

  const submit = useCallback((values) => {
    setShouldValidate(true);
    if (values) {
      setFormValues(values);
    }
    setFormEditable(false);
    // add sending form to backend
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

  const { owner, expenditure, filteredDomainId } = formValues || {};

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  const handleConfirmEition = useCallback(() => {
    setIsInEditMode(false);
    setFormEditable(false);
    // add call to the backend
  }, []);

  const handleEditLockedForm = useCallback(() => {
    setIsInEditMode(true);
    setFormEditable(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsInEditMode(false);
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
      setIsInEditMode(true);
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
      initialValues={formValues || initialValues}
      onSubmit={submit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      {({ values, validateForm }) => (
        <div className={getMainClasses({}, styles)}>
          <aside className={styles.sidebar} ref={sidebarRef}>
            {isInEditMode && (
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
            <ExpenditureSettings />
            <Payments sidebarRef={sidebarRef.current} />
          </aside>
          <div className={styles.mainContainer}>
            <main className={styles.mainContent}>
              <TitleDescriptionSection />
              {isInEditMode ? (
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
          {...{ owner, expenditure, team: filteredDomainId }}
        />
        <LockedPayments
          recipients={formValues?.recipients}
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
            }}
          />
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
