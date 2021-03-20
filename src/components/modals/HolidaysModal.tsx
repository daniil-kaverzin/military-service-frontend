import React, { FC, Fragment } from 'react';
import { useRouter } from '@happysanta/router';
import { Icon24Cancel } from '@vkontakte/icons';
import {
  ANDROID,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  SimpleCell,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';
import { ModalPageProps } from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';

import { useLanguage } from '../../hooks/useLanguage';
import { parseDate, sortedHolidays } from '../../utils/dates';

export const HolidaysModal: FC<Omit<ModalPageProps, 'header'>> = (props) => {
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
                <PanelHeaderButton onClick={() => router.popPage()}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              )}
            </Fragment>
          }
          right={
            <Fragment>
              {platform === IOS && (
                <PanelHeaderButton onClick={() => router.popPage()}>
                  {getLangKey('modals_ios_close')}
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
