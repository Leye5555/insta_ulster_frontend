"use client";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/services/redux/store";
import React, { useRef } from "react";

const ProviderComp = ({ children }: React.PropsWithChildren) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ProviderComp;
