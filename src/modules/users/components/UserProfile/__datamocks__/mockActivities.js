/* @flow */

import { List } from 'immutable';

import { ActivityFeedItem } from '~immutable';

const mockActivities = List.of(
  ActivityFeedItem({
    id: 1,
    actionType: 'assignedUser',
    date: new Date(2018, 8, 21),
    user: 'chris',
    task: 'Refactor CSS Component',
    organization: 'C21t',
    domainTag: 'Dev',
  }),
  ActivityFeedItem({
    id: 2,
    actionType: 'commentedOn',
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  }),
  ActivityFeedItem({
    id: 3,
    actionType: 'addedSkillTag',
    date: new Date(2018, 8, 20),
    task: 'Usability Testing',
    organization: 'C21t',
    domainTag: 'Design',
  }),
  ActivityFeedItem({
    id: 4,
    actionType: 'commentedOn',
    date: new Date(2018, 8, 20),
    task: 'Build Prototype Ideas',
    organization: 'Zirtual',
    domainTag: 'Design',
  }),
  ActivityFeedItem({
    id: 5,
    actionType: 'commentedOn',
    date: new Date(2018, 8, 20),
    task: 'New Website Design',
    organization: 'Zirtual',
    domainTag: 'Design',
  }),
  ActivityFeedItem({
    id: 6,
    actionType: 'assignedUser',
    date: new Date(2018, 8, 20),
    user: 'pat',
    task: 'Conduct 5x Interviews',
    organization: 'Colony',
    domainTag: 'Design',
  }),
);

export default mockActivities;
