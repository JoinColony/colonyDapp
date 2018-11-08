/* @flow */
/* eslint max-len: 0 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  createdColony: {
    id: 'userActivity.createdColony',
    defaultMessage: 'Created {colonyName}.',
  },
  createdTask: {
    id: 'userActivity.createdTask',
    defaultMessage: 'Created {taskName}.',
  },
  acceptedTask: {
    id: 'userActivity.acceptedTask',
    defaultMessage: 'Accepted {taskName}.',
  },
  assignedTask: {
    id: 'userActivity.assignedTask',
    defaultMessage: 'Assigned @{userName} to {taskName}.',
  },
  receivedWorkerRating: {
    id: 'userActivity.receivedWorkerRating',
    defaultMessage:
      'Recieved {numberOfStars}-star rating for completing taskName.',
  },
  receivedAdminRating: {
    id: 'userActivity.receivedAdminRating',
    defaultMessage:
      'Recieved {numberOfStars}-star rating for completed taskName.',
  },
  taskComment: {
    id: 'userActivity.taskComment',
    defaultMessage: 'Commented on {taskName}.',
  },
  fileUpload: {
    id: 'userActivity.fileUpload',
    defaultMessage: 'Uploaded a file to {taskName}.',
  },
  joinedColony: {
    id: 'userActivity.joinedColony',
    defaultMessage: 'Joined Colony ',
  },
});

export default messages;
