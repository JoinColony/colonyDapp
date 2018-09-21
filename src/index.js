/* @flow */

import { createElement } from 'react';
import { connectRouter } from 'connected-react-router';
import { render } from 'react-dom';
import ReactModal from 'react-modal';

import './styles/main.css';
import './modules/validations';

import App from './App.jsx';
import store from './createReduxStore';
import context from './context';
import history from './history';

const rootNode = document.getElementById('root');

ReactModal.setAppElement(rootNode);

if (rootNode) render(createElement(App, { store, context, history }), rootNode);

if (module.hot) module.hot.accept();
