import { configureStore } from '@reduxjs/toolkit'; // Use configureStore from Redux Toolkit
import createSagaMiddleware from 'redux-saga'; // Import redux-saga
import orderReducer from '../reducers/orderbook'; // Assuming you have a root reducer
import orderBookSaga from '../saga';// Assuming you have a root saga that includes all your sagas

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();


// Create the store with saga middleware
const store = configureStore({
  reducer: { orderReducer: orderReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware), // Apply saga middleware
});

// Run the root saga
sagaMiddleware.run(orderBookSaga); // Run all the sagas from your orderBookSaga

export default store;
