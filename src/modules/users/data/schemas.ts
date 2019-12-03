import * as yup from 'yup';

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  readUntil: yup.number().required(),
  exceptFor: yup.array().of(yup.string().required()),
});

export const UserUpdateTokensCommandArgsSchema = yup.object({
  tokens: yup.array().of(yup.string()),
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
