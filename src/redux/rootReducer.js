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
        case 'increaseQuantity':
            // Your logic for increasing the quantity of an item in the cart
            // For example:
            const increasedItems = [...state.cartItems];
            const itemToIncrease = increasedItems[action.payload];
            itemToIncrease.orderdetails.quantity += 1;
            itemToIncrease.orderdetails.total_price = itemToIncrease.orderdetails.quantity * itemToIncrease.orderdetails.unit_price

            return {
                ...state,
                cartItems: increasedItems,
            };
        case 'decreaseQuantity':
            // Your logic for decreasing the quantity of an item in the cart
            // For example:
            const decreasedItems = [...state.cartItems];
            const itemToDecrease = decreasedItems[action.payload];

            if (itemToDecrease.orderdetails.quantity > 1) {
                itemToDecrease.orderdetails.quantity -= 1;
                itemToDecrease.orderdetails.total_price = itemToDecrease.orderdetails.quantity * itemToDecrease.orderdetails.unit_price;

            }
            return {
                ...state,
                cartItems: decreasedItems,
            };


        case 'resetState':
            return initialState;
        default: return state
    }

}