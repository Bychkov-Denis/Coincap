import { Flex, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { selectedTopCoins } from '../redux/coinSlice';

const { Text } = Typography;

const TopCoins = () => {
  const topCoins = useSelector(selectedTopCoins);

  return (
    <Flex vertical>
      <Text underline>Популярные криптовалюты</Text>
      <Flex justify="center" gap="large">
        {topCoins.map(coin => (
          <Flex vertical>
            <Text strong>{coin.name}</Text>
            <Text>{`${coin.price.toFixed(2)} $`}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default TopCoins;
