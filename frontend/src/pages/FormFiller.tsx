import React from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Typography } from 'antd';
import { useUserStore, useFormStore } from '../stores/RootStore';

const { Title, Paragraph } = Typography;

const FormFiller: React.FC = observer(() => {
  const userStore = useUserStore();
  const formStore = useFormStore();

  return (
    <div className="form-filler">
      <Card>
        <Title level={2}>智能表单填写</Title>
        <Paragraph>当前用户：{userStore.currentUserName}</Paragraph>
        <Paragraph>表单字段数量：{formStore.fieldCount}</Paragraph>
        <Paragraph>这里将显示智能表单填写界面，包含：</Paragraph>
        <ul>
          <li>用户选择器</li>
          <li>动态表单字段</li>
          <li>智能预测候选</li>
          <li>表单提交功能</li>
        </ul>
      </Card>
    </div>
  );
});

export default FormFiller;
