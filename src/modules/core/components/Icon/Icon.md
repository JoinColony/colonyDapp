### All Icons

```jsx noeditor
const { icons } = require('./icons.json');
const stringSort = (a, b) => {
  if(a<b) {
    return -1
  } else if(a>b) {
    return +1
  }
  return 0
}
class IconGrid extends React.Component {
  render() {
    const iconGridStyles = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    };
    const iconStyles = {
      textAlign: 'center',
      margin: '15px 10px 10px',
    }
    return (
      <div style={iconGridStyles}>
        {icons.sort(stringSort).map((icon, idx) => (
          <div style={iconStyles} key={idx}>
            <Icon name={icon} title={icon} /><br/>
            {icon}
          </div>
        ))}
      </div>
    )
  }
}
<IconGrid />
```

### Default Size Icon

```jsx
<Icon name="file" title="file" />
```

### Normal Icon with Sizes

```jsx
<Icon name="file" title="file" appearance={{ size: 'tiny' }} />
<Icon name="file" title="file" appearance={{ size: 'small' }} />
<Icon name="file" title="file" appearance={{ size: 'normal' }} />
<Icon name="file" title="file" appearance={{ size: 'medium' }} />
<Icon name="file" title="file" appearance={{ size: 'large' }} />
<Icon name="file" title="file" appearance={{ size: 'huge' }} />
```

### Inverted Icon

```jsx
<div style={{ backgroundColor: 'black', padding: '10px', }}>
  <Icon name="file" title="file" appearance={{ size: 'tiny', theme: 'invert' }} />
  <Icon name="file" title="file" appearance={{ size: 'small', theme: 'invert' }} />
  <Icon name="file" title="file" appearance={{ size: 'normal', theme: 'invert' }} />
  <Icon name="file" title="file" appearance={{ size: 'medium', theme: 'invert' }} />
  <Icon name="file" title="file" appearance={{ size: 'large', theme: 'invert' }} />
  <Icon name="file" title="file" appearance={{ size: 'huge', theme: 'invert' }} />
</div>
```
