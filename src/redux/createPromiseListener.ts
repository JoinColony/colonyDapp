import { Middleware } from 'redux';
import createReduxPromiseListener, {
  State,
  Action,
  Config,
} from '@colony/redux-promise-listener';

// More specific types than in package (with generics)
export type AsyncFunction<Params, Return> = {
  asyncFunction: (arg0: Params) => Promise<Return>;
  unsubscribe: () => void;
};

export type PromiseListener = {
  middleware: Middleware<State, Action>;
  createAsyncFunction: <Params, Return>(
    arg0: Config,
  ) => AsyncFunction<Params, Return>;
};

const reduxPromiseListener: PromiseListener = createReduxPromiseListener();

export default reduxPromiseListener;
