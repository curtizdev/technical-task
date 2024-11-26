import * as types from '../actions/types';

export const initialState = {
    order_books: {
        bids: [],
        asks: [],
    },
    connected: false,
    connecting: false,
    precision: 'P0'
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case types.CONNECT_WEBSOCKET:
            return { ...state, connected: true, connecting: false, precision: action.payload.precision };
        case types.DISCONNECT_WEBSOCKET:
            return { ...state, connected: false, connecting: false, order_books: { bids: [], asks: [] } };
        case types.SET_PRECISION:
            return { ...state, precision: action.payload.precision };

        case types.UPDATE_ORDER_BOOK_BIDS: {
            const { price, count, amount } = action.payload;
            const updatedBids = [...state.order_books.bids];
            const index = updatedBids.findIndex(bid => bid.price === price);

            if (index !== -1) {
                updatedBids[index].count = count;
                updatedBids[index].amount = amount;
            } else {
                updatedBids.push(action.payload);
            }

            if (count === 0 && amount === '1.00') {
                updatedBids.splice(index, 1);
            }

            updatedBids.sort((a, b) => b.price - a.price);

            updatedBids.forEach((bid, idx) => {
                bid.total = (idx > 0 ? parseFloat(updatedBids[idx - 1].total) : 0) + parseFloat(bid.amount);
                bid.total = bid.total.toFixed(2);
            });

            return {
                ...state,
                order_books: {
                    bids: updatedBids,
                    asks: state.order_books.asks
                }
            };
        }

        case types.UPDATE_ORDER_BOOK_ASKS: {
            const { price, count, amount } = action.payload;
            const updatedAsks = [...state.order_books.asks];
            const index = updatedAsks.findIndex(ask => ask.price === price);

            if (index !== -1) {
                updatedAsks[index].count = count;
                updatedAsks[index].amount = amount;
            } else {
                updatedAsks.push(action.payload);
            }

            if (count === 0 && amount === '-1.00') {
                updatedAsks.splice(index, 1);
            }

            updatedAsks.sort((a, b) => a.price - b.price);

            updatedAsks.forEach((ask, idx) => {
                ask.total = (idx > 0 ? parseFloat(updatedAsks[idx - 1].total) : 0) + parseFloat(ask.amount);
                ask.total = ask.total.toFixed(2);
            });

            return {
                ...state,
                order_books: {
                    bids: state.order_books.bids,
                    asks: updatedAsks
                }
            };
        }

        case types.CLEAR_ORDERS:
            return {
                ...state,
                order_books: { bids: [], asks: [] }
            };

        default:
            return state;
    }
}
