import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { BrowserRouter } from 'react-router-dom';
import './app.css';
import AppRouter from './components/AppRouter';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <ToastProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ToastProvider>
    </ConfigProvider>
  );
}

export default App;
