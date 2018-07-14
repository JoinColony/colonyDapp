/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl, mountWithIntl } from '~utils/test';

import Heading from '../Heading.jsx';

describe('Heading component', () => {
  const mockTitle = 'Hello Rick';
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(<Heading text={mockTitle} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('Works with MessageDescriptors', () => {
    const wrapper = shallowWithIntl(
      <Heading text={{ id: 'rick', defaultMessage: mockTitle }} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('Shows the title value', () => {
    const wrapper = shallowWithIntl(<Heading text={mockTitle} />);
    expect(wrapper.find('h3').prop('title')).toEqual(mockTitle);
    expect(wrapper.children().text()).toEqual(mockTitle);
  });
  test('Has default heading element props', () => {
    const wrapper = mountWithIntl(<Heading text={mockTitle} />);
    expect(wrapper.find('h3')).toHaveLength(1);
  });
  test('Correctly generates heading elements', () => {
    /*
     * Huge
     */
    let wrapper = mountWithIntl(
      <Heading appearance={{ size: 'large' }} text={mockTitle} />,
    );
    expect(wrapper.find('h1')).toHaveLength(1);
    /*
     * Thin
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'mediumL' }} text={mockTitle} />,
    );
    expect(wrapper.find('h2')).toHaveLength(1);
    /*
     * Large
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'medium' }} text={mockTitle} />,
    );
    expect(wrapper.find('h3')).toHaveLength(1);
    /*
     * Medium
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'normal' }} text={mockTitle} />,
    );
    expect(wrapper.find('h4')).toHaveLength(1);
    /*
     * Small
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'small' }} text={mockTitle} />,
    );
    expect(wrapper.find('h5')).toHaveLength(1);
    /*
     * Tiny
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'tiny' }} text={mockTitle} />,
    );
    expect(wrapper.find('h6')).toHaveLength(1);
  });
  test('Can overwrite the heading element', () => {
    const eliteElement = 'h1337';
    const wrapper = shallowWithIntl(
      <Heading tagName={eliteElement} text={mockTitle} />,
    );
    expect(wrapper.find(eliteElement)).toHaveLength(1);
  });
  test('Can overwrite the className', () => {
    const className = 'hardCodedStyles';
    const wrapper = shallowWithIntl(
      <Heading className={className} text={mockTitle} />,
    );
    expect(wrapper.props().className).toEqual(className);
  });
});
