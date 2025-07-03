import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { observer } from 'mobx-react-lite';
import { StoreProvider } from './components/StoreProvider';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FormBuilder from './pages/FormBuilder';
import FormFiller from './pages/FormFiller';
import Analytics from './pages/Analytics';
import './styles/App.less';

const { Content } = Layout;

const AppContent: React.FC = observer(() => {
  return (
    <Router>
      <Layout className="app-layout">
        <Header />
        <Layout>
          <Sidebar />
          <Layout className="content-layout">
            <Content className="main-content">
              <Routes>
                <Route path="/" element={<FormFiller />} />
                <Route path="/builder" element={<FormBuilder />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
});

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
