import { FC, Fragment } from 'react';
import { PromoBanner } from '@vkontakte/vkui';
import { useDispatch } from 'react-redux';

import { useSelector } from '../../hooks/useSelector';
import { userActions } from '../../redux/reducers/user';

export const Ads: FC = () => {
  const { user } = useSelector();
  const dispatch = useDispatch();

  return (
    <Fragment>
      {user.promoBannerProps && (
        <PromoBanner
          onClose={() => dispatch(userActions.setUser({ promoBannerProps: undefined }))}
          bannerData={user.promoBannerProps}
        />
      )}
    </Fragment>
  );
};
