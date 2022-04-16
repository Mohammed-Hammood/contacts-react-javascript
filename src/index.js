import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter }from "react-router-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './redux/reducers';

const store = createStore(reducers, 
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


const element = document.getElementById("root");
const root = createRoot(element);

root.render(
      <BrowserRouter>
            <Provider store={store}>
                  <App />
            </Provider>
      </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
