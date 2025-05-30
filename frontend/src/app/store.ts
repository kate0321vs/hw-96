import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import {usersReducer} from "../features/Users/usersSlice.ts";
import storage from 'redux-persist/lib/storage';
import {cocktailsReducer} from "../features/Cocktails/cocktailsSlice.ts";


const usersPersistConfig = {
    key: 'cocktails:users',
    storage,
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    users: persistReducer(usersPersistConfig, usersReducer),
    cocktails: cocktailsReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persister = persistStore(store);