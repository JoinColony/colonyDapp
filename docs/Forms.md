Some introductory text describing forms followed by some cool examples.

TODO: Write something about disconnecting form fields from Formik (`connect={false}`), setFieldValue, etc.

### Wizard

You can either use a normal onSubmit function for the wizard steps or use an object that contains all the props for the `ActionForm` to wrap your wizard step in an `ActionForm`.

```js
const yup = require('yup');
const withWizard = require('../src/modules/core/components/Wizard/withWizard').default;
const OuterTemplate = (({ children }) => <div>{children}</div>);
const Step1 = ({ handleSubmit, step, values }) => (
  <form onSubmit={handleSubmit}>
    <h1>Step {step}</h1>
    <Input name="email" label="eMail" />
    <Button appearance={{ theme: 'primary' }} type="submit">Next</Button>
  </form>
);
const step1Validation = yup.object().shape({
  email: yup.string().email().required(),
});
const Step2 = ({ handleSubmit, previousStep, step }) => (
  <form onSubmit={handleSubmit}>
    <h1>Step {step}</h1>
    <Input name="username" label="username" />
    <Button appearance={{ theme: 'secondary' }} onClick={previousStep}>Previous</Button>
    <Button appearance={{ theme: 'primary' }} type="submit">Next</Button>
  </form>
);
const step2Validation = yup.object().shape({
  username: yup.string().required(),
});
const Step3 = ({ handleSubmit, values }) => (
  <form onSubmit={handleSubmit}>
    <pre>Value 1: {values.email}</pre>
    <pre>Value 2: {values.username}</pre>
    <Button appearance={{ theme: 'danger' }} type="submit">Submit these values</Button>
  </form>
);
const Wizard = withWizard({
  steps: [
    { Step: Step1, validationSchema: step1Validation, onSubmit: (values, { nextStep }) => nextStep() },
    { Step: Step2, validationSchema: step2Validation, onSubmit: (values, { nextStep }) => nextStep() },
    { Step: Step3, onSubmit: values => console.log(values) },
  ],
})(OuterTemplate);

<Wizard foo="bar" />
```
