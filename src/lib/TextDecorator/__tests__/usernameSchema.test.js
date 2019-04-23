/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */

import TextDecorator from '../index';

describe('username TextDecorator schema', () => {
  const replacer = new TextDecorator({
    username: text => ({ username: text }),
  });
  test('Parse username', () => {
    const decorated = replacer._decorate('@username');
    expect(decorated).toEqual([{ username: '@username' }]);
  });
  test('Parse multiple usernames', () => {
    const decorated = replacer._decorate('@username @other');
    expect(decorated).toEqual([
      { username: '@username' },
      ' ',
      { username: '@other' },
    ]);
  });
  test('Parse multiple usernames/text combination', () => {
    const decorated = replacer._decorate('hi @username ho @other');
    expect(decorated).toEqual([
      'hi ',
      { username: '@username' },
      ' ho ',
      { username: '@other' },
    ]);
  });
  test('Even more combinations', () => {
    const decorated = replacer._decorate('@test3 hallo @test4 @test2');
    expect(decorated).toEqual([
      { username: '@test3' },
      ' hallo ',
      { username: '@test4' },
      ' ',
      { username: '@test2' },
    ]);
  });
  test('Does not parse double prefixed', () => {
    const decorated = replacer._decorate('@@test3');
    expect(decorated).toEqual(['@@test3']);
  });
  test('Does not interfere with email', () => {
    const emailReplacer = new TextDecorator({
      username: text => ({ username: text }),
      email: true,
    });
    const decorated = emailReplacer._decorate(
      'hi @username, send me an email: foo@bar.com',
    );
    expect(decorated).toEqual([
      'hi ',
      { username: '@username' },
      ', send me an email: foo@bar.com',
    ]);
  });
  test('Parse multiple usernames on multiple lines', () => {
    const decorated = replacer._decorate(
      'hey there @you\n how are you doing today @moo ?',
    );
    expect(decorated).toEqual([
      'hey there ',
      { username: '@you' },
      '\n how are you doing today ',
      { username: '@moo' },
      ' ?',
    ]);
  });
  test('Username contains ? or !, parse only username', () => {
    const decorated = replacer._decorate('Wazzap @you! How is @ginny?');
    expect(decorated).toEqual([
      'Wazzap ',
      { username: '@you' },
      '! How is ',
      { username: '@ginny' },
      '?',
    ]);
  });
  test('Do not parse if username contains unallowed special chars', () => {
    const decorated = replacer._decorate('Hello @username$%^&*()');
    expect(decorated).toEqual(['Hello @username$%^&*()']);
  });
  test('Parse usename with dots and dashes', () => {
    const decorated = replacer._decorate(
      'Hello @malcolm.reynolds, how is @innara-serra?',
    );
    expect(decorated).toEqual([
      'Hello ',
      { username: '@malcolm.reynolds' },
      ', how is ',
      { username: '@innara-serra' },
      '?',
    ]);
  });
  test('Mention comment can start with a space', () => {
    const decorated = replacer._decorate(' @username');
    expect(decorated).toEqual([' ', { username: '@username' }]);
  });
  test('Mention comment can start with a new line', () => {
    const decorated = replacer._decorate('\n@username');
    expect(decorated).toEqual(['\n', { username: '@username' }]);
  });
  test('Mentions parse correctly with two new lines between usernames', () => {
    const decorated = replacer._decorate('@mal\n\n@wash');
    expect(decorated).toEqual([
      { username: '@mal' },
      '\n\n',
      { username: '@wash' },
    ]);
  });
  test('Mention comment can end with a new line', () => {
    const decorated = replacer._decorate('@this-is-the-end\n');
    expect(decorated).toEqual([{ username: '@this-is-the-end' }, '\n']);
  });
});
