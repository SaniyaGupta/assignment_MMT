import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import  { logger } from 'redux-logger';
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux'
import { AppContainer } from 'react-hot-loader';
import App from './containers/App/index';

const middlewares=[thunk,logger]
const store = createStore(rootReducer, applyMiddleware(...middlewares))

const renderApp = Component => {

    ReactDOM.render(
        <Provider store={store}>
                <AppContainer>
                    <Component />
                </AppContainer>
        </Provider>
        , document.getElementById('root'));
};

renderApp(App);
if (module.hot) {
    module.hot.accept('./containers/App', () => renderApp(App));
}
