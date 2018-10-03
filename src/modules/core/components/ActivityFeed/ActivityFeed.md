
### Activity Feed

```jsx
const activityItems = [
  {
    id: 1,
    actionType: 'assignedUser',
    date: new Date(2018, 8, 21),
    user: 'chris',
    task: 'Refactor CSS Component',
    organization: 'C21t',
    domainTag: 'Dev',
  },
  {
    id: 2,
    actionType: 'commentedOn',
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  },
  {
    id: 3,
    actionType: 'addedSkillTag',
    date: new Date(2018, 8, 20),
    task: 'Usability Testing',
    organization: 'C21t',
    domainTag: 'Design',
  },
];
<ActivityFeed activities={activityItems} />
```