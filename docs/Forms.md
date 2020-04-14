Colony uses [Formik](https://jaredpalmer.com/formik/) for handling forms. All fields work with Formik out-of-the-box; Fields can either use the formik context (default behavior), or can be used with local state (`connect={false}` and `setValue={(val) => setStateFn(val)}`).

### Wizard

You can either use a normal onSubmit function for the wizard steps or use an object that contains all the props for the `ActionForm` to wrap your wizard step in an `ActionForm`.

```js
import yup from 'yup';
import withWizard from '../src/modules/core/components/Wizard/withWizard';
import Button from '../src/modules/core/components/Button';
import { Form, Input } from '../src/modules/core/components/Fields';

const OuterTemplate = (({ children }) => <div>{children}</div>);

const Step1 = ({ nextStep, step, wizardForm }) => (
  <Form onSubmit={nextStep} {...wizardForm}>
    {({ isValid }) => (
      <div>
        <h1>Step {step}</h1>
        <Input name="email" label="eMail" />
        <Button appearance={{ theme: 'primary' }} disabled={!isValid} type="submit">Next</Button>
      </div>
    )}
  </Form>
);

const Step2 = ({ nextStep, previousStep, step, wizardForm }) => (
  <Form onSubmit={nextStep} {...wizardForm}>
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
  <Form onSubmit={() => window.alert(JSON.stringify(wizardValues))}>
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
