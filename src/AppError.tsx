import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { AppErrorType, AppErrorShape } from './context/appErrorState';

import styles from './AppError.css';

/* eslint-disable max-len */
const MSG = defineMessages({
  error: {
    id: 'routes.Routes.AppError.error',
    defaultMessage: `Startup Error: {errorType, select,
      ${AppErrorType.ServerHttpConnection} {Could not connect to the server}
      ${AppErrorType.ServerWebsocketConnection} {Could not connect to the server's websocket}
      ${AppErrorType.ProviderConnection} {Could not connect to the provider}
      other {Generic CDapp Error}
    }`,
  },
});
/* eslint-enable max-len */

interface Props {
  errors?: AppErrorShape[];
}

const AlwaysAccesibleRoute = ({ errors }: Props) => (
  <div className={styles.main}>
    <main className={styles.mainContent}>
      <ul>
        {errors?.map((error) => (
          <li>
            <FormattedMessage
              {...MSG.error}
              values={{ errorType: error.type }}
            />
          </li>
        ))}
      </ul>
    </main>
  </div>
);

export default AlwaysAccesibleRoute;
