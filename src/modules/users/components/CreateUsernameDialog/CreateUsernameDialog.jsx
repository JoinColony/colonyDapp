/* @flow */

// import type { FormikProps } from 'formik';

import React, { Component } from 'react';

import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

// type FormValues = {
//   username: string,
// };

type Props = {
  cancel: () => void,
  close: () => void,
};

class CreateUsernameDialog extends Component<Props> {
  doStuff = () => {};

  render() {
    const { cancel, close } = this.props;
    return (
      <Dialog cancel={cancel} close={close}>
        <ActionForm
          submit="foo"
          success="bar"
          error="baz"
          initialValues={{}}
          validationSchema={{}}
        >
          <DialogSection>Foo</DialogSection>
        </ActionForm>
      </Dialog>
    );
  }
}

export default CreateUsernameDialog;
