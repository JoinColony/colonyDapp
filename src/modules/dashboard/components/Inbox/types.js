/* @flow */
export type InboxAction =
  | 'assignedYouATask'
  | 'asksToConfirmAssignment'
  | 'commentedOn'
  | 'addedSkillTag'
  | 'assignedUser';

export type ActionType = 'action' | 'notification';

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
  unread: boolean,
  type: ActionType,
};
