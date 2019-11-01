
The icon(ed) button is a twist on the _classic_ `<Button>` where in front of the button's normal text you can now render an icon from the available icons library.

The use case this was created for was to provide the user with a UX confirmation that the action that's about to be done requires a contract interaction / signing.

```js
import { defineMessages } from 'react-intl';

const MSG = defineMessages({
  buttonText: {
    id: 'styleguide.buttonText',
    defaultMessage: 'Click Me',
  },
});
```

```js
<IconButton text={buttonText} />
```

### Icons

All icons available to the `<Icon />` component are also supported here.

```js
<IconButton text={buttonText} icon="circle-plus" />
```

### Themes

This component supports all the themes the `<Button />` component, on which is based on, supports.

```js
<IconButton appearance={{ theme: 'primary', size: 'medium' }} text={buttonText} />
<IconButton appearance={{ theme: 'secondary', size: 'medium' }} text={buttonText} />
<IconButton appearance={{ theme: 'danger', size: 'medium' }} text={buttonText} />
<IconButton appearance={{ theme: 'ghost', size: 'medium' }} text={buttonText} />
<IconButton appearance={{ theme: 'underlinedBold', size: 'medium' }} text={buttonText} />
<IconButton appearance={{ theme: 'blue', size: 'medium' }} text={buttonText} />
```

### Sizes

As with themes, this component supports all 3 sizes the base component has: `small`, `medium`, `large`.

```js
<IconButton appearance={{ theme: 'primary', size: 'small' }} text={buttonText} />
<IconButton appearance={{ theme: 'primary', size: 'medium' }} text={buttonText} />
<IconButton appearance={{ theme: 'primary', size: 'large' }} text={buttonText} />
```

### Limitations

#### Does not support passing the `children` prop

Since that kinda defeats it's purpouse. If you need to pass `children`, you can just use `<Button />` directly.

#### Only supports button text as a Message Descriptor

We don't really use hard-coded text strings anymore, and especially this component doesn't benefit from that legacy feature.
