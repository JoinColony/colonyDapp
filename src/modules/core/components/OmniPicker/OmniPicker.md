The OmniPicker allows you to create your own picker ("Combobox") with filters and a dropdown menu with minimal effort. It also takes care of all a11y considerations for you. It's simple enough to get going easily but flexible enough to customise it. The way it works is by subclassing the OmniPicker base class.

### A simple user picker

Here's a super simple implementation of an OmniPicker:

```jsx
const OmniPickerDropdown = require('./OmniPickerDropdown.jsx').default;

class SimpleUserPicker extends OmniPicker {
  onDataSelect(user) {
    this.setState({
      selectedUser: user
    })
  }
  render() {
    const { omniPickerOpen, selectedUser } = this.state;
    return (
      <div {...this.getOmniPickerWrapperProps()}>
        <Input
          label="Pick a user"
          connect={false}
          innerRef={this.registerInputNode}
          placeholder="Filter here"
          {...this.getOmniPickerInputProps()}
        />
        {omniPickerOpen && (
          <OmniPickerDropdown
            {...this.getOmniPickerDropdownProps()}
          />
        )}
        <p>Selected user: {selectedUser ? selectedUser.name : 'No one'}</p>
      </div>
    );
  }
}

const data = [
  { id: 1, username: 'Chris', name: 'Christian Maniewski'},
  { id: 2, username: 'Elena', name: 'Elena Dimitrova'},
  { id: 3, username: 'Thiago', name: 'Thiago Delgado'},
  { id: 4, username: 'Alex', name: 'Alex Rea'},
  { id: 5, username: 'Collin', name: 'Collin Vine'},
];

const filter = (data, filterValue) => data.filter(user => user.username.toLowerCase().startsWith(filterValue.toLowerCase()));

const Item = ({ itemData: { username, name }, selected }) => (
  <div style={{ backgroundColor: selected ? '#e7e8e8' : 'transparent', padding: '20px'}}>
    Username: {username}<br />
    Name: {name}
  </div>
);

<SimpleUserPicker data={data} filter={filter} itemComponent={Item} />
```
