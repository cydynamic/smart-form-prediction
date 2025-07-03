import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Space,
  Row,
  Col,
  Divider,
  message,
  List,
  Badge,
  Tooltip,
  Dropdown,
} from 'antd';
import {
  UserOutlined,
  SendOutlined,
  BulbOutlined,
  HistoryOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  useUserStore,
  useFormStore,
  usePredictionStore,
} from '../stores/RootStore';
import { FieldType, FormField, PredictionCandidate } from '../stores/types';

const { Title, Text } = Typography;
const { Option } = Select;
const { Group: CheckboxGroup } = Checkbox;

interface PredictionDropdownProps {
  candidates: PredictionCandidate[];
  onSelect: (value: string) => void;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

const PredictionDropdown: React.FC<PredictionDropdownProps> = ({
  candidates,
  onSelect,
  visible,
  onVisibleChange,
}) => {
  const menuItems: MenuProps['items'] = candidates.map(
    (candidate: PredictionCandidate, index: number) => ({
      key: index,
      icon: (
        <BulbOutlined
          style={{ color: getConfidenceColor(candidate.confidence) }}
        />
      ),
      label: (
        <Space direction="vertical" size={0}>
          <Text strong>{candidate.value}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {getSourceLabel(candidate.source)} · 置信度:{' '}
            {Math.round(candidate.confidence * 100)}%
          </Text>
        </Space>
      ),
      onClick: () => {
        onSelect(candidate.value);
        onVisibleChange(false);
      },
    })
  );

  return (
    <Dropdown
      menu={{ items: menuItems }}
      open={visible}
      onOpenChange={onVisibleChange}
      placement="bottomLeft"
      trigger={[]}
    >
      <div />
    </Dropdown>
  );
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return '#52c41a';
  if (confidence >= 0.6) return '#fadb14';
  return '#ff7875';
};

const getSourceLabel = (source: string): string => {
  const sourceMap: Record<string, string> = {
    history: '历史记录',
    ml: '机器学习',
    pattern: '模式匹配',
  };
  return sourceMap[source] || source;
};

const FormFiller: React.FC = observer(() => {
  const userStore = useUserStore();
  const formStore = useFormStore();
  const predictionStore = usePredictionStore();

  const [form] = Form.useForm();
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [showPrediction, setShowPrediction] = useState<Record<string, boolean>>(
    {}
  );
  const [fieldHistory, setFieldHistory] = useState<Record<string, string[]>>(
    {}
  );

  // 获取字段历史数据
  useEffect(() => {
    if (userStore.currentUser && formStore.currentFormConfig) {
      const history: Record<string, string[]> = {};
      formStore.sortedFields.forEach(field => {
        const fieldHistory = formStore.getFieldSubmissionHistory(
          userStore.currentUser!.id,
          field.name
        ) as string[];
        history[field.name] = fieldHistory;
      });
      setFieldHistory(history);
    }
  }, [userStore.currentUser, formStore.currentFormConfig]);

  // 处理字段值变化
  const handleFieldChange = async (
    fieldName: string,
    value: any,
    fieldIndex: number
  ) => {
    formStore.setFormValue(fieldName, value);

    // 触发下一个字段的预测
    const nextFieldIndex = fieldIndex + 1;
    if (nextFieldIndex < formStore.sortedFields.length) {
      setCurrentFieldIndex(nextFieldIndex);
      const nextField = formStore.sortedFields[nextFieldIndex];

      if (nextField && userStore.currentUser) {
        // 获取预测候选
        await predictionStore.getPrediction(
          userStore.currentUser.id,
          nextField.id,
          nextField.name,
          formStore.formData
        );

        const predictions = predictionStore.getPredictionResult(nextField.id);
        if (predictions && predictions.candidates.length > 0) {
          setShowPrediction(prev => ({ ...prev, [nextField.name]: true }));
        }
      }
    }
  };

  // 选择预测候选
  const handlePredictionSelect = (
    fieldName: string,
    value: string,
    fieldId: string
  ) => {
    form.setFieldsValue({ [fieldName]: value });
    formStore.setFormValue(fieldName, value);
    predictionStore.selectCandidate(fieldId, {
      value,
      confidence: 0,
      source: 'history',
    });
    setShowPrediction(prev => ({ ...prev, [fieldName]: false }));
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!userStore.currentUser) {
        message.error('请先选择用户');
        return;
      }

      await formStore.submitForm(userStore.currentUser.id);
      message.success('表单提交成功！');
      form.resetFields();
      formStore.resetFormData();
      setCurrentFieldIndex(0);
      setShowPrediction({});
    } catch (error) {
      console.error('Form submission failed:', error);
      message.error('表单提交失败，请检查必填字段');
    }
  };

