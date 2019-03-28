
### Basic Table

```jsx
const {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} = require('.');
<Table>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Some Header</TableHeaderCell>
      <TableHeaderCell>Another Header</TableHeaderCell>
      <TableHeaderCell>And Another Header</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Some content</TableCell>
      <TableCell>More content</TableCell>
      <TableCell>Different content</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>2 Some content</TableCell>
      <TableCell>2 More content</TableCell>
      <TableCell>2 Different content</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table, scrollable, with dark theme

```jsx
const {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} = require('.');
<div style={{ height: '200px' }}>
  <Table appearance={{ theme: 'dark', separators: 'rows' }} scrollable>
    <TableHeader>
      <TableRow>
        <TableHeaderCell width="33%">Some Header</TableHeaderCell>
        <TableHeaderCell width="33%">Another Header</TableHeaderCell>
        <TableHeaderCell width="33%">And Another Header</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell width="33%">Some content</TableCell>
        <TableCell width="33%">More content</TableCell>
        <TableCell width="33%">Different content</TableCell>
      </TableRow>
      <TableRow>
        <TableCell width="33%">2 Some content</TableCell>
        <TableCell width="33%">2 More content</TableCell>
        <TableCell width="33%">2 Different content</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```
