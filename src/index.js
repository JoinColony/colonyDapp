/* @flow */

import { createElement } from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';

import './styles/main.css';
import './modules/validations';

import App from './App.jsx';
import store from './createReduxStore';
import context from './context';

const rootNode = document.getElementById('root');

ReactModal.setAppElement(rootNode);

if (rootNode) {
  render(createElement(App, { store, context }), rootNode);
}
