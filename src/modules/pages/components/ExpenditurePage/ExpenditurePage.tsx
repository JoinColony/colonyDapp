import React, { useCallback, useRef } from 'react';
import * as yup from 'yup';

import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import { RouteChildrenProps, useParams } from 'react-router';
import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import LogsSection from '~dashboard/ExpenditurePage/LogsSection';
import TitleDescriptionSection from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { SpinnerLoader } from '~core/Preloaders';

const displayName = 'pages.ExpenditurePage';

const initialValues = {
  expenditure: 'advanced',
  recipients: [{ ...newRecipient, id: nanoid() }],
};

const MSG = defineMessages({
  userRequiredError: {
    id: 'dashboard.Expenditures.ExpenditurePage.userRequiredError',
    defaultMessage: 'User is required',
  },
  delayRequiredError: {
    id: 'dashboard.Expenditures.ExpenditurePage.delayRequiredError',
    defaultMessage: 'Delay is required',
  },
});

const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
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

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const sidebarRef = useRef<HTMLElement>(null);
  const submit = useCallback((values) => {
    // eslint-disable-next-line no-console
    console.log({ values });
  }, []);

  return (
    <Form
      initialValues={initialValues}
      onSubmit={submit}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar} ref={sidebarRef}>
          <ExpenditureSettings />
          <Payments sidebarRef={sidebarRef.current} />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <TitleDescriptionSection isEditable />
            {loading ? (
              <div className={styles.spinnerContainer}>
                <SpinnerLoader appearance={{ size: 'medium' }} />
              </div>
            ) : (
              colonyData && <LogsSection colony={colonyData.processedColony} />
            )}
          </main>
        </div>
      </div>
    </Form>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
