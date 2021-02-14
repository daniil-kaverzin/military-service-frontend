import { Text, Avatar, Div } from '@vkontakte/vkui';
import React, { FC, HTMLAttributes } from 'react';

import './Profile.css';

export interface ProfileProps extends HTMLAttributes<HTMLDivElement> {
  avatar: string;
  name: string;
}

export const Profile: FC<ProfileProps> = (props) => {
  const { avatar, name, ...restProps } = props;

  return (
    <Div {...restProps} className="Profile">
      <Avatar src={avatar} size={100} />
      <Text className="Profile__name" weight="medium">
        {name}
      </Text>
    </Div>
  );
};
