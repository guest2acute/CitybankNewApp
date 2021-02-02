import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import sagas from '../sagas/index';

const composeEnhancers = composeWithDevTools({});

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(sagas);


  return store;
}
