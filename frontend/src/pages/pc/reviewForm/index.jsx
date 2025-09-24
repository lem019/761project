import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Card,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Checkbox,
  Tag,
  Descriptions,
  Row,
  Col,
  Divider,
  Radio,
  Collapse,
  Image,
  message,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getFormData, saveFormData, operateForm, getFormTemplateById } from '@/services/form-service';
import styles from './index.module.less';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TextArea } = Input;


const ReviewFormPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [overallComment, setOverallComment] = useState('');
  const [formMeta, setFormMeta] = useState(null);
  const [formId, setFormId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templateData, setTemplateData] = useState(null);

  // Handle URL parameters and load form data
  useEffect(() => {
    const loadFormData = async () => {
      const id = searchParams.get('id');
      const templateId = searchParams.get('templateId');

      if (id) {
        setFormId(id);
        setLoading(true);
        try {
          const templateData = await getFormTemplateById(templateId);
          const formData = await getFormData(id);
          
          // Set template data
          setTemplateData(templateData);
          // Set form meta data
          setFormMeta(formData);
          
          
          // Set overall comment
          setOverallComment(formData.overallComment || '');
          
        } catch (error) {
          console.error('Failed to load form data:', error);
          message.error('Failed to load form data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    loadFormData();
  }, [searchParams]);

  const handleOpenModal = (record) => {
    setSelectedItem(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const handleActionChange = (record, action) => {
    setFormMeta(prevFormMeta => {
      const newFormMeta = { ...prevFormMeta };
      if (!newFormMeta.inspectionData[record.key]) {
        newFormMeta.inspectionData[record.key] = {};
      }
      newFormMeta.inspectionData[record.key].approved = action;
      return newFormMeta;
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'visual':
        return 'blue';
      case 'operation':
        return 'green';
      case 'visual & operation':
        return 'purple';
      default:
        return 'default';
    }
  };

  const renderMediaContent = (mediaArray) => {
    if (!mediaArray || mediaArray.length === 0) return null;

    return (
      <div className={styles.mediaContainer}>
        {mediaArray.map((media, index) => (
          <div key={index} className={styles.mediaItem}>
            {media.type === 'image' ? (
              <Image
                src={media.url}
                alt={`Media ${index + 1}`}
                style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
                preview={{
                  mask: 'Preview'
                }}
              />
            ) : media.type === 'video' ? (
              <video
                controls
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                preload="metadata"
              >
                <source src={media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  // TODO: need to adapt to the commentsAndDetails data format submitted by the employee
  const renderCommentsAndDetails = (checkItemKey) => {
    const commentsAndDetails = formMeta?.inspectionData?.[checkItemKey]?.commentsAndDetails || [];
    
    if (commentsAndDetails.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          <Text type="secondary">No comment</Text>
        </div>
      );
    }
    
    return commentsAndDetails.map(detail => {
      switch (detail.type) {
        case 'input':
          return (
            <Input
              key={detail.id}
              placeholder={detail.label}
              value={detail.value}
              style={{ marginBottom: 8 }}
            />
          );
        case 'labelInput':
          return (
            <div key={detail.id} style={{ marginBottom: 8 }}>
              <Text strong>{detail.label}:</Text>
              <Input
                value={detail.value}
                style={{ marginLeft: 8, width: 200 }}
              />
            </div>
          );
        case 'inlineInput':
          return (
            <div key={detail.id} style={{ marginBottom: 8 }}>
              <Text>{detail.label}: </Text>
              <Input
                value={detail.value}
                style={{ width: 100, display: 'inline-block' }}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const columns = [
    {
      title: 'Inspection Item',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space onClick={() => handleOpenModal(record)} direction="vertical" size={0}>
          <Text strong className={styles.inspectionItemText}>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio.Group
            value={formMeta?.inspectionData[record.key]?.approved}
            onChange={(e) => handleActionChange(record, e.target.value)}
            size="small"
          >
            <Radio value={true}>
              Approve
            </Radio>
            <Radio value={false}>
              Decline
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
  ];

  const handleApprove = () => {
    Modal.confirm({
      title: 'Confirm Approval',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to approve this form? This action cannot be undone.',
      okText: 'Yes, Approve',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await handleSave(false);
          await operateForm(formId, 'approve', overallComment);
          message.success({
            content: 'Form approved successfully',
            duration: 1,
            onClose: () => {
              navigate('/pc/to-review');
            }
          });
        } catch (error) {
          console.error('Failed to approve form:', error);
          message.error('Failed to approve form');
        }
      },
    });
  };

  const handleDecline = () => {
    Modal.confirm({
      title: 'Confirm Decline',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to decline this form? This action cannot be undone.',
      okText: 'Yes, Decline',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await handleSave(false);
          await operateForm(formId, 'decline', overallComment);
          message.success({
            content: 'Form declined successfully',
            duration: 1,
            onClose: () => {
              navigate('/pc/to-review');
            }
          });
        } catch (error) {
          console.error('Failed to decline form:', error);
          message.error('Failed to decline form');
        }
      },
    });
  };

  const handleSave = async (alert = true) => {
    try {
      // Build save data
      const saveData = {
        id: formId,
        inspectionData: formMeta,
        overallComment: overallComment
      };
      
      await saveFormData(saveData);
      alert && message.success('Form saved successfully');
    } catch (error) {
      console.error('Failed to save form:', error);
      message.error('Failed to save form');
    }
  };

  // Render dynamic form fields
  const renderFormFields = () => {
    if (!templateData?.formFields || !Array.isArray(templateData.formFields)) {
      return null;
    }

    return templateData.formFields.map((field, index) => {
      return (
        <Col span={12} key={field.name}>
          <div className={styles.infoGroup}>
            <div className={styles.infoItem}>
              <span className={styles.label}>{field.label}:</span>
              <span className={styles.value}>{formMeta?.metaData[field.name]}</span>
            </div>
          </div>
        </Col>
      );
    });
  };


  if (loading) {
    return (
      <Layout className={styles.reviewFormLayout}>
        <Content className={styles.content}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text>Loading form data...</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  if (!formMeta) {
    return (
      <Layout className={styles.reviewFormLayout}>
        <Content className={styles.content}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text>No form data available</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className={styles.reviewFormLayout}>
      <Content className={styles.content}>
        <Title level={2} className={styles.pageTitle}>{templateData?.name}</Title>

        {/* Basic Form Information */}
        <Card title="Basic Information" className={styles.infoCard}>
          <div className={styles.basicInfoContainer}>
            {/* Submitter Information - Single Row */}
            <div className={styles.submitterSection}>
              <div className={styles.sectionTitle}>Submitter Information</div>
              <div className={styles.submitterRow}>
                <div className={styles.submitterItem}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{formMeta?.creator}</span>
                </div>
                <div className={styles.submitterItem}>
                  <span className={styles.label}>Created At:</span>
                  <span className={styles.value}>{formMeta?.createdAt}</span>
                </div>
                <div className={styles.submitterItem}>
                  <span className={styles.label}>Status:</span>
                  <span className={styles.value}>{formMeta?.status}</span>
                </div>
              </div>
            </div>

            {/* Form Information */}
            <div className={styles.locationSection}>
              <div className={styles.sectionTitle}>Form Information</div>
              <Row gutter={[24, 16]}>
                {renderFormFields()}
              </Row>
            </div>
          </div>
        </Card>

        {/* Inspection Items Table */}
        <Card title="Inspection Items" className={styles.inspectionItemsCard}>
          <Table
            columns={columns}
            dataSource={templateData?.inspectionItems}
            pagination={false}
            bordered
            rowKey="key"
            className={styles.inspectionTable}
          />
        </Card>

        {/* Overall Comment */}
        <Card title="Overall Comment" className={styles.commentCard}>
          <TextArea
            rows={4}
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
            placeholder="Enter your overall comment here..."
            disabled={formMeta?.status !== 'pending'}
            readOnly={formMeta?.status !== 'pending'}
          />
        </Card>

        {/* Inspection Item Detail Modal */}
        <Modal
          title={selectedItem ? `Inspection Item: ${selectedItem.name}` : 'Inspection Item'}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
          width={800}
          style={{ top: 20 }}
          styles={{
            body: {
              maxHeight: 'calc(100vh - 200px)', 
              overflowY: 'auto',
              padding: '16px'
            }
          }}
          className={styles.detailModal}
        >
          {selectedItem && (
            <div className={styles.modalContent}>
              <Descriptions column={1} bordered size="small" className={styles.itemInfo}>
                <Descriptions.Item label="Type">
                  <Tag color={getTypeColor(selectedItem.type)}>{selectedItem.type}</Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Guidances</Divider>
              <div className={styles.guidancesSection}>
                {templateData?.guidanceContent[selectedItem.key]?.map((guidance) => {
                  const hasMedia = guidance.type === 'image' || guidance.type === 'video';
                  const isChecked = formMeta?.inspectionData?.[selectedItem.key]?.guidance?.[guidance.key]?.completed || false;
                  
                  return (
                    <div key={guidance.key} style={{ display: hasMedia ? 'flex' : 'block' }} className={styles.guidanceItem}>
                      <Checkbox
                        checked={isChecked}
                      >
                        {hasMedia? '' : guidance.content}
                      </Checkbox>
                      {hasMedia && (
                        <div className={styles.mediaContainer}>
                          {renderMediaContent([{ type: guidance.type, url: guidance.content }])}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <Divider orientation="left">Comments & Details</Divider>
              <div className={styles.commentsDetailsSection}>
                {renderCommentsAndDetails(selectedItem.key)}
              </div>
            </div>
          )}
        </Modal>
      </Content>
      {/* Action Buttons */}
      {formMeta?.status === 'pending' && (
        <div className={styles.actionArea}>
          <Space size="large">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleApprove}
              className={styles.approveButton}
            >
              Approve
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={handleDecline}
              className={styles.declineButton}
            >
              Decline
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              className={styles.saveButton}
            >
              Save
            </Button>
          </Space>
        </div>
      )}
    </Layout>
  );
};

export default ReviewFormPage;

