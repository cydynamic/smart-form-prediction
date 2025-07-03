import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Space,
  List,
  Modal,
  Row,
  Col,
  Divider,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useFormStore } from '../stores/RootStore';
import { FieldType, FormField } from '../stores/types';

const { Title, Text } = Typography;
const { Option } = Select;

const FormBuilder: React.FC = observer(() => {
  const formStore = useFormStore();
  const [form] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [isFieldModalVisible, setIsFieldModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  // 字段类型选项
  const fieldTypeOptions = [
    { value: FieldType.TEXT, label: '文本框', icon: '📝' },
    { value: FieldType.NUMBER, label: '数字框', icon: '🔢' },
    { value: FieldType.SELECT, label: '下拉框', icon: '📋' },
    { value: FieldType.CHECKBOX, label: '多选框', icon: '☑️' },
    { value: FieldType.PASSWORD, label: '密码框', icon: '🔒' },
  ];

  // 打开字段编辑对话框
  const openFieldModal = (field?: FormField) => {
    setEditingField(field || null);
    if (field) {
      fieldForm.setFieldsValue({
        name: field.name,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder,
        required: field.required,
        options: field.options?.join('\n') || '',
      });
    } else {
      fieldForm.resetFields();
    }
    setIsFieldModalVisible(true);
  };

  // 保存字段
  const handleFieldSave = async () => {
    try {
      const values = await fieldForm.validateFields();
      const fieldData = {
        ...values,
        options:
          values.type === FieldType.SELECT || values.type === FieldType.CHECKBOX
            ? values.options?.split('\n').filter((opt: string) => opt.trim())
            : undefined,
      };

      if (editingField) {
        formStore.updateField(editingField.id, fieldData);
        message.success('字段更新成功');
      } else {
        formStore.addField(fieldData);
        message.success('字段添加成功');
      }

      setIsFieldModalVisible(false);
      setEditingField(null);
    } catch (error) {
      console.error('Field validation failed:', error);
    }
  };

  // 删除字段
  const handleFieldDelete = (fieldId: string) => {
    formStore.removeField(fieldId);
    message.success('字段删除成功');
  };

  // 保存表单配置
  const handleFormSave = async () => {
    try {
      const values = await form.validateFields();
      if (formStore.currentFormConfig) {
        await formStore.updateFormConfig(
          formStore.currentFormConfig.id,
          values
        );
        message.success('表单配置保存成功');
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 渲染字段类型标签
  const renderFieldTypeTag = (type: FieldType) => {
    const option = fieldTypeOptions.find(opt => opt.value === type);
    return (
      <Tag color="blue">
        {option?.icon} {option?.label}
      </Tag>
    );
  };

  return (
    <div className="form-builder" style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* 左侧：表单基本信息 */}
        <Col span={8}>
          <Card
            title="表单基本信息"
            extra={
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleFormSave}
                loading={formStore.isLoading}
              >
                保存配置
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: formStore.currentFormConfig?.name,
                description: formStore.currentFormConfig?.description,
              }}
            >
              <Form.Item
                label="表单名称"
                name="name"
                rules={[{ required: true, message: '请输入表单名称' }]}
              >
                <Input placeholder="请输入表单名称" />
              </Form.Item>

              <Form.Item label="表单描述" name="description">
                <Input.TextArea placeholder="请输入表单描述" rows={3} />
              </Form.Item>

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>表单统计</Text>
                <div>
                  <Text>字段数量：{formStore.fieldCount}/10</Text>
                </div>
                <div>
                  <Text>
                    必填字段：
                    {formStore.sortedFields.filter(f => f.required).length}
                  </Text>
                </div>
                <div>
                  <Text>
                    文本字段：
                    {
                      formStore.sortedFields.filter(
                        f => f.type === FieldType.TEXT
                      ).length
                    }
                  </Text>
                </div>
              </Space>
            </Form>
          </Card>
        </Col>

        {/* 右侧：字段管理 */}
        <Col span={16}>
          <Card
            title="字段配置"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openFieldModal()}
                disabled={!formStore.canAddField}
              >
                添加字段
              </Button>
            }
          >
            {formStore.sortedFields.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">暂无字段，点击上方按钮添加字段</Text>
              </div>
            ) : (
              <List
                dataSource={formStore.sortedFields}
                renderItem={(field: FormField, index: number) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openFieldModal(field)}
                      >
                        编辑
                      </Button>,
                      <Popconfirm
                        title="确定删除这个字段吗？"
                        onConfirm={() => handleFieldDelete(field.id)}
                        disabled={!formStore.canRemoveField}
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          disabled={!formStore.canRemoveField}
                        >
                          删除
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<DragOutlined style={{ color: '#666' }} />}
                      title={
                        <Space>
                          <Text strong>{field.label}</Text>
                          {field.required && <Tag color="red">必填</Tag>}
                          {renderFieldTypeTag(field.type)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">字段名：{field.name}</Text>
                          {field.placeholder && (
                            <Text type="secondary">
                              占位符：{field.placeholder}
                            </Text>
                          )}
                          {field.options && (
                            <Text type="secondary">
                              选项：{field.options.join(', ')}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}

            {!formStore.canAddField && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Text type="warning">最多支持10个字段</Text>
              </div>
            )}

            {!formStore.canRemoveField && formStore.fieldCount > 0 && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Text type="warning">至少保留2个字段</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 字段编辑对话框 */}
      <Modal
        title={editingField ? '编辑字段' : '添加字段'}
        open={isFieldModalVisible}
        onOk={handleFieldSave}
        onCancel={() => setIsFieldModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={fieldForm}
          layout="vertical"
          initialValues={{
            type: FieldType.TEXT,
            required: false,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="字段名称"
                name="name"
                rules={[
                  { required: true, message: '请输入字段名称' },
                  {
                    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                    message: '字段名称只能包含字母、数字和下划线，且以字母开头',
                  },
                ]}
              >
                <Input placeholder="例如：username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="字段类型"
                name="type"
                rules={[{ required: true, message: '请选择字段类型' }]}
              >
                <Select placeholder="请选择字段类型">
                  {fieldTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="显示标签"
            name="label"
            rules={[{ required: true, message: '请输入显示标签' }]}
          >
            <Input placeholder="例如：用户名" />
          </Form.Item>

          <Form.Item label="占位符文本" name="placeholder">
            <Input placeholder="例如：请输入用户名" />
          </Form.Item>

          <Form.Item label="是否必填" name="required" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues: any, currentValues: any) =>
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }: { getFieldValue: (name: string) => any }) => {
              const fieldType = getFieldValue('type');
              return fieldType === FieldType.SELECT ||
                fieldType === FieldType.CHECKBOX ? (
                <Form.Item
                  label="选项列表"
                  name="options"
                  rules={[{ required: true, message: '请输入选项列表' }]}
                  extra="每行一个选项"
                >
                  <Input.TextArea
                    placeholder="选项1&#10;选项2&#10;选项3"
                    rows={4}
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default FormBuilder;
