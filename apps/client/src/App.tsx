import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './styles/index.scss';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh', width: '100%' }}>
        <Header style={{ color: '#fff', fontSize: 20 }}>Review Viewer</Header>
        <Content style={{ padding: 0, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>© {new Date().getFullYear()} Iryna Makaruk</Footer>
      </Layout>
    </Router>
  );
}

export default App;
