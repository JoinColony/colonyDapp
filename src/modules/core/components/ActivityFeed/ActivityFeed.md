
### Activity Feed

```jsx
const { List } = require('immutable');
const { ActivityFeedItemRecord } = require('~immutable');

const activityItems = List.of(
  ActivityFeedItemRecord({
    id: 1,
    actionType: 'ASSIGNED_USER',
    date: new Date(2018, 8, 21),
    user: 'chris',
    task: 'Refactor CSS Component',
    organization: 'C21t',
    domainTag: 'Dev',
  }),
  ActivityFeedItemRecord({
    id: 2,
    actionType: 'COMMENDTED_ON',
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  }),
  ActivityFeedItemRecord({
    id: 3,
    actionType: 'ADDED_SKILL_TAG',
    date: new Date(2018, 8, 20),
    task: 'Usability Testing',
    organization: 'C21t',
    domainTag: 'Design',
  }),
);

<ActivityFeed activities={activityItems} />
```
