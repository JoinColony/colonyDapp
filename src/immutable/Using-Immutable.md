# Using Immutable.js

This project uses [Immutable.js](http://immutable-js.github.io/) and [redux](https://redux.js.org) for state management.


## Immutable Records

Records need to be defined in a standard way in order to provide proper definitions for TypeScript, especially when the record is converted from the Immutable structure to native JavaScript data structures.

```typescript
import { Record } from 'immutable';

// Utility types
import { DefaultValues, RecordToJS } from '~types/index';

export enum ActivityActions {
  ADDED_SKILL_TAG = 'ADDED_SKILL_TAG',
  ASSIGNED_USER = 'ASSIGNED_USER',
  COMMENTED_ON = 'COMMENTED_ON',
}

// The interface shared between the Immutable and JavaScript
// versions of the Record
interface Shared {
  actionType: ActivityActions;
  date?: Date;
  domainTag: string;
  id: number;
  organization: string;
  task: string;
  user?: string;
}

// This is the JavaScript version
export type ActivityFeedItemType = Readonly<Shared>;

// The Record factory from Immutable requires default values.
// It's important that these are supplied, even if they're
// undefined; otherwise, the class created by the factory
// won't have the right setters/getters.
const defaultValues: DefaultValues<Shared> = {
  actionType: undefined,
  date: new Date(),
  domainTag: undefined,
  id: undefined,
  organization: undefined,
  task: undefined,
  user: undefined,
};

// Here the Record class is defined with the factory method, given
// the default values as the first argument.
//
// The factory method also requires a TypeScript generic, which is
// the interface for the Record properties.
//
// Additionally, we define this class as implementing the `RecordToJS`
// interface, which will define the return value for the `.toJS()` method.
export class ActivityFeedItemRecord extends Record<Shared>(defaultValues)
  implements RecordToJS<ActivityFeedItemType> {}

// We define a factory function to create the class based on given props.
export const ActivityFeedItem = (p: Shared) => new ActivityFeedItemRecord(p);

// Example usage:
const item = ActivityFeedItem({
  actionType: ActivityActions.ADDED_SKILL_TAG,
  domainTag: 'tag',
  id: 'id',
  organization: 'org',
});

const itemJS = item.toJS(); // JS object of type ActivityFeedItemType
```


## Immutable Collections

Most state in this project is represented with structures along these lines:

```typescript
type MyState = ImmutableMap<MyKey, MyRecord>;

// This might look something like this:
// MyState {
//   'v863afb653': TaskRecord {},
//   'dh9a7h22sn': TaskRecord {},
//   ...etc
// }
```

Immutable Collections (usually Maps, Sets and Lists) generally contain Immutable Records, which define the shape of the data stored therein.

Similarly to Records, these Collections also require some special typing in order for `.toJS()` to return the correct types:

```typescript
export type IpfsDataType = ImmutableMap<string, FetchableDataRecord<string>> & {
  toJS(): { [hash: string]: FetchableDataType<string> };
};

// Usage:
let ipfsMap: IpfsDataType = ImmutableMap();
ipfsMap = ipfsMap.set('my ipfs hash', FetchableDataRecord('data'));

const fetchableData = ipfsMap.get('my ipfs hash'); // FetchableDataRecord<string>

// All entries are converted to the JS version (FetchableDataRecord => FetchableDataType)
// and the map itself is converted to an object
const ipfsObject = ipfsMap.toJS(); // { [hash: string]: FetchableDataType<string> }
```

## Defining state

The app's state is defined as Records in `src/immutable/state`, which imports sub-state from various modules. The `RootStateRecord` class contains all app state, and can be used in the typing of selectors.
