### VerticalNavigation Example

The Vertical Navigation core component is intended to be a minimal wrapper for Tabs in order to create a verical layout.

It purpousely has minimal styles applied to it in order for you to be able to have greater customization ability

```js
<VerticalNavigation
  navigationItems={[
    {
      name: 'Tab Name',
      content: 'Tab Content',
    },
  ]}
/>
```

### VerticalNavigation Example with actual React Elements

Check the code source!

```js
<VerticalNavigation
  navigationItems={[
    {
      name: 'First Tab',
      content: <div>Some page full of content</div>,
    },
    {
      name: {
        id: 'example.tabName',
        defaultMessage: 'Second tab',
      },
      content: <div>Another page full of content</div>,
    },
    {
      name: <div>Third Tab</div>,
      content: <div>Yet more pages full of content</div>,
    },
  ]}
/>
```

### VerticalNavigation Example with chidren

Any children passed in will render before the navigation list of tabs

```js
<VerticalNavigation
  navigationItems={[
    {
      name: 'First Tab',
      content: <div>Some page full of content</div>,
    },
  ]}
>
  <div style={{ border: '2px solid green', padding: '20px' }}>
    Hey! I'm some injected content
  </div>
</VerticalNavigation>
```
