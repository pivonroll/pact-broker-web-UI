import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByValue: (state, action) => {
            state.value += action.payload;
        },
    },
});

export const { increment, decrement, incrementByValue } = counterSlice.actions;
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
