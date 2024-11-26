import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import orderReducer from '../reducers/orderbook';
import orderBookSaga from '../saga';


const sagaMiddleware = createSagaMiddleware();


const store = configureStore({
  reducer: { orderReducer: orderReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});


sagaMiddleware.run(orderBookSaga);

export default store;
