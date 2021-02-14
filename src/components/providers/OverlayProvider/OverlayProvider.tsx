import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { Root } from '@vkontakte/vkui';

import { OverlayContext, OverlayContextInterface } from './OverlayContext';

const body = document.body;

export const OverlayProvider: FC = ({ children }) => {
  const [modalState, setModalState] = useState<ReactNode>();
  const [popoutState, setPopoutState] = useState<ReactNode>();

  const context: OverlayContextInterface = {
    setModal: (modal) => {
      setModalState(modal);
    },
    unsetModal: () => {
      setModalState(null);
    },
    setPopout: (state) => {
      setPopoutState(state);
    },
    unsetPopout: () => {
      setPopoutState(null);
    },
  };

  useEffect(() => {
    const modalElement = modalState as ReactElement;

    if (modalElement?.props?.activeModal || popoutState) {
      body.style.overflowY = 'hidden';
    } else {
      body.style.overflowY = '';
    }
  }, [modalState, popoutState]);

  return (
    <OverlayContext.Provider value={context}>
      <Root activeView="view" modal={modalState} popout={popoutState}>
        <div style={{ height: '100%' }} id="view">
          {children}
        </div>
      </Root>
    </OverlayContext.Provider>
  );
};
