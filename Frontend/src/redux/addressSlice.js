import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
        selectedAddress: null
    },
    reducers: {
        addNewAddress: (state, action) => {
            state.addresses.push(action.payload);
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        removeAddress: (state, action) => {
            if (state.addresses[action.payload] === state.selectedAddress) {
                state.selectedAddress = null;
            }

            state.addresses = state.addresses.filter((_, index) => 
                index !== action.payload
            );
        }
    }
});

export const { 
    addNewAddress, 
    removeAddress, 
    setSelectedAddress 
} = addressSlice.actions;

export default addressSlice.reducer;