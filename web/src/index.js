import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import * as actions from './actions/index';
import * as storeActions from './store';


const store = configureStore();


// load resources and stored graphs
const authStorage = localStorage.getItem('auth') || false;
const auth = authStorage ? JSON.parse(authStorage) : false;
console.info(auth);
if (auth) {
    console.info("now we are logged in -> so load the assets!");
    store.dispatch(storeActions.loginSuccess(auth));
    store.dispatch(actions.loadAllMappings());
    store.dispatch(storeActions.loadAllResources());
    store.dispatch(storeActions.loadAllTags());
}



console.group("Environment");
console.info(process.env);
console.info(Object.keys(process.env));
console.info(process.env.MESSAGE)
console.groupEnd();


// configure application here based on the environment variables

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
