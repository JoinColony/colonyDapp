/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '$utils/test';

import Cleave from 'cleave.js/react';
import Input from '../Input.jsx';
import InputLabel from '../../InputLabel';

jest.mock('../../InputLabel');

describe('Input', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl((
      <Input
        value=""
        type="text"
        placeholder="Name"
        input={{}}
        inputProps={{ id: 'blah' }}
        passthroughProps={{ formattingOptions: { initValue: 'none' } }}
        meta={{ active: false }}
        title="Invitee's name"
        label="Invitee's name"
        elementOnly={false}
        hasError={false}
        data-wd-hook="invite-name"
      />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('If elementOnly and no formatting options, InputLabel and Cleave are not rendered', () => {
    const wrapper = shallowWithIntl((
      <Input
        name="name"
        value=""
        type="text"
        placeholder="Name"
        input={{}}
        inputProps={{}}
        passthroughProps={{}}
        meta={{ active: false }}
        title="Invitee's name"
        label="Invitee's name"
        elementOnly
      />
    ));
    expect(wrapper.find(Cleave)).not.toBePresent();
    expect(wrapper.find(InputLabel)).not.toBePresent();
  });
});
