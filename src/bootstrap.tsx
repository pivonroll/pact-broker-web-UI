import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './app/App';
import { Provider } from 'react-redux';
import store from './app/store/store';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find the root element');
const reactRoot = ReactDOM.createRoot(rootElement);

reactRoot.render(
    <Provider store={store}>
        <App />
    </Provider>
);
