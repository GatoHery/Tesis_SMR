// ** React Imports
import React, { useState } from 'react';

// ** Third Party Imports
import { Outlet } from 'react-router';
import { Button, Drawer, Flex, Image, Layout, theme } from 'antd';
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';

// ** Custom Components Imports
import SidebarItems from '@/components/SidebarItems';
import UserAvatar from '@/components/UserAvatar';

// ** Zustand Store Imports 
import useThemeStore from '@/store/theme.store';
import useAuthStore from '@/store/auth.store';

// ** Image Imports
import darkModeLogoD from '@/assets/img/uca_white_desk.png';
import lightModeLogoD from '@/assets/img/uca_blue_desk.png';
import lightModeLogoM from '@/assets/img/uca_blue_mob.png';
import darkModeLogoM from '@/assets/img/uca_white_mob.png';
import FullPageLoader from '@/components/FullPageLoader';

const { Header, Content, Footer, Sider } = Layout;

const Main = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { darkMode, toggleTheme } = useThemeStore();
  const { token } = theme.useToken();

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    background: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
  }

  const headerStyle: React.CSSProperties = {
    padding: '0 16px 0 0',
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorderSecondary}`
  }

  const handleMenuClick = () => {
    if (window.innerWidth < 992) setOpen(!open);
    else setCollapsed(!collapsed);
  }

  if (loading || isAuthenticated === null) return <FullPageLoader message="Verifying authentication..." />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className='sider'
        style={siderStyle}
        width={250}
        breakpoint='lg'
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
      >
        <div className='sider-content'>
          <div>
            <div className='demo-logo-vertical' >
              {
                collapsed ?
                  <Image src={darkMode ? darkModeLogoM : lightModeLogoM} height={60} preview={false} alt='uca-logo' />
                  :
                  <Image src={darkMode ? darkModeLogoD : lightModeLogoD} height={60} preview={false} alt='uca-logo' />
              }
            </div>
            <SidebarItems setOpen={setOpen} />
          </div>

          <UserAvatar collapsed={collapsed} />
        </div>

      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <Flex justify='space-between' align='center' style={{ height: '100%' }}>
            <Button
              type='text'
              icon={collapsed ? <AiOutlineMenuUnfold size={22} /> : <AiOutlineMenuFold size={22} />}
              onClick={handleMenuClick}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />

            <Image
              className='mobile-logo'
              style={{ marginBottom: 16 }}
              src={darkMode ? darkModeLogoM : lightModeLogoM}
              height={50}
              preview={false}
              alt='uca-logo'
            />

            <Drawer
              title={
                <Image
                  alt="uca-logo"
                  preview={false}
                  width={180}
                  src={darkMode ? darkModeLogoD : lightModeLogoD}
                />
              }
              styles={{ body: { padding: '0' } }}
              style={{ background: token.colorBgContainer }}
              placement="left"
              width={270}
              onClose={() => setOpen(false)}
              open={open}
            >
              <Flex vertical justify='space-between' style={{ height: '100%' }}>
                <SidebarItems setOpen={setOpen} />
                <UserAvatar collapsed={false} />
              </Flex>
            </Drawer>

            <Button
              type='default'
              size='large'
              shape='circle'
              icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            />
          </Flex>
        </Header>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          EcoUCA ©{new Date().getFullYear()} Created by EcoUCA Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
