import { configureStore, combineReducers  } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userReducer from './features/userSlice'
import searchReducer from './features/searchSlice'
import menuReducer from './features/menuSlice'

const appReducer = combineReducers({
    user: userReducer,
    search: searchReducer,
    menu: menuReducer,
});

const migrations = {
    0: (state) => {
        if (!state) return state;
        
        if (state.search && state.search.searchParams) {
            if (!state.search.searchParams.attributeFilters) {
                state.search.searchParams.attributeFilters = {
                    excludeTechNews: false,
                    excludeAnnouncements: false,
                    excludeDigests: false
                };
            }
            if (!state.search.searchParams.searchArea) {
                state.search.searchParams.searchArea = {
                    includedSources: [],
                    excludedSources: [],
                    includedSourceGroups: [],
                    excludedSourceGroups: []
                };
            }
            if (state.search.searchParams.searchContext && !state.search.searchParams.searchContext.themesFilter) {
                state.search.searchParams.searchContext.themesFilter = {
                    and: [],
                    or: [],
                    not: []
                };
            }
        }
        return state;
    }
};

const persistConfig = {
    key: 'root',
    storage,
    version: 0,
    migrate: (state, version) => {
        if (version === 0) {
            return Promise.resolve(migrations[0](state));
        }
        return Promise.resolve(state);
    }
}

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
})

export const persistor = persistStore(store);