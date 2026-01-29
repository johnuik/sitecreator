import React, { createContext, useContext, useRef, useEffect } from "react";
import { getSuperFingerprint8 } from "../api/zirhrpc";
import { initWebSocket } from "../api/webClient";

const ZirhContext = createContext(null);

// new
const WS_URL = "ws://10.10.115.40:8080/wsock";
const LABEL = "zirhwebproto";
const MAX_RETRY_DELAY = 30000;

// new end

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
  let canceled = false;

  const init = async () => {
    try {
      // clientId olish
      const cid = await getSuperFingerprint8();
      if (canceled) return;

      stRef.current.clientId = cid;

      // WS + WASM init
      await initWebSocket(stRef, {
        WS_URL,
        LABEL,
        MAX_RETRY_DELAY,
        emitGlobalEvent: (name, data) =>
          window.dispatchEvent(new CustomEvent(`zirh:${name}`, { detail: data })),
      });

      if (!canceled) console.log("✅ WS + WASM init ok");
    } catch (e) {
      console.log("Zirh init error", e);
    }
  };

  init();

  return () => {
    canceled = true;
    // WS clientni tozalash
    if (stRef.current.wsClient) {
      stRef.current.wsClient.disconnect?.();
    }
  };
}, []);


  return (
    <ZirhContext.Provider value={{ stRef }}>{children}</ZirhContext.Provider>
  );
};

export const useZirhStref = () => useContext(ZirhContext);
