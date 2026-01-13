import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/theme/themeSlice';
import projectReducer from './features/project/projectSlice';
import trafficReducer from './features/traffic/trafficSlice';
import diffReducer from './features/diff/diffSlice';
import endpointReducer from './features/endpoint/endpointSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            theme: themeReducer,
            project: projectReducer,
            traffic: trafficReducer,
            diff: diffReducer,
            endpoint: endpointReducer,
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
