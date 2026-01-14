"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store, AppStore } from "./store";
import { checkAuth } from "./features/auth/authSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store;
        // Dispatch initial auth check
        storeRef.current.dispatch(checkAuth());
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
