The OmniPicker allows you to create your own picker ("Combobox") with filters and a dropdown menu with minimal effort. It also takes care of all a11y considerations for you. It's simple enough to get going easily but flexible enough to customise it. The way it works is by subclassing the OmniPicker base class.

### A simple user picker

Here's a super simple implementation of an OmniPicker:

```jsx
const OmniPickerDropdown = require('./OmniPickerDropdown.jsx').default;

class SimpleUserPicker extends OmniPicker {
  onOmniPickerPick(user) {
    this.setState({
      selectedUser: user
    })
  }
  render() {
    const { omniPickerOpen, selectedUser } = this.state;
    return (
      <div {...this.getOmniPickerWrapperProps()}>
        <p>Selected user: {selectedUser ? selectedUser.name : 'No one'}</p>
        <br />
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

You need three elements for the OmniPicker: A wrapper, an input element (could be anything, really), and the `OmniPickerDropdown` which comes with the OmniPicker itself. To get the correct minimal properties of all of these, the OmniPicker base class implements convenience functions for these:

* `getOmniPickerWrapperProps()`
* `getOmniPickerInputProps()`
* `getOmniPickerDropdownProps()`

Additionally to that you need to pass the `ref` of the `input` field to the picker using `ref={this.registerInputNode}` (or in our case `innerRef={registerInputNode}`). That's all you need for a minimal implementation. To hook into certain actions of the picker you can use lifecycle methods with the probably most important one being `onOmniPickerPick(data)`. These functions can be implemented in a subclass and will be called at a particular point in time.

### Lifecycle methods

Here's an overview of all lifecycle methods and their arguments (all of these are optional):

* `onOmniPickerOpen: (() => void)` Is called _after_ the picker was opened
* `onOmniPickerClose: (() => void)` Is called _after_ the picker was closed
* `onOmniPickerReset: (() => void)` Is called when the picker is being reset
* `onOmniPickerPick: ((data: any) => void)` Is called when a data entry was picked
* `onOmniPickerKeyUp: ((evt: SyntheticKeyboardEvent<HTMLElement>) => void)` Passes through the keyUp event from the input field
* `onOmniPickerKeyDown: ((evt: SyntheticKeyboardEvent<HTMLElement>) => void)` Passes through the keyDown event from the input field
* `onOmniPickerChange: ((evt: SyntheticInputEvent<HTMLInputElement>) => void)` Passes through the change event from the input field
* `onOmniPickerBlur: ((evt: SyntheticInputEvent<HTMLInputElement>) => void)` Passes through the blur event from the input field
* `onOmniPickerFocus: ((evt: SyntheticInputEvent<HTMLInputElement>) => void)` Passes through the focus event from the input field
