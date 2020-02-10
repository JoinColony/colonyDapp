/* eslint-env jest */

import React from 'react';
import { Formik } from 'formik';
import toJson from 'enzyme-to-json';

import { mountWithIntl } from '~testutils';

import Radio from '../Radio';

describe('Radio component', () => {
  test('Renders initial component', () => {
    const wrapper = mountWithIntl(
      <Formik initialValues={{}} onSubmit={() => undefined}>
        <Radio
          checked={false}
          name="radioInput"
          help="halp"
          inputId="halpHalp"
          label="awesome"
          value="radioInput"
        />
      </Formik>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
