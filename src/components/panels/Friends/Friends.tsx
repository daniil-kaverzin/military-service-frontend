import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  Avatar,
  Button,
  Div,
  PanelHeader,
  Placeholder,
  ScreenSpinner,
  SimpleCell,
  Spinner,
} from '@vkontakte/vkui';
import { Icon56ArchiveOutline, Icon56CheckShieldOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';
import { useDispatch } from 'react-redux';

import { useLanguage } from '../../../hooks/useLanguage';
import { useSelector } from '../../../hooks/useSelector';
import { fetchFriends, fetchActiveFriend } from '../../../redux/fetch';
import { MODAL_FRIEND } from '../../../router';
import { getParameterByName } from '../../../utils/url';

export interface friendsProps extends PanelProps {}

export const Friends: FC<friendsProps> = (props) => {
  const { getLangKey } = useLanguage();
  const { user, friends, activeFriend } = useSelector();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const app_id = useMemo(() => getParameterByName('vk_app_id'), []);

  const { fetched, loading, rules, items } = friends;

  const getfriends = useCallback(() => {
    app_id && dispatch(fetchFriends(Number(app_id)));
  }, [dispatch, app_id]);

  useEffect(() => {
    !fetched && getfriends();
  }, [fetched, getfriends]);

  const getFriend = (id: number) => {
    if (activeFriend.info.id !== id) {
      dispatch(fetchActiveFriend(String(user.access_token), id));
    }

    setShowModal(true);
  };

  useEffect(() => {
    if (showModal && !activeFriend.loading) {
      router.pushModal(MODAL_FRIEND);

      setShowModal(false);
    }
  }, [showModal, activeFriend, router]);

  return (
    <Panel {...props} className="friends">
      <PanelHeader separator={false}>{getLangKey('friends_header')}</PanelHeader>

      {loading && (
        <Div>
          <Spinner size="medium" />
        </Div>
      )}

      {!loading && !rules && (
        <Placeholder
          stretched
          icon={<Icon56CheckShieldOutline />}
          action={
            <Button size="m" onClick={getfriends}>
              {getLangKey('friends_get_rules_button')}
            </Button>
          }
        >
          {getLangKey('friends_get_rules_label')}
        </Placeholder>
      )}

      {!loading && rules && items.length <= 0 && (
        <Placeholder stretched icon={<Icon56ArchiveOutline />}>
          {getLangKey('friends_not_found_placeholder')}
        </Placeholder>
      )}

      {!loading &&
        rules &&
        items.length > 0 &&
        friends.items.map(({ id, first_name, last_name, photo_100 }) => {
          return (
            <SimpleCell
              key={id}
              before={<Avatar size={48} src={photo_100} />}
              onClick={() => getFriend(id)}
            >
              {`${first_name} ${last_name}`}
            </SimpleCell>
          );
        })}

      {activeFriend.loading && <ScreenSpinner />}
    </Panel>
  );
};
