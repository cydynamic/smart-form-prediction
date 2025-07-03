import React from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FormOutlined,
  BuildOutlined,
  BarChartOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/RootStore';

const { Sider } = Layout;

const Sidebar: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const appStore = useAppStore();

  const menuItems = [
    {
      key: '/',
      icon: <FormOutlined />,
      label: '表单填写',
    },
    {
      key: '/builder',
      icon: <BuildOutlined />,
      label: '表单构建',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
    {
      key: '/ml',
      icon: <RobotOutlined />,
      label: '机器学习',
      disabled: true, // 暂时禁用，后续开发
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key !== location.pathname) {
      navigate(key);
      appStore.setCurrentPage(key);
    }
  };

  return (
    <Sider
      collapsed={appStore.sidebarCollapsed}
      onCollapse={appStore.setSidebarCollapsed}
      theme="light"
      width={220}
      collapsedWidth={80}
      className="app-sidebar"
    >
      <div className="sidebar-header">
        {!appStore.sidebarCollapsed && (
          <div className="sidebar-logo">智能表单</div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
});

export default Sidebar;
