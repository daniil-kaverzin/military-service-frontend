import { createContext, ReactNode } from 'react';
import { noop } from '@vkontakte/vkjs';

export interface OverlayContextInterface {
  setModal: (modal: ReactNode) => void;
  unsetModal: () => void;
  setPopout: (modal: ReactNode) => void;
  unsetPopout: () => void;
}

export const OverlayContext = createContext<OverlayContextInterface>({
  setModal: noop,
  unsetModal: noop,
  setPopout: noop,
  unsetPopout: noop,
});
