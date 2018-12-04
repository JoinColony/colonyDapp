```
const { Formik } = require('formik');

const { ItemDefault } = require('.')

const data = [
  { walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2', username: 'Chris', displayName: 'Christian Maniewski'},
  { walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d', username: 'Elena', displayName: 'Elena Dimitrova'},
  { walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212', username: 'Thiago', displayName: 'Thiago Delgado'},
  { walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A', username: 'Alex', displayName: 'Alex Rea'},
  { walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A', username: 'Collin', displayName: 'Collin Vine'},
];

const filter = (data, filterValue) => data.filter(user => user.username.toLowerCase().startsWith(filterValue.toLowerCase()));

const ItemWithAddress = (props) => <ItemDefault showAddress {...props} />;
const ItemWithMakedAddress = (props) => <ItemDefault showMaskedAddress {...props} />;
const ItemWithCurrentUser = (props) => <ItemDefault currentUserId={data[1].id} {...props} />;

<Formik>
  <div>
    <Heading appearance={{ size: "medium" }}>Default item</Heading>
    <SingleUserPicker
      name="singleuserpickerDefault"
      label="Pick user"
      itemComponent={ItemDefault}
      data={data}
      filter={filter}
    />
    <br />
    <Heading appearance={{ size: "medium" }}>With address</Heading>
    <SingleUserPicker
      name="singleuserpickerAddress"
      label="Pick user"
      itemComponent={ItemWithAddress}
      data={data}
      filter={filter}
    />
    <Heading appearance={{ size: "medium" }}>With masked address</Heading>
    <SingleUserPicker
      name="singleuserpickerAddressMasked"
      label="Pick user"
      itemComponent={ItemWithMakedAddress}
      data={data}
      filter={filter}
    />
    <br />
    <Heading appearance={{ size: "medium" }}>Showing the current user</Heading>
    <SingleUserPicker
      name="singleuserpickerCurrentUser"
      label="Pick user"
      itemComponent={ItemWithCurrentUser}
      data={data}
      filter={filter}
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
    />
  </div>
</Formik>
```
