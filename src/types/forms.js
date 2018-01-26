/* @flow */

import type { FormProps as ReduxFormProps } from 'redux-form';

export type FormProps<CustomProps: {} = Object> = ReduxFormProps & CustomProps;
