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

### Icons

```jsx
<Icon name="file" title="file" />
```
