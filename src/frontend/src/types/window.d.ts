interface WebKitMessageHandler {
  postMessage: (message: string) => void;
}

interface WebKitMessageHandlers {
  closeModal: WebKitMessageHandler;
  [key: string]: WebKitMessageHandler;
}

interface WebKit {
  messageHandlers: WebKitMessageHandlers;
}

declare global {
  interface Window {
    webkit?: WebKit;
  }
}

export {};