  // 清空表单
  const handleReset = () => {
    form.resetFields();
    formStore.resetFormData();
    setCurrentFieldIndex(0);
    setShowPrediction({});
    message.info('表单已清空');
  };

  // 渲染字段
  const renderField = (field: FormField, index: number) => {
    const predictions = predictionStore.getPredictionResult(field.id);
    const showDropdown =
      showPrediction[field.name] && predictions?.candidates.length > 0;
    const history = fieldHistory[field.name] || [];

    const commonProps = {
      placeholder: field.placeholder,
      onFocus: () => {
        setCurrentFieldIndex(index);
      },
      onBlur: () => {
        // 延迟隐藏预测下拉框，允许用户点击选项
        setTimeout(() => {
          setShowPrediction(prev => ({ ...prev, [field.name]: false }));
        }, 200);
      },
    };

    let fieldElement;

    switch (field.type) {
      case FieldType.TEXT:
      case FieldType.PASSWORD:
        fieldElement = (
          <div style={{ position: 'relative' }}>
            <Input
              {...commonProps}
              type={field.type === FieldType.PASSWORD ? 'password' : 'text'}
              onChange={e =>
                handleFieldChange(field.name, e.target.value, index)
              }
              suffix={
                showDropdown && <BulbOutlined style={{ color: '#1890ff' }} />
              }
            />
            {showDropdown && predictions && (
              <PredictionDropdown
                candidates={predictions.candidates}
                onSelect={value =>
                  handlePredictionSelect(field.name, value, field.id)
                }
                visible={showDropdown}
                onVisibleChange={visible =>
                  setShowPrediction(prev => ({
                    ...prev,
                    [field.name]: visible,
                  }))
                }
              />
            )}
          </div>
        );
        break;

      case FieldType.NUMBER:
        fieldElement = (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            onChange={value => handleFieldChange(field.name, value, index)}
          />
        );
        break;

      case FieldType.SELECT:
        fieldElement = (
          <Select
            {...commonProps}
            style={{ width: '100%' }}
            onChange={value => handleFieldChange(field.name, value, index)}
          >
            {field.options?.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
        break;

      case FieldType.CHECKBOX:
        fieldElement = (
          <CheckboxGroup
            options={field.options}
            onChange={values => handleFieldChange(field.name, values, index)}
          />
        );
        break;

      default:
        fieldElement = <Input {...commonProps} />;
    }

    return (
      <Form.Item
        key={field.id}
        label={
          <Space>
            <Text>{field.label}</Text>
            {field.required && <Text type="danger">*</Text>}
            {history.length > 0 && (
              <Tooltip title={`历史填写过 ${history.length} 次`}>
                <Badge count={history.length} size="small">
                  <HistoryOutlined style={{ color: '#666' }} />
                </Badge>
              </Tooltip>
            )}
            {currentFieldIndex === index && (
              <Badge dot color="blue">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  当前字段
                </Text>
              </Badge>
            )}
          </Space>
        }
        name={field.name}
        rules={[{ required: field.required, message: `请填写${field.label}` }]}
      >
        {fieldElement}
      </Form.Item>
    );
  };

  if (!formStore.currentFormConfig) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card>
          <Title level={3}>请先配置表单</Title>
          <Text type="secondary">请前往表单构建器创建或选择一个表单配置</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="form-filler" style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* 左侧：表单填写 */}
        <Col span={16}>
          <Card
            title={
              <Space>
                <Text strong>{formStore.currentFormConfig.name}</Text>
                <Text type="secondary">({formStore.fieldCount} 个字段)</Text>
              </Space>
            }
            extra={
              <Space>
                <Button onClick={handleReset}>清空表单</Button>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  loading={formStore.isLoading}
                  disabled={!userStore.currentUser}
                >
                  提交表单
                </Button>
              </Space>
            }
          >
            {formStore.currentFormConfig.description && (
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary">
                  {formStore.currentFormConfig.description}
                </Text>
              </div>
            )}

            <Form
              form={form}
              layout="vertical"
              onValuesChange={(changedValues, allValues) => {
                Object.entries(changedValues).forEach(([key, value]) => {
                  formStore.setFormValue(key, value);
                });
              }}
            >
              {formStore.sortedFields.map((field, index) =>
                renderField(field, index)
              )}
            </Form>
          </Card>
        </Col>

        {/* 右侧：用户选择和统计信息 */}
        <Col span={8}>
          {/* 用户选择 */}
          <Card title="用户选择" style={{ marginBottom: '16px' }}>
            <Form.Item label="当前用户">
              <Select
                style={{ width: '100%' }}
                placeholder="请选择用户"
                value={userStore.currentUser?.id}
                onChange={userId => userStore.setCurrentUser(userId)}
                suffixIcon={<UserOutlined />}
              >
                {userStore.users.map(user => (
                  <Option key={user.id} value={user.id}>
                    <Space>
                      <Text>{user.name}</Text>
                      {user.isActive && <Badge status="success" />}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {userStore.currentUser && (
              <div>
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>用户信息</Text>
                  <div>
                    <Text type="secondary">用户名: </Text>
                    <Text>{userStore.currentUser.name}</Text>
                  </div>
                  <div>
                    <Text type="secondary">邮箱: </Text>
                    <Text>{userStore.currentUser.email || '未设置'}</Text>
                  </div>
                  <div>
                    <Text type="secondary">状态: </Text>
                    <Badge
                      status={
                        userStore.currentUser.isActive ? 'success' : 'default'
                      }
                      text={userStore.currentUser.isActive ? '活跃' : '非活跃'}
                    />
                  </div>
                </Space>
              </div>
            )}
          </Card>

          {/* 提交历史 */}
          {userStore.currentUser && (
            <Card title="提交历史">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">总提交次数: </Text>
                  <Text strong>
                    {
                      formStore.getUserSubmissions(userStore.currentUser.id)
                        .length
                    }
                  </Text>
                </div>

                <div>
                  <Text type="secondary">表单完成度: </Text>
                  <Text strong>
                    {Math.round(
                      (Object.keys(formStore.formData).length /
                        formStore.fieldCount) *
                        100
                    )}
                    %
                  </Text>
                </div>

                <div>
                  <Text type="secondary">预测状态: </Text>
                  <Text strong>
                    {predictionStore.isModelTraining ? '训练中' : '就绪'}
                  </Text>
                </div>

                <Divider />

                <Text strong>字段历史频率</Text>
                {formStore.sortedFields.map(field => {
                  const history = fieldHistory[field.name] || [];
                  const uniqueValues = [...new Set(history)].length;
                  return (
                    <div key={field.id} style={{ marginBottom: '8px' }}>
                      <Space>
                        <Text style={{ fontSize: '12px' }}>{field.label}:</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {uniqueValues} 种值，{history.length} 次填写
                        </Text>
                      </Space>
                    </div>
                  );
                })}
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
});

export default FormFiller;
