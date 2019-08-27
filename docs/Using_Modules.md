# Using modules

## What modules are for

* A distinct and self-contained feature that may contain inter-related facets/sub-modules.

## What modules are not for

* Any odd bit of functionality that could sensibly exist within another module.

## File structure

Modules are expected to follow this structure (but are not limited to it):

```
myModule/
├── README.md
├── namespace.js (Required: a default string export for the module, e.g. 'myModule')
├── types.js (Exported Flow types)
├── actionCreators/
│   ├── index.js
│   ├── myFacetActionCreators.js
│   └── myOtherFacetActionCreators.js
├── actionTypes/
│   ├── index.js
│   ├── myFacetActionTypes.js
│   └── myOtherFacetActionTypes.js
├── reducers/
│   ├── index.js
│   ├── myFacetReducer.js
│   └── myOtherFacetReducer.js
├── selectors/
│   ├── index.js
│   ├── myFacetSelector.js
│   └── myOtherFacetSelector.js
├── sagas/
│   ├── index.js
│   ├── myFacetSagas.js
│   └── myOtherFacetSagas.js
└── components/
    └── MyComponent/
       ├── MyComponent.css
       ├── MyComponent.tsx
       ├── MyComponent.md
       └── MyComponentExample.tsx
```

## Redux conventions

### Action types

* Types should be prefixed with the namespace, e.g.:

```js
import ns from '../namespace';

export const TRANSACTION_ERROR = `${ns}/TRANSACTION_ERROR`; // -> 'core/TRANSACTION_ERROR'
```

* A common pattern for types that involve async functions is: `MY_TYPE`, `MY_TYPE_ERROR`, `MY_TYPE_SUCCESS`

### Action creators

* For the sake of being explicit, action creators should generally be very simple and take named parameters rather than objects, e.g.:

```js
export function sendTransaction(id: string, hash: string) {
  return {
    type: TRANSACTION_SENT,
    payload: { id, hash },
  };
}
```

As opposed to e.g.:

```js
export function sendTransaction(payload: { hash: string, id: string }) {
  return {
    type: TRANSACTION_SENT,
    payload,
  };
}
```

### Reducers

* Currently, we are using [the `immutable` library](https://facebook.github.io/immutable-js/) for the stores.
* FIXME: what's our reasoning for what we should/should not keep in the store?
* FIXME: what are the common patterns for the store we're using?

### Selectors

Selectors are functions that retrieve a subset of a given store's data, and they may involve some mapping/sorting/reducing of values. This approach offers us an easy to grasp means of providing data to components, and can improve performance by memoising results and guarding against unnecessary component updates.

Data can be provided to components like this:

```js
// Create a `pending` prop for the `PendingTxsComponent` component based on the
// `pendingTransactions` selector, which receives the entire app state.
connect(
  state => ({ pending: pendingTransactions(state) }),
  null,
)(PendingTxsComponent);
```

* Currently, we are using [the `reselect` library](https://github.com/reduxjs/reselect) for selectors.
* One important feature of these selectors is that generally, the filters [should not have dynamic arguments](https://github.com/reduxjs/reselect/tree/c93252ddaa77dce5e2096403c44813b38e8c3aaf#q-how-do-i-create-a-selector-that-takes-an-argument). If it looks like we need a dynamic argument, then perhaps the data we're trying to select should exist on its own in the store, or perhaps we could use a factory function to create a statically-defined selector with the given arguments.
* FIXME: what are our best practices for selectors?

### Sagas

* FIXME what are our best practices for sagas? What are the gotchas?

Happy coding!
