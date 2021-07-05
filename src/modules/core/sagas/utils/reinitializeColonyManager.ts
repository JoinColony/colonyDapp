import { call } from 'redux-saga/effects';
import {
  TEMP_getContext,
  TEMP_setContext,
  ContextModule,
} from '~context/index';
import { getColonyManager } from '.';

export default function* reinitializeColonyManager() {
  let colonyClients = new Map();
  /*
   * If we have a colony manager set in context, get it's initialized colony clients
   *
   * Note that it won't exist if this is the first time loading the app, as it
   * gets set just after this try/catch block
   */
  try {
    const oldColonyManager = TEMP_getContext(ContextModule.ColonyManager);
    colonyClients = oldColonyManager.colonyClients;
  } catch (error) {
    /*
     * Silent error
     */
  }

  const colonyManager = yield call(getColonyManager);
  TEMP_setContext(ContextModule.ColonyManager, colonyManager);

  /*
   * Rehydrate the colony manage with (potentially) existing colony clients
   */
  for (let index = 0; index < colonyClients.size; index += 1) {
    const [colonyAddress] = colonyClients.entries().next().value;
    yield colonyManager.setColonyClient(colonyAddress);
  }
  return colonyManager;
}
