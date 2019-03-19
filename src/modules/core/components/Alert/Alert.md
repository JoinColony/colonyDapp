
## Alert

```jsx
<Alert text="Content inside the alert" />
```

## Alert Themes

#### Color

```jsx
<div>
  <Alert appearance={{ theme: 'primary' }} text="Primary" />
  <Alert appearance={{ theme: 'info' }} text="Info" />
  <Alert appearance={{ theme: 'danger' }} text="Danger" />
</div>
```

#### Border Radius

```jsx
<div>
  <Alert appearance={{ theme: 'primary' boderRadius: 'small' }} text="Primary" />
  <Alert appearance={{ boderRadius: 'medium' }} text="Primary" />
  <Alert appearance={{ boderRadius: 'large' }} text="Primary" />
  <Alert appearance={{ boderRadius: 'round' }} text="Primary" />
</div>
```

## Dismissible Alert

```jsx
<Alert text="This alert is dismissible" isDismissible />
```
