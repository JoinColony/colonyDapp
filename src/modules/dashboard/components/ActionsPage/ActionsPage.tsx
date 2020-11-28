import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import TransactionHash from './TransactionHash';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';

import { useTransactionQuery } from '~data/index';
import { STATUS } from './types';

import styles from './ActionsPage.css';

const MSG = defineMessages({
  genericAction: {
    id: 'dashboard.ActionsPage.genericAction',
    defaultMessage: 'Generic Action with {user} mention',
  },
});

const displayName = 'dashboard.ActionsPage';

const ActionsPage = () => {
  const { transactionHash } = useParams<{
    transactionHash?: string;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useTransactionQuery({
    variables: { transactionHash: transactionHash || '' },
  });

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Heading
            text={MSG.genericAction}
            textValues={{
              /*
               * @TODO Add proper username
               */
              user: <Decorate key="@username">@username</Decorate>,
            }}
            appearance={{
              size: 'medium',
              weight: 'medium',
              theme: 'dark',
            }}
          />
          {transactionHash && (
            <TransactionHash
              transactionHash={transactionHash}
              status={STATUS.Succeeded}
            />
          )}
        </div>
        <div className={styles.details}>
          {/*
           * @TODO Add in DEV-45
           */}
          Details component goes here
        </div>
      </div>
    </div>
  );
};

ActionsPage.displayName = displayName;

export default ActionsPage;
