import { ColonyClient } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';

/*
 * Rehydrate the colony manager with existing colony clients
 */
export function* rehydrateColonyClients(
  existingColonyClients: Map<string, Promise<ColonyClient>>,
) {
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

  /*
   * @NOTE Man... I haven't written a classic for loop in ages...
   */
  for (let index = 0; index < existingColonyClients.size; index += 1) {
    const [colonyAddress] = existingColonyClients.entries().next().value;
    yield colonyManager.setColonyClient(colonyAddress);
  }
}
