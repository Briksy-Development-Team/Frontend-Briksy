import { createContext, useContext, useState, ReactNode } from "react";

type ReadyContextType = {
    ready: boolean;
    setReady: (v: boolean) => void;
};

const ReadyContext = createContext<ReadyContextType | null>(null);

export const ReadyProvider = ({ children }: { children: ReactNode }) => {
    const [ready, setReady] = useState(false);
    return (
        <ReadyContext.Provider value={{ ready, setReady }}>
            {children}
        </ReadyContext.Provider>
    );
};

export const useReady = () => {
    const ctx = useContext(ReadyContext);
    if (!ctx) throw new Error("useReady must be used within ReadyProvider");
    return ctx;
};