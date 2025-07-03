import React from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Typography } from 'antd';
import { useFormStore } from '../stores/RootStore';

const { Title, Paragraph } = Typography;

const FormBuilder: React.FC = observer(() => {
  const formStore = useFormStore();

  return (
    <div className="form-builder">
      <Card>
        <Title level={2}>表单构建器</Title>
        <Paragraph>
          当前表单：{formStore.currentFormConfig?.name || '未选择'}
        </Paragraph>
        <Paragraph>字段数量：{formStore.fieldCount}</Paragraph>
        <Paragraph>
          可以添加字段：{formStore.canAddField ? '是' : '否'}
        </Paragraph>
        <Paragraph>这里将显示表单构建界面，包含：</Paragraph>
        <ul>
          <li>表单配置管理</li>
          <li>字段类型选择</li>
          <li>字段属性设置</li>
          <li>字段拖拽排序</li>
        </ul>
      </Card>
    </div>
  );
});

export default FormBuilder;
