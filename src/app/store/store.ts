import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import pactReducer from '../features/pact/pactSlice';
import { pactApiSlice } from '../features/pact/environments/thunks/environments';
import { pacticipantsApi } from '../features/pact/pacticipants/pacticipantsApi';

const store = configureStore({
    reducer: {
        counter: counterReducer,
        pact: pactReducer,
        [pactApiSlice.reducerPath]: pactApiSlice.reducer,
        [pacticipantsApi.reducerPath]: pacticipantsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pactApiSlice.middleware).concat(pacticipantsApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
