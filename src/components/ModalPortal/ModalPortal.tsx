import { FC, useContext, useEffect } from 'react';

import { OverlayContext } from '../providers/OverlayProvider';

export const ModalPortal: FC = ({ children }) => {
  const { setModal, unsetModal } = useContext(OverlayContext);

  useEffect(() => {
    setModal(children);

    return () => unsetModal();
  }, [setModal, unsetModal, children]);

  return null;
};
