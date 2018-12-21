/* @flow */

import generate from 'nanoid/generate';

const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const generateId = () => generate(base58, 21);

export default generateId;
