import { Line } from '@ant-design/charts';
import { Button, Card, Flex, Form, InputNumber, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  addPortfolioItem,
  getCoinDetails,
  getCoinHistory,
  selectedCurrentCoin,
  selectHistoryData,
} from '../redux/coinSlice';
import { formatMoneyShort, formatPriceChange } from '../utils/utils';

const { Title, Paragraph } = Typography;

const CoinPage = () => {
  const { id: coinId } = useParams();

  const dispatch = useDispatch();
  const currentCoin = useSelector(selectedCurrentCoin);
  const historyData = useSelector(selectHistoryData);

  const [days, setDays] = useState(7);
  const [form] = Form.useForm();
  const amount = Form.useWatch('coinCount', form);

  const handleBuy = ({ coinCount }) => {
    if (!currentCoin) {
      return;
    }

    const numericAmount = Number(coinCount);
    const price = Number(currentCoin.price);

    dispatch(
      addPortfolioItem({
        id: crypto.randomUUID(),
        coinId,
        name: currentCoin.name,
        symbol: currentCoin.symbol,
        price,
        amount: numericAmount,
        totalPrice: price * numericAmount,
      }),
    );

    toast.success(`${currentCoin.name} добавлен в портфель`);
    form.resetFields();
  };

  const getDetails = () => {
    dispatch(getCoinDetails(coinId));
  };

  const getCoinHistoryPrice = () => {
    dispatch(getCoinHistory({ coinId, days }));
  };

  useEffect(() => {
    getDetails();
  }, [dispatch]);

  useEffect(() => getCoinHistoryPrice(), [days, dispatch]);

  const chartConfig = {
    data: historyData,
    xField: 'date',
    yField: 'price',
    smooth: true,
    lineStyle: {
      stroke: 'var(--ant-color-primary)',
      lineWidth: 2,
    },
    areaStyle: {
      fill: 'l(270) 0:rgba(22,119,255,0) 0.5:rgba(22,119,255,0.2) 1:rgba(22,119,255,0.4)',
    },
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: 'var(--ant-color-primary)',
        stroke: 'var(--ant-color-primary)',
        lineWidth: 1,
      },
    },
    tooltip: {
      title: 'date',
      items: [
        {
          name: 'Цена',
          field: 'price',
          valueFormatter: value => `$${Number(value).toFixed(2)}`,
        },
      ],
    },
    xAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        formatter: v => `$${v}`,
        style: {
          fontSize: 12,
        },
      },
    },
    animation: {
      appear: {
        duration: 1000,
      },
    },
  };

  const columns = [
    {
      title: 'Информация',
      dataIndex: 'information',
      key: 'information',
      with: '50%',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Данные о валюте',
      dataIndex: 'data',
      key: 'data',
      width: '50%',
      render: (value, record) => {
        if (record.key === 'priceChange24h') {
          const { text, className } = formatPriceChange(value, '%');
          return <span className={className}>{text}</span>;
        }

        return value;
      },
    },
  ];

  const coinData = [
    {
      key: 'price',
      information: 'Цена',
      data: `${currentCoin?.price} $`,
    },
    {
      key: 'circulatingSupply ',
      information: 'Доступное предложение для торговли',
      data: formatMoneyShort(currentCoin?.circulatingSupply),
    },
    {
      key: 'totalSupply ',
      information: 'Общее кол-во выпущенных активов',
      data: formatMoneyShort(currentCoin?.totalSupply),
    },
    {
      key: 'totalVolume',
      information: 'Объём торгов за последние 24 часа',
      data: formatMoneyShort(currentCoin?.totalVolume),
    },
    {
      key: 'vwap24 ',
      information: 'Средняя цена по объёму за последние 24 часа',
      data: `${currentCoin?.vwap24} $`,
    },
    {
      key: 'priceChange24h',
      information: 'Процентное изменение цены за последние 24 часа',
      data: currentCoin?.priceChange24h,
    },
    {
      key: 'homepage',
      information: 'Сайт',
      data: (
        <a hreg={currentCoin?.homepage} target="_blank">
          {currentCoin?.homepage}
        </a>
      ),
    },
  ];

  console.log(historyData);

  return (
    <>
      <Flex
        justify="center"
        align="center"
        wrap
        gap="medium"
        style={{ marginBottom: 20 }}
      >
        <Paragraph
          style={{
            margin: 0,
            padding: '5px',
            fontSize: 38,
            border: '5px solid black',
          }}
        >
          BTC
        </Paragraph>
        <Title level={1} style={{ margin: 0 }}>
          Bitcoin
        </Title>
      </Flex>
      <div className="container-form">
        <Form form={form} layout="vertical" onFinish={handleBuy}>
          <Form.Item
            label="Количество"
            name="coinCount"
            rules={[
              { required: true, message: 'Введите количество' },
              {
                type: 'number',
                min: 0.01,
                message: 'Количество должно быть больше 0',
              },
            ]}
          >
            <InputNumber
              type="number"
              placeholder="Введите количество"
              style={{ width: '100%' }}
              min={0.01}
              step={0.01}
              decimalSeparator="."
              onKeyDown={e => {
                const allowedKeys = [
                  'Backspace',
                  'Delete',
                  'ArrowLeft',
                  'ArrowRight',
                  'Tab',
                  'Enter',
                  '.',
                ];
                if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" disabled={!amount}>
              Купить
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        dataSource={coinData}
        columns={columns}
        pagination={false}
        bordered
        size="middle"
      />
      <Flex justify="center" style={{ marginTop: 24 }}>
        <Card
          title={`График цены (${days} дней)`}
          style={{ width: '100%', maxWidth: 900 }}
          extra={
            <Flex gap="small">
              {[7, 14, 30, 90].map(d => (
                <Button
                  key={d}
                  type={days === d ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setDays(d)}
                >
                  {d}Д
                </Button>
              ))}
            </Flex>
          }
        >
          {historyData?.length > 0 ? (
            <div style={{ height: 400 }}>
              <Line {...chartConfig} />
            </div>
          ) : (
            <Flex justify="center" align="center" style={{ height: 400 }}>
              <Paragraph type="secondary">Нет данных для графика</Paragraph>
            </Flex>
          )}
        </Card>
      </Flex>
    </>
  );
};

export default CoinPage;
