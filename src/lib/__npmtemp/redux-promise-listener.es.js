/* eslint-disable */

const _extends =
  Object.assign ||
  function(target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];

      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

//

const defaultSetPayload = function defaultSetPayload(action, payload) {
  return _extends({}, action, {
    payload,
  });
};
const defaultGetPayload = function defaultGetPayload(action) {
  return action.payload;
};
const defaultGetError = function defaultGetError(action) {
  return action.payload;
};

function createListener() {
  let nextListenerId = 0;
  const listeners = {};
  let dispatch = void 0;
  const middleware = function middleware(store) {
    dispatch = store.dispatch;
    return function(next) {
      return function(action) {
        // This could potentially be improved performance-wise by doing a hash lookup
        // by action.type to not loop through all the listeners on every action,
        // but there will probably be no listeners for the majority of an application's
        // lifecycle, so this structure was chosen for its ease of cleanup.
        Object.keys(listeners).forEach(key => listeners[Number(key)](action));
        return next(action);
      };
    };
  };

  const createAsyncFunction = function createAsyncFunction(config) {
    const listenerId = nextListenerId++;
    const unsubscribe = function unsubscribe() {
      delete listeners[listenerId];
    };
    if (!dispatch) {
      throw new Error('The redux-promise-listener middleware is not installed');
    }
    const asyncFunction = function asyncFunction(payload) {
      return new Promise((resolve, reject) => {
        const listener = function listener(action) {
          if (
            action.type === config.resolve ||
            (typeof config.resolve === 'function' && config.resolve(action))
          ) {
            unsubscribe();
            resolve((config.getPayload || defaultGetPayload)(action));
          } else if (
            action.type === config.reject ||
            (typeof config.reject === 'function' && config.reject(action))
          ) {
            unsubscribe();
            reject((config.getError || defaultGetError)(action));
          }
        };
        listeners[listenerId] = listener;
        dispatch(
          (config.setPayload || defaultSetPayload)(
            { type: config.start },
            payload,
          ),
        );
      });
    };

    return { asyncFunction, unsubscribe };
  };

  return { middleware, createAsyncFunction };
}

//

export default createListener;
