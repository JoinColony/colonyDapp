/* eslint-disable no-underscore-dangle */

import Linkify from 'linkify-it';
import React from 'react';

import { Schema } from './types';

export default class TextDecorator {
  static SCHEMAS: { [s: string]: Schema } = {};

  static DECORATOR_MAPPER = {
    'http:': 'link',
    'https:': 'link',
    '//': 'link',
    'mailto:': 'email',
  };

  static loadSchema = (schema: Schema) => {
    TextDecorator.SCHEMAS[schema.name] = schema;
    TextDecorator.DECORATOR_MAPPER[schema.prefix] = schema.name;
  };

  _decorators: any;

  _linkify: any;

  Decorate: any;

  constructor(validDecorators: any = {}) {
    this._decorators = validDecorators;
    this._linkify = new Linkify();
    // Disable ftp links by default
    this._linkify.add('ftp:', null);
    if (!validDecorators.link) {
      this._linkify
        .add('http:', null)
        .add('https:', null)
        .add('//', null);
    }
    if (!validDecorators.email) {
      this._linkify.add('mailto:', null);
    }

    Object.keys(TextDecorator.SCHEMAS).map(key => {
      const schema = TextDecorator.SCHEMAS[key];
      if (validDecorators[schema.name]) {
        this._linkify.add(schema.prefix, schema.schema);
      }
      return key;
    });

    if (Object.keys(this._linkify.__compiled__).length === 1) {
      throw new Error('No decorators defined');
    }
    this.Decorate = this._Decorate.bind(this);
  }

  _processMatch(match: any, decorators: object) {
    const decoratorName =
      TextDecorator.DECORATOR_MAPPER[match.schema || 'http:'];
    const decorator =
      decorators[decoratorName] || this._decorators[decoratorName];
    return typeof decorator === 'function'
      ? decorator(match.text, match.url)
      : match.text;
  }

  _decorate(text: string, decorators: object = {}): string[] {
    const matches = this._linkify.match(text);
    if (!matches) {
      return [text];
    }
    /*
        We assemble an array of mixed type here: strings and other types. Strings will get concatenated, other types will get a new entry
        in the generated array. This is done to be able to map other types to functions or objects (e.g. a react component). The advantage
        here is that we can repalce everything in one go. I'm happy for more performant or better looking alternatives.
        */
    const result: string[] = [''];
    let lastIndex = 0;
    for (let i = 0; i < matches.length; i += 1) {
      const decorated = this._processMatch(matches[i], decorators);
      result[result.length - 1] += text.slice(lastIndex, matches[i].index);
      if (typeof decorated === 'string') {
        result[result.length - 1] += decorated;
      } else {
        result.push(decorated);
        result.push('');
      }
      ({ lastIndex } = matches[i]);
    }
    result[result.length - 1] += text.slice(lastIndex, text.length);
    return result.filter(identity => !!identity);
  }

  _Decorate({ children, tagName = 'span', decorators, ...props }: any) {
    return React.createElement(
      tagName,
      props,
      ...this._decorate(children, decorators),
    );
  }
}
