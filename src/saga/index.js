import { takeLatest, put, call, take } from 'redux-saga/effects';
import { updateOrderBids } from '../actions/OrderBooks/UpdateBids';
import { updateOrderAsks } from '../actions/OrderBooks/UpdateAsks';
import { clearOrders } from '../actions/OrderBooks/ClearOrders';
import { CONNECT_WEBSOCKET, DISCONNECT_WEBSOCKET, SET_PRECISION } from '../actions/types';

const subscribe_msg = (precision) => JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
    prec: precision
});

const unsubscribe_msg = JSON.stringify({
    event: 'unsubscribe',
    channel: 'book',
});

function createWebSocketConnection(precision) {
    const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    wss.onopen = () => {
        wss.send(subscribe_msg(precision));
    };

    wss.onclose = () => {
        wss.close();
    };

    return wss;
}

function* connectWebSocket(action) {
    try {
        const { precision } = action.payload;
        const wss = yield call(createWebSocketConnection, precision);

        // Listen to WebSocket messages
        while (true) {
            const msg = yield take(wss.onmessage);
            const payload = JSON.parse(msg.data);
            const snapshot = payload[1];

            if (Array.isArray(snapshot)) {
                const payload_data = {
                    price: parseFloat(snapshot[0]).toFixed(2),
                    count: snapshot[1],
                    amount: parseFloat(snapshot[2]).toFixed(2),
                    total: parseFloat(0).toFixed(2)
                };

                if (payload_data.amount > 0) {
                    yield put(updateOrderBids(payload_data));
                } else {
                    yield put(updateOrderAsks(payload_data));
                }
            }
        }

    } catch (error) {
        console.error('WebSocket connection error:', error);
        yield put(clearOrders());
    }
}

function* disconnectWebSocket() {
    // Logic to unsubscribe and disconnect from the WebSocket
    yield put(clearOrders());
}

function* updatePrecision(action) {
    // Handle precision change logic
    yield put({ type: CONNECT_WEBSOCKET, payload: action.payload });
}

function* orderBookSaga() {
    yield takeLatest(CONNECT_WEBSOCKET, connectWebSocket);
    yield takeLatest(DISCONNECT_WEBSOCKET, disconnectWebSocket);
    yield takeLatest(SET_PRECISION, updatePrecision);
}

export default orderBookSaga;
