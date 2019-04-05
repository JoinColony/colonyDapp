```jsx
import { Formik } from 'formik';
import Heading from '../Heading';
import UserAvatar from '../UserAvatar'

const { ItemDefault } = require('.')

const data = [
  {
    id: 1,
    profile: {
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski'
    }
  },
  {
    id: 2,
    profile: {
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova'
    }
  },
  {
    id: 3,
    profile: {
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado'
    }
  },
  {
    id: 4,
    profile: {
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea'
    }
  },
  {
    id: 5,
    profile: {
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine'
    }
  },
];

const filter = (data, filterValue) => {
  const result = data.filter(user => user.profile.username.toLowerCase().startsWith(filterValue.toLowerCase()));
  if (!filterValue) return result;

  return [{
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    }
  }].concat(result);
}

const ItemWithAddress = (props) => <ItemDefault showAddress {...props} />;
const ItemWithMakedAddress = (props) => <ItemDefault showMaskedAddress {...props} />;
const ItemWithCurrentUser = (props) => <ItemDefault currentUserId={data[1].id} {...props} />;

const renderAvatar = (address) => <UserAvatar address={address} />;

<Formik>
  <div>
    <Heading appearance={{ size: "medium" }}>Default item</Heading>
    <SingleUserPicker
      name="singleuserpickerDefault"
      label="Pick user"
      itemComponent={ItemDefault}
      data={data}
      filter={filter}
      renderAvatar={renderAvatar}
    />
    <br />
    <Heading appearance={{ size: "medium" }}>With address</Heading>
    <SingleUserPicker
      name="singleuserpickerAddress"
      label="Pick user"
      itemComponent={ItemWithAddress}
      data={data}
      filter={filter}
      renderAvatar={renderAvatar}
    />
    <Heading appearance={{ size: "medium" }}>With masked address</Heading>
    <SingleUserPicker
      name="singleuserpickerAddressMasked"
      label="Pick user"
      itemComponent={ItemWithMakedAddress}
      data={data}
      filter={filter}
      renderAvatar={renderAvatar}
    />
    <br />
    <Heading appearance={{ size: "medium" }}>Showing the current user</Heading>
    <SingleUserPicker
      name="singleuserpickerCurrentUser"
      label="Pick user"
      itemComponent={ItemWithCurrentUser}
      data={data}
      filter={filter}
      renderAvatar={renderAvatar}
    />
    <br />
    <Heading appearance={{ size: "medium" }}>Disabled</Heading>
    <SingleUserPicker
      name="singleuserpickerDisabled"
      label="Pick user"
      itemComponent={ItemWithAddress}
      data={data}
      disabled
      filter={filter}
      renderAvatar={renderAvatar}
    />
  </div>
</Formik>
```
