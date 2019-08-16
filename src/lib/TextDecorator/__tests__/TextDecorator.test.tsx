/* eslint-env jest */

/* eslint no-underscore-dangle: 0 */

import React from 'react';
import Linkify from 'linkify-it';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
// Testutils has to be imported for test setup purposes, even if we don't need anything
import 'testutils';

import TextDecorator from '../index';

describe('TextDecorator utility', () => {
  test('Uses a linkify-it instance', () => {
    const replacer = new TextDecorator({
      email: true,
    });
    expect(replacer._linkify).toBeInstanceOf(Linkify);
  });
  test('Deactivates unused default linkify schemas', () => {
    const mailReplacer = new TextDecorator({ email: true });
    expect(mailReplacer._linkify.__schemas__['mailto:']).toBeTruthy();
    expect(mailReplacer._linkify.__schemas__['http:']).toBeFalsy();
    const linkReplacer = new TextDecorator({ link: true });
    expect(linkReplacer._linkify.__schemas__['mailto:']).toBeFalsy();
    expect(linkReplacer._linkify.__schemas__['http:']).toBeTruthy();
  });
  test('Load new schemas', () => {
    const SCHEMA = {
      prefix: '---',
      name: 'myschema',
      schema: {
        validate() {
          return 1;
        },
        normalize(match) {
          // eslint-disable-next-line no-param-reassign
          match.url = 'normalized';
        },
      },
    };
    TextDecorator.loadSchema(SCHEMA);
    const replacer = new TextDecorator({
      myschema: (text, normalized) => normalized,
    });
    const decorated = replacer._decorate('---x');
    expect(decorated).toEqual(['normalized']);
  });
  test('Disables ftp schema entirely', () => {
    const replacer = new TextDecorator({ email: true, link: true });
    expect(replacer._linkify.__schemas__['ftp:']).toBeFalsy();
  });
  describe('String decorators', () => {
    const replacer = new TextDecorator({
      link: (text, normalized) => `--${normalized}--`,
      email: (text, normalized) => `++${normalized}++`,
    });
    test('Replacement of http links', () => {
      const decorated = replacer._decorate('Foo http://foo.com');
      expect(decorated).toEqual(['Foo --http://foo.com--']);
    });
    test('Multiple links', () => {
      const decorated = replacer._decorate(
        'Foo http://foo.com Bar http://bar.com',
      );
      expect(decorated).toEqual([
        'Foo --http://foo.com-- Bar --http://bar.com--',
      ]);
    });
    test('Multiple decorators', () => {
      const decorated = replacer._decorate(
        'Foo http://foo.com Bar mailto:bar@baz.com',
      );
      expect(decorated).toEqual([
        'Foo --http://foo.com-- Bar ++mailto:bar@baz.com++',
      ]);
    });
    test('Fuzzy items', () => {
      const decorated = replacer._decorate('Foo foo.com Bar bar@baz.com');
      expect(decorated).toEqual([
        'Foo --http://foo.com-- Bar ++mailto:bar@baz.com++',
      ]);
    });
    test('Overwrite decorators', () => {
      const decorated = replacer._decorate('Foo foo.com Bar bar@baz.com', {
        link: (text, normalized) => `**${normalized}**`,
      });
      expect(decorated).toEqual([
        'Foo **http://foo.com** Bar ++mailto:bar@baz.com++',
      ]);
    });
  });
  describe('Non-string decorators', () => {
    const replacer = new TextDecorator({
      link: (text, normalized) => ({ link: normalized }),
      email: (text, normalized) => ({ email: normalized }),
    });
    test('Replacement of http links', () => {
      const decorated = replacer._decorate('Foo http://foo.com');
      expect(decorated).toEqual(['Foo ', { link: 'http://foo.com' }]);
    });
    test('Multiple links', () => {
      const decorated = replacer._decorate(
        'Foo http://foo.com Bar http://bar.com',
      );
      expect(decorated).toEqual([
        'Foo ',
        { link: 'http://foo.com' },
        ' Bar ',
        { link: 'http://bar.com' },
      ]);
    });
    test('Multiple decorators', () => {
      const decorated = replacer._decorate(
        'Foo http://foo.com Bar mailto:bar@baz.com',
      );
      expect(decorated).toEqual([
        'Foo ',
        { link: 'http://foo.com' },
        ' Bar ',
        { email: 'mailto:bar@baz.com' },
      ]);
    });
  });
  describe('React component text decoration', () => {
    test('Single decoration', () => {
      const replacer = new TextDecorator({
        link: (text, normalized) => <a href={normalized}>{text}</a>,
      });
      const wrapper = shallow(
        <replacer.Decorate>
          Hi google.com CoolCool text hi@ho.de @chmanie @@boss
        </replacer.Decorate>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('Multiple decorations', () => {
      const replacer = new TextDecorator({
        link: (text, normalized) => <a href={normalized}>{text}</a>,
        email: (text, normalized) => <a href={normalized}>Mail to: {text}</a>,
      });
      const wrapper = shallow(
        <replacer.Decorate>
          Hi google.com CoolCool text hi@ho.de @chmanie @@boss
        </replacer.Decorate>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('Overriding decorators', () => {
      const replacer = new TextDecorator({
        link: (text, normalized) => <a href={normalized}>{text}</a>,
      });
      const wrapper = shallow(
        <replacer.Decorate
          decorators={{
            link: (text, normalized) => (
              <a href={normalized} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            ),
          }}
        >
          Hi google.com CoolCool text hi@ho.de @chmanie @@boss
        </replacer.Decorate>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('Overriding tagName, extra props', () => {
      const replacer = new TextDecorator({
        link: (text, normalized) => <a href={normalized}>{text}</a>,
      });
      const wrapper = shallow(
        <replacer.Decorate tagName="div" className="comment">
          Hi google.com CoolCool text hi@ho.de @chmanie @@boss
        </replacer.Decorate>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
