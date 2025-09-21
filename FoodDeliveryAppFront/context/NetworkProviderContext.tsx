import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type NetworkContextType = {
  isConnected: boolean | null;
};

const NetworkContext = createContext<NetworkContextType>({ isConnected: null });

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then((state) => setIsConnected(state.isConnected));

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
