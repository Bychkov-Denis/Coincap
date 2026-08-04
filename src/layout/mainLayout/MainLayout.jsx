import { Flex, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';

import { Outlet } from 'react-router-dom';
import TopCoins from '../../components/TopCoins';
import styles from './mainLayout.module.css';

const MainLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className="container">
          <Flex justify="space-between" align="center">
            <TopCoins />
          </Flex>
        </div>
      </Header>
      <Content className={styles.content}>
        <div className="container">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
