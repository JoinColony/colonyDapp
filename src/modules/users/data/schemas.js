/* @flow */

import * as yup from 'yup';

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  readUntil: yup.string().required(),
  exceptFor: yup.array().of(yup.string().required()),
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
  // TODO: IPFS hash add yup validation for IPFS hash
  data: yup.string().required(),
});
