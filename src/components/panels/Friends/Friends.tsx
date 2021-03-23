import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  Avatar,
  Button,
  Div,
  Group,
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
import { useIsMobile } from '../../../hooks/useIsMobile';

export interface friendsProps extends PanelProps {}

export const Friends: FC<friendsProps> = (props) => {
  const isMobile = useIsMobile();
  const { getLangKey } = useLanguage();
  const { user, friends, activeFriend } = useSelector();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const app_id = useMemo(() => getParameterByName('vk_app_id'), []);

  const { fetched, loading, rules, items } = friends;

  const getFriends = useCallback(() => {
    app_id && dispatch(fetchFriends(Number(app_id)));
  }, [dispatch, app_id]);

  useEffect(() => {
    !fetched && getFriends();
  }, [fetched, getFriends]);

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
      <PanelHeader separator={!isMobile}>{getLangKey('friends_header')}</PanelHeader>

      {loading && (
        <Div>
          <Spinner size="large" />
        </Div>
      )}

      {!loading && (
        <Group>
          {!rules && (
            <Placeholder
              icon={<Icon56CheckShieldOutline />}
              action={
                <Button size="m" onClick={getFriends}>
                  {getLangKey('friends_get_rules_button')}
                </Button>
              }
            >
              {getLangKey('friends_get_rules_label')}
            </Placeholder>
          )}

          {rules && items.length <= 0 && (
            <Placeholder icon={<Icon56ArchiveOutline />}>
              {getLangKey('friends_not_found_placeholder')}
            </Placeholder>
          )}

          {rules &&
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
        </Group>
      )}

      {activeFriend.loading && <ScreenSpinner />}
    </Panel>
  );
};
