
```jsx
const {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} = require('.');
<Table striped>
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