
### Activity Feed

```jsx
const { List } = require('immutable');
const { ActivityFeedItemRecord, ActivityActions } = require('~immutable');

const activityItems = List.of(
  new ActivityFeedItemRecord({
    id: 1,
    actionType: ActivityActions.ASSIGNED_USER,
    date: new Date(2018, 8, 21),
    user: 'chris',
    task: 'Refactor CSS Component',
    organization: 'C21t',
    domainTag: 'Dev',
  }),
  new ActivityFeedItemRecord({
    id: 2,
    actionType: ActivityActions.COMMENTED_ON,
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  }),
  new ActivityFeedItemRecord({
    id: 3,
    actionType: ActivityActions.ADDED_SKILL_TAG,
    date: new Date(2018, 8, 20),
    task: 'Usability Testing',
    organization: 'C21t',
    domainTag: 'Design',
  }),
);

<ActivityFeed activities={activityItems} />
```
