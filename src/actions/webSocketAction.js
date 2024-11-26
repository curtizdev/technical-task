import { CONNECT_WEBSOCKET, DISCONNECT_WEBSOCKET, SET_PRECISION } from './types';

export const connectWebSocket = (precision) => ({
    type: CONNECT_WEBSOCKET,
    payload: { precision }
});

export const disconnectWebSocket = () => ({
    type: DISCONNECT_WEBSOCKET
});

export const setPrecision = (precision) => ({
    type: SET_PRECISION,
    payload: { precision }
});
