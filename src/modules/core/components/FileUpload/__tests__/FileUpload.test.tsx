/* eslint-env jest */

import React from 'react';
import { Formik } from 'formik';
import toJson from 'enzyme-to-json';

import { mountWithIntl } from '~testutils';

import FileUpload from '../FileUpload';

describe('FileUpload component', () => {
  test('Renders initial component', () => {
    const wrapper = mountWithIntl(
      <Formik initialValues={{}} onSubmit={() => undefined}>
        <FileUpload
          name="fileUpload"
          label="Basic file upload"
          help="Some help text"
          maxFilesLimit={3}
          upload={() => null}
        />
      </Formik>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
