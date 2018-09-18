
### Dropdown Menu

```jsx
const {
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSection
} = require('.');
<div style={{ maxWidth: '400px' }}>
  <DropdownMenu>
    <DropdownMenuSection>
      <DropdownMenuHeader>
        This is a dropdown menu header
      </DropdownMenuHeader>
    </DropdownMenuSection>

    <DropdownMenuSection>
      <DropdownMenuItem>
        <a href="/">Some Menu Item</a>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <a href="/">Another Menu Item</a>
      </DropdownMenuItem>
    </DropdownMenuSection>

    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <a href="/">
          This child has<br />multiple rows of text
        </a>
      </DropdownMenuItem>
    </DropdownMenuSection>
  </DropdownMenu>
</div>
```

### Dropdown dark theme
```jsx
const {
  DropdownMenuItem,
  DropdownMenuSection
} = require('.');

<div style={{ maxWidth: '400px' }}>
  <DropdownMenu appearance={{ theme: 'dark' }}>
    <DropdownMenuSection>
      <DropdownMenuItem>
        <a href="/">Some Menu Item</a>
      </DropdownMenuItem>
    </DropdownMenuSection>

    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <a href="/">Another Menu Section with an Item</a>
      </DropdownMenuItem>
    </DropdownMenuSection>
  </DropdownMenu>
</div>
```