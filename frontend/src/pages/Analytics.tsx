import React from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import {
  useUserStore,
  useFormStore,
  usePredictionStore,
} from '../stores/RootStore';

const { Title, Paragraph } = Typography;

const Analytics: React.FC = observer(() => {
  const userStore = useUserStore();
  const formStore = useFormStore();
  const predictionStore = usePredictionStore();

  return (
    <div className="analytics">
      <Title level={2}>数据分析</Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={userStore.users.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="表单配置"
              value={formStore.formConfigs.length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="模型版本"
              value={predictionStore.currentModelVersion}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预测数量"
              value={predictionStore.totalPredictions}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>系统状态</Title>
        <Paragraph>活跃用户：{userStore.activeUsers.length}</Paragraph>
        <Paragraph>
          模型训练状态：{predictionStore.isModelTraining ? '训练中' : '就绪'}
        </Paragraph>
        <Paragraph>活跃预测：{predictionStore.activePredictions}</Paragraph>
        <Paragraph>提交记录：{formStore.submissions.length}</Paragraph>
      </Card>
    </div>
  );
});

export default Analytics;
