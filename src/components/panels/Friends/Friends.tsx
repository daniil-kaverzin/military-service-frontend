import { FC, useCallback, useEffect, useState } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  Avatar,
  Button,
  Div,
  Group,
  Placeholder,
  ScreenSpinner,
  SimpleCell,
  Spinner,
} from '@vkontakte/vkui';
import { Icon56ArchiveOutline, Icon56CheckShieldOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';
import { useDispatch } from 'react-redux';

import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from '@/hooks/useSelector';
import { fetchFriends, fetchActiveFriend } from '@/redux/fetch';
import { MODAL_FRIEND } from '@/router';
import { CustomPanelHeader } from '@/components/vkuiOverrides/CustomPanelHeader';

export const Friends: FC<PanelProps> = (props) => {
  const { getLangKey } = useLanguage();
  const { friends, activeUser } = useSelector();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { loading, rules, items } = friends;

  useEffect(() => {
    !items && dispatch(fetchFriends(true));
  }, [items, dispatch]);

  const getFriend = useCallback(
    (id: number) => {
      dispatch(fetchActiveFriend(id));

      setShowModal(true);
    },
    [dispatch],
  );

  useEffect(() => {
    if (showModal && !activeUser.loading) {
      router.pushModal(MODAL_FRIEND);

      setShowModal(false);
    }
  }, [showModal, activeUser, router]);

  return (
    <Panel {...props}>
      <CustomPanelHeader>{getLangKey('friends_header')}</CustomPanelHeader>

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
                <Button size="m" onClick={() => dispatch(fetchFriends())}>
                  {getLangKey('friends_get_rules_button')}
                </Button>
              }
            >
              {getLangKey('friends_get_rules_label')}
            </Placeholder>
          )}

          {rules && items && items.length <= 0 && (
            <Placeholder icon={<Icon56ArchiveOutline />}>
              {getLangKey('friends_not_found_placeholder')}
            </Placeholder>
          )}

          {rules &&
            items &&
            items.length > 0 &&
            items.map(({ id, first_name, last_name, photo_100 }) => {
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

      {activeUser.loading && <ScreenSpinner />}
    </Panel>
  );
};
