import { Context } from '~context/index';
import { Address } from '~types/index';
import { ColonyClient, ColonyManager, Query } from '~data/types';

const colonyContext = [
  Context.COLONY_MANAGER,
  Context.DDB_INSTANCE,
  Context.WALLET,
];

export const getDomain: Query<
  ColonyClient,
  { colonyAddress: Address },
  { domainId: number },
  { skillId: number; potId: number }
> = {
  name: 'getDomain',
  context: colonyContext,
  prepare: async (
    { colonyManager }: { colonyManager: ColonyManager },
    { colonyAddress },
  ) => colonyManager.getColonyClient(colonyAddress),
  async execute(colonyClient, { domainId }) {
    return colonyClient.getDomain.call({ domainId });
  },
};
