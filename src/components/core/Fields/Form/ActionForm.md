An `ActionForm` is a wrapper around the `Form` core component and the [`react-redux-promise-listener`](https://github.com/erikras/react-redux-promise-listener). You can read the documentation of that library to understand the concept better.

I'll let [erikras](https://github.com/erikras) explain:

>Most of the popular React form libraries accept an onSubmit function that is expected to return a Promise that resolves when the submission is complete, or rejects when the submission fails. This mechanism is fundamentally incompatible with action management libraries like redux-saga, which perform side-effects (e.g. ajax requests) in a way that does not let the submission function easily return a promise. React Redux Promise Listener is a potential solution.

The tl;dr is we use the above library where `submit` corresponds to `start`, `success` to `resolve` and `error` to `reject` respectively. This allows for the complete elimination of actionCreators in most forms.

### How to use an `ActionForm`

The `ActionForm` takes all the props a `Form` takes minus the `onSubmit` function plus the special props you can see above. The `submit`, `success` and `error` props are required and should by valid redux action type strings of your app.

Essentially the workflow is as follows:

* When the user submits the form the action defined in `submit` will be dispatched and the `isSubmitting` value of the form will be set to `true`
* A saga picks up the action and does its thing. The listener will then listen to either the `success` or `error` action dispatched during the saga lifecycle
  - If the `success` action is dispatched by the saga, the `isSubmitting` value of the form will be set to `false` and if applicable, the `onSuccess` handler will be called with the payload of the action of the `success` action
  - If the `error` action is dispatched by the saga, the `isSubmitting` value of the form will be set to `false` and if applicable, the `onError` handler will be called with the payload of the action of the `error` action

Hint: the second argument of both `onSuccess` and `onError` is the [`FormikBag`](https://jaredpalmer.com/formik/docs/api/formik#onsubmit-values-values-formikbag-formikbag-void) like in `onSubmit`. You can use that to set form state on form errors (see example).

### Example

```js static
import { CREATE_COOL_THING, COOL_THING_CREATED, COOL_THING_CREATE_ERROR } from './actionTypes';

<ActionForm
  submit={CREATE_COOL_THING}
  success={COOL_THING_CREATED
  error={COOL_THING_CREATE_ERROR}
  onError={(err, { setStatus }) => {
    // `setErrors()` is also available!
    setStatus({ error: MSG.createCoolThingError })
  }}
>
  {({ status }) => (
    <div>
      <FormStatus status={status} />
      {/* Your form fields are here. Or above. However you like */}
    </div>
  )}
</ActionForm>
```
