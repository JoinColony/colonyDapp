# Using Immutable.js

This project uses [Immutable.js](http://immutable-js.github.io/) and [redux](https://redux.js.org) for state management.


## Immutable Records

Records need to be defined in a standard way in order to provide proper definitions for TypeScript, especially when the record is converted from the Immutable structure to native JavaScript data structures.


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
