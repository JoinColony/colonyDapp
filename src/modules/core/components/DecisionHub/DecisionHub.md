### Decision Hub Usage
The Decision Hub renders a list of links divided by borders

```js
const { Formik } = require('formik');

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

<Formik>
  <DecisionHub name="thatField" options={options} />
</Formik>
```

Decision Hub with icons for each row

```js
const { Formik } = require('formik');

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


<Formik>
  <DecisionHub name="thatField" options={options} />
</Formik>
```

Decision Hub with tooltips
```js
const { Formik } = require('formik');
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
<Formik>
  <DecisionHub name="thatField" options={options} />
</Formik>
```
