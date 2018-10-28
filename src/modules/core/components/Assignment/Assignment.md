```
const { Formik } = require('formik');
 const { ItemDefault } = require('.')
 const data = [
  { id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2', username: 'Chris', fullName: 'Christian Maniewski'},
  { id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d', username: 'Elena', fullName: 'Elena Dimitrova'},
  { id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212', username: 'Thiago', fullName: 'Thiago Delgado'},
  { id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A', username: 'Alex', fullName: 'Alex Rea'},
  { id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A', username: 'Collin', fullName: 'Collin Vine'},
];

 const filter = (data, filterValue) => data.filter(user => user.username.toLowerCase().startsWith(filterValue.toLowerCase()));
 const ItemWithAddress = (props) => <ItemDefault showAddress {...props} />;
const ItemWithMakedAddress = (props) => <ItemDefault showMaskedAddress {...props} />;
const ItemWithCurrentUser = (props) => <ItemDefault currentUserId={data[1].id} {...props} />;
 <Formik>
  <div>
    <Heading appearance={{ size: "medium" }}>Assignment </Heading>
    <Assignment
      name="AssignmentDefault"
      label="Assignment and Funding"
      itemComponent={ItemDefault}
      data={data}
      filter={filter}
    />
    <br />
  </div>
</Formik>
```