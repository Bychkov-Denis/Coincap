import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/mainLayout/MainLayout';
import CoinPage from '../pages/CoinPage';
import MainPage from '../pages/MainPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="/coin/:id" element={<CoinPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
