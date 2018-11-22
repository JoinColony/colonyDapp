Some introductory text describing forms followed by some cool examples.

TODO: Write something about disconnecting form fields from Formik (`connect={false}`), setFieldValue, etc.

### Wizard

You can either use a normal onSubmit function for the wizard steps or use an object that contains all the props for the `ActionForm` to wrap your wizard step in an `ActionForm`.

```js
const yup = require('yup');
const withWizard = require('../src/modules/core/components/Wizard/withWizard').default;
const OuterTemplate = (({ children }) => <div>{children}</div>);

const Step1 = ({ nextStep, step, wizardValues }) => (
  <Form onSubmit={nextStep} initialValues={wizardValues}>
    <h1>Step {step}</h1>
    <Input name="email" label="eMail" />
    <Button appearance={{ theme: 'primary' }} type="submit">Next</Button>
  </Form>
);

const Step2 = ({ nextStep, previousStep, step, wizardValues }) => (
  <Form onSubmit={nextStep} initialValues={wizardValues}>
    {({ values }) => (
      <div>
        <h1>Step {step}</h1>
        <Input name="username" label="username" />
        <Button appearance={{ theme: 'secondary' }} onClick={() => previousStep(values)}>Previous</Button>
        <Button appearance={{ theme: 'primary' }} type="submit">Next</Button>
      </div>
    )}
  </Form>
);

const Step3 = ({ nextStep, wizardValues }) => (
  <Form onSubmit={() => window.alert(JSON.stringify(wizardValues))} initialValues={wizardValues}>
    <pre>Value 1: {wizardValues.email}</pre>
    <pre>Value 2: {wizardValues.username}</pre>
    <Button appearance={{ theme: 'danger' }} type="submit">Submit these values</Button>
  </Form>
);
const Wizard = withWizard({
  steps: [Step1, Step2, Step3]
})(OuterTemplate);

<Wizard foo="bar" />
```
