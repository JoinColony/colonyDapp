Here we discuss some general component conventions and best practices.

## Component file header

### File imports
File imports for each file should appear in the correct order. The order is as follows (each of these blocks should be separated by a blank line):

1) Types from external packages
```js static
import { FormikProps } from 'formik';
```

2) External packages
```js static
import React, { Component } from 'react';
```

3) Aliased modules / components
```js static
import { getMainClasses } from '~utils/css';
```

4) Styles
```js static
import styles from './StepCreateToken.css';
```

5) Types of our own libs / files
```js static
import { SomeTypes } from '../../../lib/...‘;
```

6) Our own files
```js static
import Stuff from '../../../lib/...';
```

### Internationalization

Every piece of text / copy has to be used with internationalisation in mind. Never (!) hard code text in the components themselves. The convention is to use a const named `MSG` with `react-intl`s `defineMessages` at the top of the file (directly under the imports):

```js static
const MSG = defineMessages({
  /* Messages here */
};
```

The convention for the `id` naming is the following: `module.ComponentName.[SubComponentName].propertyName` where `propertyName` should be the same name as used for the property in `MSG`. Here's an example:

```js static
labelAddAdmins: {
  id: 'admin.Organizations.OrganizationAddAdmins.labelAddAdmins',
  defaultMessage: 'Add new admin',
},
```

**Important! `core`-components do not get a module prefix!** Example:

```js static
const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
});
```

Also do not use sub-sub-component names or anything like that. The `ComponentName` is always the one of the main component (the directory name) and the `SubComponentName` is the name of the current component (the current file). `SubComponentName` is only applied in sub-components (the ones which have a different name from the main one).
