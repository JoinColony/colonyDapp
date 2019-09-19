import * as yup from 'yup';

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  readUntil: yup.number().required(),
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
  website: yup.string().url(),
});

export const SetUserAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup
    .string()
    // @ts-ignore
    .cid()
    .required(),
});

export const CreateCommentMentionCommandArgsSchema = yup.object({
  colonyAddress: yup.string(),
  draftId: yup.string(),
  taskTitle: yup.string(),
  comment: yup.string(),
  sourceUserAddress: yup.string(),
});

export const CreateAssignedCommandArgsSchema = yup.object({
  colonyAddress: yup.string(),
  draftId: yup.string(),
  taskTitle: yup.string(),
  sourceUserAddress: yup.string(),
});

export const CreateUnassignedCommandArgsSchema = yup.object({
  colonyAddress: yup.string(),
  draftId: yup.string(),
  taskTitle: yup.string(),
  sourceUserAddress: yup.string(),
});

export const CreateWorkRequestCommandArgsSchema = yup.object({
  colonyAddress: yup.string(),
  draftId: yup.string(),
  taskTitle: yup.string(),
  sourceUserAddress: yup.string(),
});

export const CreateFinalizedCommandArgsSchema = yup.object({
  colonyAddress: yup.string(),
  draftId: yup.string(),
  taskTitle: yup.string(),
  sourceUserAddress: yup.string(),
});
