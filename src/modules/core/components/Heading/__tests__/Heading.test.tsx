/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { mountWithIntl } from '~testutils';

import Heading from '../Heading';

describe('Heading component', () => {
  const mockTitle = 'Hello Rick';
  test('Renders initial component', () => {
    const wrapper = mountWithIntl(<Heading text={mockTitle} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('Works with MessageDescriptors', () => {
    const wrapper = mountWithIntl(
      <Heading text={{ id: 'rick', defaultMessage: mockTitle }} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('Shows the title value', () => {
    const wrapper = mountWithIntl(<Heading text={mockTitle} />);
    expect(wrapper.html()).toContain(mockTitle);
  });
  test('Has default heading element props', () => {
    const wrapper = mountWithIntl(<Heading text={mockTitle} />);
    expect(wrapper.html()).toContain('<h1');
  });
  test('Correctly generates heading elements', () => {
    /*
     * Huge
     */
    let wrapper = mountWithIntl(
      <Heading appearance={{ size: 'huge' }} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain('<h1');

    /*
     * Large
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'large' }} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain('<h2');

    /*
     * Medium
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'medium' }} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain('<h3');

    /*
     * Normal
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'normal' }} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain('<h4');

    /*
     * Small
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'small' }} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain('<h5');

    /*
     * Tiny
     */
    wrapper = mountWithIntl(
      <Heading appearance={{ size: 'tiny' }} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain('<h6');
  });
  test('Can overwrite the heading element', () => {
    const eliteElement = 'button';
    const wrapper = mountWithIntl(
      <Heading tagName={eliteElement} text={mockTitle} />,
    );
    expect(wrapper.html()).toContain(`<${eliteElement}`);
  });
});
