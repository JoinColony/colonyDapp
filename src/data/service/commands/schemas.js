/* @flow */
import type { ValidateOptions, Schema } from 'yup';

import * as yup from 'yup';

export const validate = (schema: Schema) => async (
  value: {},
  options?: ValidateOptions = { strict: true },
) => schema.validate(value, options);

export const CreateColonyCommandArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
  ensName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
  token: yup.object({
    address: yup.string().address(),
    icon: yup.string(),
    name: yup.string(),
    symbol: yup.string(),
  }),
});

export const UpdateColonyProfileCommandArgsSchema = yup.object({
  ensName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const CreateDomainCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
});

export const UploadColonyAvatarCommandArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
  avatar: yup.string().required(),
});

export const RemoveColonyAvatarCommandArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
});

export const SetTaskDueDateCommandArgsSchema = yup.object({
  dueDate: yup.date(),
  taskId: yup.string().required(),
});

export const SetTaskSkillCommandArgsSchema = yup.object({
  skillId: yup.string().required(),
  taskId: yup.string().required(),
});

export const CreateTaskDraftCommandArgsSchema = yup.object({
  creator: yup.string().required(),
  meta: yup.string(),
  domainId: yup.number().required(),
  draftId: yup.string().required(),
  specificationHash: yup.string(),
  taskId: yup.string().required(),
  title: yup.string(),
});

export const UpdateTaskDraftCommandArgsSchema = yup.object({
  specificationHash: yup.string(),
  meta: yup.string(),
  title: yup.string(),
});

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  watermark: yup.string().required(),
  exceptFor: yup.array.of(yup.string.required()),
});
