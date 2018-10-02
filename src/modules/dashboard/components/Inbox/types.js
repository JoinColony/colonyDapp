/* @flow */
export type InboxAction =
  | 'actionAssignedYouATask'
  | 'actionAsksToConfirmAssignment'
  | 'actionCommentedOn'
  | 'actionAddedSkillTag'
  | 'actionAssignedUser';

export type InboxElement = {
  id: number,
  action: InboxAction,
  task: string,
  domain: string,
  colonyName: string,
  createdAt: Date,
  user: {
    walletAddress: string,
    username: string,
  },
};
