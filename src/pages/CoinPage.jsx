import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCoinDetails, selectedCurrentCoin } from '../redux/coinSlice';

const CoinPage = () => {
  const { id: coinId } = useParams();

  const dispatch = useDispatch();
  const currentCoin = useSelector(selectedCurrentCoin);

  const getDetails = () => {
    dispatch(getCoinDetails(coinId));
  };

  useEffect(() => {
    getDetails();
  }, []);

  console.log(currentCoin);
  return <div>Coin page {coinId}</div>;
};

export default CoinPage;
