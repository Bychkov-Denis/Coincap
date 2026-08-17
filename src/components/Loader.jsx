import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loader = () => {
  return <Spin indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />} />;
};

export default Loader;
