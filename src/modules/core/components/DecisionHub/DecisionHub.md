### Decision Hub Usage
The Decision Hub renders a list of links divided by borders

```js

const rowTitles = {
  superCreativeTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Rule the world',
  },
  evenMoreCreativeTitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'Collaborate with others',
  },
};

const rowSubTitles = {
  superCreativeTitle: {
    id: 'ComponentName.specialSub',
    defaultMessage: 'But be nice',
  },
  evenMoreCreativeTitle: {
    id: 'ComponentName.exceptionalSub',
    defaultMessage: 'And kick ass',
  },
};

<DecisionHub rowTitles={rowTitles} rowSubTitles={rowSubTitles} />
```

Decision Hub with icons for each row

```js

const rowTitles = {
  superCreativeTitle: {
    id: 'ComponentName.special',
    defaultMessage: 'Rule the world',
  },
  evenMoreCreativeTitle: {
    id: 'ComponentName.exceptional',
    defaultMessage: 'Collaborate with others',
  },
};

const rowSubTitles = {
  superCreativeTitle: {
    id: 'ComponentName.specialSub',
    defaultMessage: 'But be nice',
  },
  evenMoreCreativeTitle: {
    id: 'ComponentName.exceptionalSub',
    defaultMessage: 'And kick ass',
  },
};

const icons = ['metamask', 'wallet'];

<DecisionHub rowTitles={rowTitles} rowSubTitles={rowSubTitles} icons={icons}/>
```