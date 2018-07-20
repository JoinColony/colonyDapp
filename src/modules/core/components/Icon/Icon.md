### All Icons

```jsx noeditor
const { icons } = require('./icons.json');
const iconStyle = {
  float: 'left',
  height: '70px',
  width: '20%',
  textAlign: 'center',
}
const stringSort = (a, b) => {
  if(a<b) {
    return -1
  } else if(a>b) {
    return +1
  }
  return 0
}
icons.sort(stringSort).map((icon, idx) => (
  <div style={iconStyle} key={idx}>
    <Icon name={icon} title={icon} /><br/>
    {icon}
  </div>
));
```

```jsx noeditor
<div style={{clear: 'both'}} />
```

### Icons

```jsx
<Icon name="file" title="file" />
```
