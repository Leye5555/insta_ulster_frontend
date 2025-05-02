"use client";
import { configureStore } from "@reduxjs/toolkit";

import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";

import rootReducer from "./reducers";

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
  });
  if (process.env.NODE_ENV !== "production" && module.hot) {
    // install webpack env for next to fix hot property not found
    // https://marcomorenoag.medium.com/very-useful-thanks-a24399c201d8
    // npm i -D @types/webpack-env
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

export default makeStore;
