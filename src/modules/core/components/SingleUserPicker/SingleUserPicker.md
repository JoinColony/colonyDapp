```

const Item = ({ itemData: { username, name }, selected }) => (
  <div style={{ backgroundColor: selected ? '#e7e8e8' : 'transparent', padding: '20px'}}>
    Username: {username}<br />
    Name: {name}
  </div>
);

const data = [
  { id: 1, username: 'Chris', fullName: 'Christian Maniewski'},
  { id: 2, username: 'Elena', fullName: 'Elena Dimitrova'},
  { id: 3, username: 'Thiago', fullName: 'Thiago Delgado'},
  { id: 4, username: 'Alex', fullName: 'Alex Rea'},
  { id: 5, username: 'Collin', fullName: 'Collin Vine'},
];

const filter = (data, filterValue) => data.filter(user => user.username.toLowerCase().startsWith(filterValue.toLowerCase()));

<SingleUserPicker label="Pick user" connect={false} itemComponent={Item} data={data} filter={filter} />
```
