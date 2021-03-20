import { FC, Fragment } from 'react';
import { useRouter } from '@happysanta/router';
import { Icon24Dismiss } from '@vkontakte/icons';
import {
  ANDROID,
  IOS,
  ModalPage,
  ModalPageProps,
  ModalPageHeader,
  PanelHeaderButton,
  SimpleCell,
  usePlatform,
  VKCOM,
  PanelHeaderClose,
} from '@vkontakte/vkui';

import { useLanguage } from '../../hooks/useLanguage';
import { parseDate, sortedHolidays } from '../../utils/dates';

export const HolidaysModal: FC<ModalPageProps> = (props) => {
  const router = useRouter();
  const platform = usePlatform();
  const { getLangKey } = useLanguage();

  return (
    <ModalPage
      {...props}
      onClose={() => router.popPage()}
      header={
        <ModalPageHeader
          left={
            <Fragment>
              {(platform === ANDROID || platform === VKCOM) && (
                <PanelHeaderClose onClick={() => router.popPage()} />
              )}
            </Fragment>
          }
          right={
            <Fragment>
              {platform === IOS && (
                <PanelHeaderButton onClick={() => router.popPage()}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )}
            </Fragment>
          }
        >
          {getLangKey('modal_holidays_header')}
        </ModalPageHeader>
      }
      dynamicContentHeight
    >
      {sortedHolidays.map((holiday) => {
        return (
          <SimpleCell
            className="OwnerProfile__cell"
            key={holiday.title}
            disabled
            description={parseDate(holiday.date, getLangKey('months'))}
          >
            {holiday.title}
          </SimpleCell>
        );
      })}
    </ModalPage>
  );
};
