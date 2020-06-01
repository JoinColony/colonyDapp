### Decision Hub Usage
The Decision Hub renders a list of links divided by borders

```js
import { Form } from '../Fields';

const MSG = {
  createTokenTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Rule the world',
  },
  createTokenSubtitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'And collaborate with others',
  },
  selectTokenTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Be nice',
  },
  selectTokenSubtitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'And kick asses',
  },
};

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
  },
];

<Form initialValues={{ thatField: '' }} onSubmit={(values) => console.log(values)}>
  <DecisionHub name="thatField" options={options} />
</Form>
```

Decision Hub with icons for each row

```js
import { Form } from '../Fields';

const MSG = {
  createTokenTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Rule the world',
  },
  createTokenSubtitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'And collaborate with others',
  },
  selectTokenTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Be nice',
  },
  selectTokenSubtitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'And kick asses',
  },
};

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
    icon: 'metamask',
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: 'wallet'
  },
];

<Form initialValues={{ thatField: '' }} onSubmit={(values) => console.log(values)}>
  <DecisionHub name="thatField" options={options} />
</Form>
```

Decision Hub with tooltips
```js
import { Form } from '../Fields';

const MSG = {
  createTokenTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Rule the world',
  },
  createTokenSubtitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'And collaborate with others',
  },
  selectTokenTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Be nice',
  },
  selectTokenSubtitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'And kick asses',
  },
  tooltip:  {
    id: 'ComponentName.tooltip',
    defaultMessage: 'This is an explanation helping you to decide where to click.',
  },
};
const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
    icon: 'metamask',
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltip
  },
];

<Form initialValues={{ thatField: '' }} onSubmit={(values) => console.log(values)}>
  <DecisionHub name="thatField" options={options} />
</Form>
```
