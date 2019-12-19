import { ObjectSchema } from 'yup';

import { ColonyEvents } from '~data/types/ColonyEvents';
import { CurrentEvents } from '~data/types/events';
import { CommentEvents } from '~data/types/CommentEvents';
import { AccessController } from './accessControllers/index';
import { EventStore } from '../../lib/database/stores/index';

export type ColonyStore = EventStore<CurrentEvents<ColonyEvents>>;
export type CommentsStore = EventStore<CurrentEvents<CommentEvents>>;

type StoreClassWrapper = typeof EventStore;

export interface StoreBlueprint<
  P extends object,
  AC extends AccessController<any, any>
> {
  schema?: ObjectSchema;
  getAccessController: (storeProps: P) => AC;
  getName: (storeProps: P) => string;
  type: StoreClassWrapper;
}
