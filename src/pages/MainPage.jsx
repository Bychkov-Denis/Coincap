import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CoinTable from '../components/CoinTable';
import Loader from '../components/Loader';
import { getAllCoins, selectedLoading } from '../redux/coinSlice';

const MainPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectedLoading);

  const getCoins = () => {
    dispatch(getAllCoins());
  };

  useEffect(() => {
    getCoins();
  }, []);

  if (loading) {
    return (
      <div className="container-flex-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <CoinTable />
    </>
  );
};

export default MainPage;
