import { Route, Routes } from 'react-router-dom';
import CryptoList from '..//pages/CryptoList';
import MainLayout from '../layout/mainLayout/MainLayout';
import CoinPage from '../pages/CoinPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<CryptoList />} />
        <Route path="/coin/:id" element={<CoinPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
