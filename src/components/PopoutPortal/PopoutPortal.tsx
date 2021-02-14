import { FC, useContext, useEffect } from 'react';

import { OverlayContext } from '../providers/OverlayProvider';

export const PopoutPortal: FC = ({ children }) => {
  const { setPopout, unsetPopout } = useContext(OverlayContext);

  useEffect(() => {
    setPopout(children);

    return () => unsetPopout();
  }, [setPopout, unsetPopout, children]);

  return null;
};
