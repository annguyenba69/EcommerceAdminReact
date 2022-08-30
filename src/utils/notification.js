import { Button, notification, Space } from 'antd';

export const openNotificationWithIcon = (type, title, description) => {
    notification[type]({
      message: title,
      description:description,
    });
  };