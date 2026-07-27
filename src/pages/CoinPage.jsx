import { useParams } from 'react-router-dom';

const CoinPage = () => {
  const { id } = useParams();
  return <div>CoinPage {id}</div>;
};

export default CoinPage;
