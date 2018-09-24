/* @flow */

import type { Activity } from '~core/ActivityFeed/types';

const mockActivities: Array<Activity> = [
  {
    id: 1,
    action: 'Assigned',
    date: new Date(2018, 8, 21),
    user: 'chris',
    task: 'Refactor CSS Component',
    organization: 'C21t',
    domainTag: 'Dev',
  },
  {
    id: 2,
    action: 'Commented on',
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  },
  {
    id: 3,
    action: 'Added skill tag to',
    date: new Date(2018, 8, 20),
    task: 'Usability Testing',
    organization: 'C21t',
    domainTag: 'Design',
  },
  {
    id: 4,
    action: 'Commented on',
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  },
  {
    id: 5,
    action: 'Commented on',
    date: new Date(2018, 8, 20),
    task: 'New Website Design',
    organization: 'Zirtual',
    domainTag: 'Design',
  },
  {
    id: 6,
    action: 'Assigned',
    date: new Date(2018, 8, 20),
    user: 'pat',
    task: 'Conduct 5x Interviews',
    organization: 'Colony',
    domainTag: 'Design',
  },
];

export default mockActivities;
