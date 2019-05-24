/* @flow */

import * as yup from 'yup';

import inboxMessages from '~users/Inbox/messages';

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  readUntil: yup.string().required(),
  exceptFor: yup.array().of(yup.string().required()),
  id: yup.string(),
});

export const UserUpdateTokensCommandArgsSchema = yup.object({
  tokens: yup.array().of(yup.string()),
});

export const CreateUserProfileCommandArgsSchema = yup.object({
  username: yup.string().required(),
});

export const UpdateUserProfileCommandArgsSchema = yup.object({
  bio: yup.string(),
  displayName: yup.string(),
  location: yup.string(),
  website: yup.string(),
});

export const SetUserAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup
    .string()
    .cid()
    .required(),
});

export const createCommentMentionInboxEventSchema = yup.object({
  event: yup.string().oneOf(Object.keys(inboxMessages)),
  user: yup.string(),
  task: yup.string(),
  comment: yup.string(),
  colony: yup.string(),
});
