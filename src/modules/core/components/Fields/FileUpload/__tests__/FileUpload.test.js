/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import FileUpload from '../FileUpload.jsx';

describe('FileUpload component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(
      <FileUpload
        name="fileUpload"
        connect={false}
        label="Basic file upload"
        help="Some help text"
        maxFilesLimit={3}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
