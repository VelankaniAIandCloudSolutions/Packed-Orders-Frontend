const initialState = {
    cartItems: []
};
export const rootReducer = (state = initialState, action) => {


    switch (action.type) {
        case 'addToCart': return {
            ...state,
            cartItems: [...state.cartItems, action.payload]
        };
        case 'deleteFromCart': return {
            ...state,
            cartItems: state.cartItems.filter((_, index) => index !== action.payload),
        };
        case 'updateCart':
            return {
                ...state,
                cartItems: state.cartItems.map((item, index) =>
                    index === action.payload.index
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case 'resetState':
            return initialState;
        default: return state
    }

}