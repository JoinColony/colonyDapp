/* @flow */
/* eslint max-len: 0 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  createdColony: {
    id: 'dashboard.UserActivity.createdColony',
    defaultMessage: 'Created {colonyName}.',
  },
  createdTask: {
    id: 'dashboard.UserActivity.createdTask',
    defaultMessage: 'Created {taskName}.',
  },
  acceptedTask: {
    id: 'dashboard.UserActivity.acceptedTask',
    defaultMessage: 'Accepted {taskName}.',
  },
  assignedTask: {
    id: 'dashboard.UserActivity.assignedTask',
    defaultMessage: 'Assigned @{userName} to {taskName}.',
  },
  receivedWorkerRating: {
    id: 'dashboard.UserActivity.receivedWorkerRating',
    defaultMessage:
      'Received {numberOfStars}-star rating for completing taskName.',
  },
  receivedAdminRating: {
    id: 'dashboard.UserActivity.receivedAdminRating',
    defaultMessage:
      'Received {numberOfStars}-star rating for completed taskName.',
  },
  taskComment: {
    id: 'dashboard.UserActivity.taskComment',
    defaultMessage: 'Commented on {taskName}.',
  },
  fileUpload: {
    id: 'dashboard.UserActivity.fileUpload',
    defaultMessage: 'Uploaded a file to {taskName}.',
  },
  joinedColony: {
    id: 'dashboard.UserActivity.joinedColony',
    defaultMessage: 'Joined Colony',
  },
  walletTransfer: {
    id: 'dashboard.UserActivity.walletTransfer',
    defaultMessage: '@{username} sent you {amount}',
  },
});
export default messages;
