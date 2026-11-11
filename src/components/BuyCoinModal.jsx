import { Button, Form, InputNumber, Modal, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addPortfolioItem } from '../redux/coinSlice';

const { Text } = Typography;

const BuyCoinModal = ({ coin, open, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const amount = Form.useWatch('amount', form);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = ({ amount: value }) => {
    if (!coin) {
      return;
    }

    const numericAmount = Number(value);

    dispatch(
      addPortfolioItem({
        id: crypto.randomUUID(),
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        amount: numericAmount,
        totalPrice: coin.price * numericAmount,
      }),
    );

    toast.success(`${coin.name} добавлен в портфель`);
    handleClose();
  };

  const totalPrice = coin ? coin.price * Number(amount || 0) : 0;

  return (
    <Modal
      open={open}
      title={coin ? `Купить ${coin.name}` : 'Купить'}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Количество"
          name="amount"
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
        {totalPrice > 0 && (
          <Text type="secondary">{`Итого: ${totalPrice.toFixed(2)} $`}</Text>
        )}
        <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
          <Button type="primary" block htmlType="submit" disabled={!amount}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BuyCoinModal;
