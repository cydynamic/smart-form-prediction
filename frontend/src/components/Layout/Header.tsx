import React from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Avatar, Dropdown, Switch, Space, Typography } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAppStore } from '../../stores/RootStore';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = observer(() => {
  const appStore = useAppStore();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        appStore.showInfo('个人资料', '功能开发中...');
        break;
      case 'settings':
        appStore.showInfo('设置', '功能开发中...');
        break;
      case 'logout':
        appStore.showSuccess('退出登录', '已成功退出系统');
        break;
      default:
        break;
    }
  };

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <div className="logo">
          <BulbOutlined className="logo-icon" />
          <span className="logo-text">智能表单预测系统</span>
        </div>
      </div>

      <div className="header-right">
        <Space size="middle">
          <Space>
            <Text type="secondary">深色模式</Text>
            <Switch
              checked={appStore.isDarkTheme}
              onChange={appStore.toggleTheme}
              size="small"
            />
          </Space>

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div className="user-avatar">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
});

export default Header;
