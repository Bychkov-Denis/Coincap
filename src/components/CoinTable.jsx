import { PlusCircleOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCoins, selectedCoins } from '../redux/coinSlice';
import { formatMarketCap, formatPriceChange } from '../utils/utils';

const CoinTable = () => {
  const dispatch = useDispatch();

  const coins = useSelector(selectedCoins);

  const navigate = useNavigate();

  const handleRowClick = record => {
    const coinId = record.id;
    navigate(`/coin/${coinId}`);
  };

  const handleAddCoin = (e, record) => {
    e.stopPropagation();
    console.log(record);
  };

  const columns = [
    { title: '№', dataIndex: 'number', key: 'number' },
    {
      title: '',
      dataIndex: 'symbol',
      key: 'symbol',
      render: symbol => <span className="color-primary">{symbol}</span>,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'VWAP (24Hr)',
      dataIndex: 'vwap24',
      key: 'vwap24',
      render: vwap24 => `${vwap24.toFixed(2)} $`,
    },
    {
      title: 'Change (24Hr)',
      dataIndex: 'priceChange24',
      key: 'priceChange24',
      render: priceChange24 => {
        const { text, className } = formatPriceChange(priceChange24);
        return <span className={className}>{text}</span>;
      },
    },
    {
      title: 'Market Cap',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: marketCap => formatMarketCap(marketCap),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => formatMarketCap(price),
    },
    {
      title: '',
      key: 'add',
      render: (_, record) => {
        return (
          <PlusCircleOutlined
            className="icon"
            onClick={event => handleAddCoin(event, record)}
          />
        );
      },
    },
  ];

  const getCoins = () => {
    dispatch(getAllCoins());
  };

  useEffect(() => {
    getCoins();
  }, []);

  return (
    <div className="container">
      <Table
        dataSource={coins}
        columns={columns}
        rowKey="id"
        onRow={record => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          responsive: true,
          showSizeChanger: true,
          showQuickJumper: true,
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
};

export default CoinTable;
