/* @flow */

import type { ActivityElement } from '~types/index';

export const joinedColonyEvent = (
  colonyName: string = '',
  domainName: string = '',
): ActivityElement => ({
  colonyName,
  domainName,
  createdAt: new Date(),
  userAction: 'joinedColony',
});

export const createdColonyEvent = (colonyName: string): ActivityElement => ({
  colonyName,
  createdAt: new Date(),
  userAction: 'createdColony',
});

export const acceptedTaskEvent = (
  colonyName: string,
  domainName: string,
  acceptedUser: string,
  taskName: string,
): ActivityElement => ({
  colonyName,
  domainName,
  acceptedUser,
  taskName,
  createdAt: new Date(),
  userAction: 'acceptedTask',
});

export const assignedTaskEvent = (
  colonyName: string,
  domainName: string,
  assignedUser: string,
  taskName: string,
): ActivityElement => ({
  colonyName,
  domainName,
  assignedUser,
  taskName,
  createdAt: new Date(),
  userAction: 'assignedTask',
});

export const receivedWorkerRatingEvent = (
  colonyName: string,
  domainName: string,
  numberOfStars: number,
): ActivityElement => ({
  colonyName,
  domainName,
  numberOfStars,
  createdAt: new Date(),
  userAction: 'receivedWorkerRating',
});

export const receivedAdminRatingEvent = (
  colonyName: string,
  domainName: string,
  numberOfStars: number,
): ActivityElement => ({
  colonyName,
  domainName,
  numberOfStars,
  createdAt: new Date(),
  userAction: 'receivedAdminRating',
});

export const taskCommentEvent = (
  colonyName: string,
  domainName: string,
  taskName: string,
): ActivityElement => ({
  colonyName,
  domainName,
  taskName,
  createdAt: new Date(),
  userAction: 'taskComment',
});

export const fileUploadEvent = (
  colonyName: string,
  domainName: string,
  taskName: string,
): ActivityElement => ({
  colonyName,
  domainName,
  taskName,
  createdAt: new Date(),
  userAction: 'fileUpload',
});
