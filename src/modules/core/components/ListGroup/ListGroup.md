A flexible list element. List items can be directly adjacent to one another, or they can be separated by a gap.

## Standard List Group

```tsx
import ListGroupItem from './ListGroupItem';

<ListGroup>
  <ListGroupItem appearance={{ padding: 'medium' }}>One</ListGroupItem>
  <ListGroupItem appearance={{ padding: 'medium' }}>Two</ListGroupItem>
</ListGroup>
```

### List Group with Gaps

```tsx
import ListGroupItem from './ListGroupItem';

<ListGroup appearance={{ gaps: 'true' }}>
  <ListGroupItem appearance={{ padding: 'medium' }}>One</ListGroupItem>
  <ListGroupItem appearance={{ padding: 'medium' }}>Two</ListGroupItem>
</ListGroup>
```

### List Group with custom styles & click handler

```tsx
import ListGroupItem from './ListGroupItem';

const handleClick = (num) => {
  alert(`Row ${num} clicked!`);
};

const itemStyle = {
  cursor: 'pointer',
  padding: '40px',
};

<ListGroup>
  <ListGroupItem onClick={() => handleClick(1)} style={itemStyle}>One</ListGroupItem>
  <ListGroupItem onClick={() => handleClick(2)} style={itemStyle}>Two</ListGroupItem>
</ListGroup>
```
