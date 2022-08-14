import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface PayloadType<T> {
    payload: T;
}

const pactSlice = createSlice({
    name: 'pact',
    initialState: {
        baseUrl: '',
        environments: [],
    },
    reducers: {
        setBaseUrl: (state, action: PayloadType<string>) => {
            state.baseUrl = action.payload;
        },
    },
});

export const { setBaseUrl } = pactSlice.actions;

export const selectBaseUrl = (state: RootState) => state.pact.baseUrl;

export default pactSlice.reducer;
