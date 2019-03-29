The OmniPicker allows you to create your own picker ("Combobox") with filters and a dropdown menu with minimal effort. It also takes care of all a11y considerations for you. It's simple enough to get going easily but flexible enough to customise it. The way it works is by subclassing the OmniPicker base class.

### A simple user picker

Here's a super simple implementation of an OmniPicker:

```jsx
import { Input } from '../Fields';

const { withOmniPicker } = require('.');

const Item = ({ itemData: { username, name }, selected }) => (
  <div style={{ backgroundColor: selected ? '#e7e8e8' : 'transparent', padding: '20px'}}>
    Username: {username}<br />
    Name: {name}
  </div>
);

const renderItem = (itemData, selected) => <Item itemData={itemData} selected={selected} />;

class SimpleUserPicker extends React.Component {
  constructor(props) {
    super(props);
    this.setUser = this.setUser.bind(this);
    this.state = {
      selectedUser: null,
    };
  }

  setUser(user) {
    this.setState({ selectedUser: user });
  };

  render() {
    const { OmniPicker, inputProps, registerInputNode, OmniPickerWrapper } = this.props;
    const { selectedUser } = this.state;
    return (
      <OmniPickerWrapper style={{ position: 'relative' }}>
        <p>Selected user: {selectedUser ? selectedUser.name : 'No one'}</p>
        <br />
        <Input
          label="Pick a user"
          connect={false}
          innerRef={registerInputNode}
          placeholder="Filter here"
          {...inputProps}
        />
        <OmniPicker onPick={this.setUser} renderItem={renderItem} />
      </OmniPickerWrapper>
    )
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

const WrappedUserPicker = withOmniPicker()(SimpleUserPicker);

<WrappedUserPicker data={data} filter={filter} itemComponent={Item} />
```

You need three elements for the OmniPicker: The `OmniPickerWrapper` the `OmniPicker` itself and an input element (could be anything, really). The former two are injected by `withOmniPicker`. To get the correct props for your input field and to wire it up to the OmniPicker please pass the `inputProps` down to it as shown in the example.

Additionally to that you need to pass the `ref` of the `input` field to the picker using `ref={this.registerInputNode}` (or in our case `innerRef={registerInputNode}`). That's all you need for a minimal implementation. To hook into certain actions of the picker you can add properties to the `OmniPicker` element as seen above. For an overview of all methods that can be used take a look in the `OmniPicker` props docs.
