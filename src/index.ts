import { createElement } from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';

import './styles/main.css';
import './modules/validations';

import App from './App';
import store from '~redux/createReduxStore';
import history from '~redux/history';

const rootNode = document.getElementById('root');

if (rootNode) {
  ReactModal.setAppElement(rootNode);
  render(createElement(App, { store, history }), rootNode);
}

// @ts-ignore
if (module.hot) module.hot.accept();
