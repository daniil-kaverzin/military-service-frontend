import { Text, Div, Progress as VKProgress, Title, classNames } from '@vkontakte/vkui';
import {
  FC,
  Fragment,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import './CustomProgress.css';
import { getProgressBetweenDates } from '@/utils/dates';
import { getNumberWithText } from '@/utils/words';
import { useLanguage } from '@/hooks/useLanguage';

export interface CustomProgressProps extends HTMLAttributes<HTMLDivElement> {
  dateStart: string;
  yearsCount: number;
  gray?: boolean;
  before?: ReactNode;
  after?: ReactNode;
}

export const CustomProgress: FC<CustomProgressProps> = (props) => {
  const { before, after, gray, dateStart, yearsCount, ...restProps } = props;

  const { getLangKey } = useLanguage();

  const initialProgress = useMemo(() => {
    return getProgressBetweenDates(dateStart, yearsCount);
  }, [dateStart, yearsCount]);

  const [progress, setProgress] = useState(initialProgress);

  const changeProgress = useCallback(() => {
    setProgress(getProgressBetweenDates(dateStart, yearsCount));
  }, [dateStart, yearsCount]);

  useEffect(() => {
    changeProgress();
  }, [changeProgress]);

  useEffect(() => {
    const tick = setInterval(() => {
      changeProgress();
    }, 1000);

    return () => clearInterval(tick);
  }, [changeProgress]);

  return (
    <Div {...restProps} className={classNames('CustomProgress', gray && 'CustomProgress--gray')}>
      {progress.percents < 0 && before}

      {progress.percents > 100 && after}

      {progress.percents <= 100 && progress.percents >= 0 && (
        <Fragment>
          <div className="CustomProgress__progressWrap">
            <Title level="2" weight="semibold" className="CustomProgress__progressValue">
              {progress.percents}%
            </Title>

            <VKProgress value={progress.percents} className="CustomProgress__progressLine" />
          </div>

          <div className="CustomProgress__columns">
            <div className="CustomProgress__column">
              <Title level="2" weight="semibold">
                {getLangKey('profile_passed')}
              </Title>

              <Text weight="regular" className="CustomProgress__timer">
                <div>{getNumberWithText(progress.passed.days, getLangKey('word_day'))}</div>
                <div>{getNumberWithText(progress.passed.hours, getLangKey('word_hour'))}</div>
                <div>{getNumberWithText(progress.passed.minutes, getLangKey('word_minute'))}</div>
                <div>{getNumberWithText(progress.passed.seconds, getLangKey('word_second'))}</div>
              </Text>
            </div>

            <div className="CustomProgress__column">
              <Title level="2" weight="semibold">
                {getLangKey('profile_lefted')}
              </Title>

              <Text weight="regular" className="CustomProgress__timer">
                <div>{getNumberWithText(progress.lefted.days, getLangKey('word_day'))}</div>
                <div>{getNumberWithText(progress.lefted.hours, getLangKey('word_hour'))}</div>
                <div>{getNumberWithText(progress.lefted.minutes, getLangKey('word_minute'))}</div>
                <div>{getNumberWithText(progress.lefted.seconds, getLangKey('word_second'))}</div>
              </Text>
            </div>
          </div>
        </Fragment>
      )}
    </Div>
  );
};
