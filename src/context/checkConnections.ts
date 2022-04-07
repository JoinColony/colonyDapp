import appErrorStateContext, { AppErrorType } from './appErrorState';
// import { getApolloUri } from './apolloClient';

const STORAGE_KEY = 'dsettings';
const decentralizedStorage = JSON.parse(
  localStorage.getItem(STORAGE_KEY) as string,
);

const checkServerConnection = (forceUpdate) => {
  let errorAlreadyExists = false;
  if (
    appErrorStateContext
      .getErrors()
      .find(({ type }) => type === AppErrorType.ServerHttpConnection)
  ) {
    errorAlreadyExists = true;
  }
  fetch(`${process.env.SERVER_ENDPOINT}/liveness`)
    .then((response) => {
      if (response.status !== 200) {
        appErrorStateContext.addError({
          type: AppErrorType.ServerHttpConnection,
        });
        if (!errorAlreadyExists) {
          forceUpdate();
        }
      }
    })
    .catch(() => {
      appErrorStateContext.addError({
        type: AppErrorType.ServerHttpConnection,
      });
      if (!errorAlreadyExists) {
        forceUpdate();
      }
    });
};

// const checkServerWebsocketConnection = (forceUpdate) => {
//   let errorAlreadyExists = false;
//   if (
//     appErrorStateContext
//       .getErrors()
//       .find(({ type }) => type === AppErrorType.ServerWebsocketConnection)
//   ) {
//     errorAlreadyExists = true;
//   }
//   const webSocket = new WebSocket(
//     getApolloUri(`${process.env.SERVER_ENDPOINT}/graphql`, true),
//   );
//   if (webSocket.readyState === WebSocket.CLOSED) {
//     appErrorStateContext.addError({
//       type: AppErrorType.ServerWebsocketConnection,
//     });
//     if (!errorAlreadyExists) {
//       forceUpdate();
//     }
//   }
// };

const checkProviderConnection = (forceUpdate) => {
  const providerURL = decentralizedStorage?.enabled
    ? decentralizedStorage?.customRPC
    : process.env.RPC_URL || 'http://localhost:8545/';

  let errorAlreadyExists = false;
  if (
    appErrorStateContext
      .getErrors()
      .find(({ type }) => type === AppErrorType.ProviderConnection)
  ) {
    errorAlreadyExists = true;
  }
  async function post() {
    const response = await fetch(providerURL, {
      method: 'POST',
      // mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'net_version',
        params: [],
      }),
    });
    return response;
  }

  post()
    .then((response) => {
      if (response.status !== 200) {
        appErrorStateContext.addError({
          type: AppErrorType.ProviderConnection,
        });
        if (!errorAlreadyExists) {
          forceUpdate();
        }
      }
    })
    .catch(() => {
      appErrorStateContext.addError({
        type: AppErrorType.ProviderConnection,
      });
      if (!errorAlreadyExists) {
        forceUpdate();
      }
    });
};

const checkConnections = (forceUpdate) => {
  if (!decentralizedStorage?.enabled) {
    checkServerConnection(forceUpdate);
    // checkServerWebsocketConnection(forceUpdate);
  }
  checkProviderConnection(forceUpdate);
};

export default checkConnections;
