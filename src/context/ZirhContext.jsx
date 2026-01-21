import React, { createContext, useContext, useRef, useEffect } from "react";
import { getSuperFingerprint8 } from "../api/zirhrpc";
import { initWebSocket } from "../api/webClient";

const ZirhContext = createContext(null);

export const ZirhProvider = ({ children }) => {
  const stRef = useRef({
    phase: 0,
    auth_key: null,
    auth_id: null,
    rpcId: 0,
    rpcPending: new Map(),
    rpcStreams: new Map(),
    retryCount: 0,
    aborted: false,
    clientId: null,
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const cid = await getSuperFingerprint8();
        if (!mounted) return;

        stRef.current.clientId = cid;
        await initWebSocket(stRef);
      } catch (e) {
        console.log("Zirh init error", e);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ZirhContext.Provider value={{ stRef }}>
      {children}
    </ZirhContext.Provider>
  );
};

export const useZirhStref = () => useContext(ZirhContext);
