/* @flow */
export type InboxAction =
  | 'assignedYouATask'
  | 'asksToConfirmAssignment'
  | 'commentedOn'
  | 'addedSkillTag'
  | 'assignedUser';

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
