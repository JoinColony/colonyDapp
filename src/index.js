/* @flow */

import { createElement } from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';

import './styles/main.css';
import './modules/validations';

import App from './App.jsx';
import store from './createReduxStore';
import history from './history';

import registerIPFSSW from './workers/ipfs';

registerIPFSSW().then(w => console.log(w), err => console.error(err));

const rootNode = document.getElementById('root');

ReactModal.setAppElement(rootNode);

if (rootNode) render(createElement(App, { store, history }), rootNode);

// $FlowFixMe
if (module.hot) module.hot.accept();
