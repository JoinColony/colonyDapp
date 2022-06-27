import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
import * as yup from 'yup';

import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import LogsSection from '~dashboard/ExpenditurePage/LogsSection';
import TitleDescriptionSection from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';

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

const ExpenditurePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditable, setIsEditable] = useState(true);
  const { colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();

  const { data } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const sidebarRef = useRef<HTMLElement>(null);
  const submit = useCallback((values) => {
    // eslint-disable-next-line no-console
    console.log({ values });
  }, []);

  return isEditable ? (
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
            <LogsSection
              colonyAddress={data?.colonyAddress || ''}
              isFormEditable={isEditable}
            />
          </main>
        </div>
      </div>
    </Form>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} />
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <TitleDescriptionSection isEditable={isEditable} />
          <LogsSection
            colonyAddress={data?.colonyAddress || ''}
            isFormEditable={isEditable}
          />
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
