import { FC, Fragment } from 'react';
import { PromoBanner } from '@vkontakte/vkui';
import { useDispatch } from 'react-redux';

import { useSelector } from '@/hooks/useSelector';
import { appActions } from '@/redux/reducers/app';

export const Ads: FC = () => {
  const { app } = useSelector();
  const dispatch = useDispatch();

  return (
    <Fragment>
      {app.promoBannerProps && (
        <PromoBanner
          onClose={() => dispatch(appActions.setPromoBannerProps(null))}
          bannerData={app.promoBannerProps}
        />
      )}
    </Fragment>
  );
};
