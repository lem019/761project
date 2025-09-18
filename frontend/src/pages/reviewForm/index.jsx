import React, { useState } from 'react';
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
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

// Mock data
const formMeta = {
  submittedBy: {
    name: "Nigel Blake",
    mobile: "0408 742 659",
  },
  submittedAt: "2025-07-07",
  location: {
    contactPerson: "Andrew Buck",
    businessName: "DYNAPUMPS",
    address: "22 Homestead Drive",
    suburb: "StaplYton QLD 4207",
    phone: ["0459 578 705", "(07) 5546 7777"],
    email: "Andrew.Buck@dynapumps.com",
  }
};

const inspectionItems = [
  {
    id: 1,
    name: "Worksite",
    type: "Visual",
    guidances: [
      {
        id: "g1",
        text: "Site sign-in. Clear access. Hazards identified.",
        checked: true,
        media: [
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
        ]
      },
      {
        id: "g2",
        text: "Personal protection, Isolation & tag out.",
        checked: true,
        media: [
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ]
      }
    ],
    commentsAndDetails: [
      { id: "c1", type: "input", label: "Inspector Note", value: "" },
    ],
    comment: "",
    action: null,
  },
  {
    id: 2,
    name: "Inlet Fan",
    type: "Visual",
    guidances: [
      {
        id: "g3",
        text: "Check vane and impeller, ensure free rotation",
        checked: true,
        media: [
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" }
        ]
      },
      {
        id: "g4",
        text: "Inspect fan cabin fixing, seal, electrical connection",
        checked: true,
        media: [
          { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ]
      },
      {
        id: "g5",
        text: "Check filters, motors run, belts intact",
        checked: true,
        media: [
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
        ]
      },
    ],
    commentsAndDetails: [
      { id: "c4", type: "labelInput", label: "Number of Fans", value: "1" },
      { id: "c5", type: "labelInput", label: "Axial Fan", value: "✔" },
      { id: "c6", type: "labelInput", label: "Centrifugal", value: "✔" },
    ],
    comment: "",
    action: null,
  },
  {
    id: 3,
    name: "Purge Cycles",
    type: "Operation",
    guidances: [
      {
        id: "g6",
        text: "Prior to spraying pre-purge",
        checked: true,
        media: []
      },
      {
        id: "g7",
        text: "Post-purge following spray cycle only",
        checked: true,
        media: [
          { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
        ]
      },
      {
        id: "g8",
        text: "Pre-purge cycle for independent bake cycle",
        checked: true,
        media: [
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "img", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" },
          { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" }
        ]
      },
    ],
    commentsAndDetails: [
      { id: "c7", type: "inlineInput", label: "Pre-purge (minutes)", value: "1.30" },
      { id: "c8", type: "inlineInput", label: "Post-purge (minutes)", value: "1.30" },
      { id: "c9", type: "inlineInput", label: "Bake cycle pre-purge (minutes)", value: "1.30" },
    ],
    comment: "",
    action: null,
  }
];

const ReviewFormPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [overallComment, setOverallComment] = useState('');
  const [itemsData, setItemsData] = useState(inspectionItems);

  const handleRowDoubleClick = (record) => {
    console.log('handleRowDoubleClick triggered', record);
    console.log('Current modal state:', isModalVisible);
    setSelectedItem(record);
    setIsModalVisible(true);
    console.log('Modal should be visible now');
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const handleGuidanceChange = (itemId, guidanceId, checked) => {
    setItemsData(prevData =>
      prevData.map(item =>
        item.id === itemId
          ? {
            ...item,
            guidances: item.guidances.map(g =>
              g.id === guidanceId ? { ...g, checked } : g
            )
          }
          : item
      )
    );
  };

  const handleDetailChange = (itemId, detailId, value) => {
    setItemsData(prevData =>
      prevData.map(item =>
        item.id === itemId
          ? {
            ...item,
            commentsAndDetails: item.commentsAndDetails.map(d =>
              d.id === detailId ? { ...d, value } : d
            )
          }
          : item
      )
    );
  };

  const handleActionChange = (itemId, action) => {
    setItemsData(prevData =>
      prevData.map(item =>
        item.id === itemId ? { ...item, action } : item
      )
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Visual':
        return 'blue';
      case 'Operation':
        return 'green';
      case 'Visual & Operation':
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
            {media.type === 'img' ? (
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

  const renderCommentsAndDetails = (details) => {
    return details.map(detail => {
      switch (detail.type) {
        case 'input':
          return (
            <Input
              key={detail.id}
              placeholder={detail.label}
              value={detail.value}
              onChange={(e) => handleDetailChange(selectedItem.id, detail.id, e.target.value)}
              style={{ marginBottom: 8 }}
            />
          );
        case 'labelInput':
          return (
            <div key={detail.id} style={{ marginBottom: 8 }}>
              <Text strong>{detail.label}:</Text>
              <Input
                value={detail.value}
                onChange={(e) => handleDetailChange(selectedItem.id, detail.id, e.target.value)}
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
                onChange={(e) => handleDetailChange(selectedItem.id, detail.id, e.target.value)}
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
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
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
            value={action}
            onChange={(e) => handleActionChange(record.id, e.target.value)}
            size="small"
          >
            <Radio value="approve">
              Approve
            </Radio>
            <Radio value="decline">
              Decline
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
  ];

  const handleApprove = () => {
    console.log('Approve clicked', { itemsData, overallComment });
    // Handle approve logic here
  };

  const handleDecline = () => {
    console.log('Decline clicked', { itemsData, overallComment });
    // Handle decline logic here
  };

  const handleSave = () => {
    console.log('Save clicked', { itemsData, overallComment });
    // Handle save logic here
  };


  return (
    <Layout className={styles.reviewFormLayout}>
      <Content className={styles.content}>
        <Title level={2} className={styles.pageTitle}>SPRAY BOOTH MAINTENANCE SERVICE REPORT</Title>

        {/* Basic Form Information */}
        <Card title="Basic Information" className={styles.infoCard}>
          <div className={styles.basicInfoContainer}>
            {/* Submitter Information - Single Row */}
            <div className={styles.submitterSection}>
              <div className={styles.sectionTitle}>Submitter Information</div>
              <div className={styles.submitterRow}>
                <div className={styles.submitterItem}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{formMeta.submittedBy.name}</span>
                </div>
                <div className={styles.submitterItem}>
                  <span className={styles.label}>Mobile:</span>
                  <span className={styles.value}>{formMeta.submittedBy.mobile}</span>
                </div>
                <div className={styles.submitterItem}>
                  <span className={styles.label}>Submitted At:</span>
                  <span className={styles.value}>{formMeta.submittedAt}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className={styles.locationSection}>
              <div className={styles.sectionTitle}>Location Information</div>
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <div className={styles.infoGroup}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Contact Person:</span>
                      <span className={styles.value}>{formMeta.location.contactPerson}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Business Name:</span>
                      <span className={styles.value}>{formMeta.location.businessName}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Address:</span>
                      <span className={styles.value}>{formMeta.location.address}</span>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.infoGroup}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Suburb:</span>
                      <span className={styles.value}>{formMeta.location.suburb}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Phone:</span>
                      <span className={styles.value}>{formMeta.location.phone.join(', ')}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Email:</span>
                      <span className={styles.value}>{formMeta.location.email}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>

        {/* Inspection Items Table */}
        <Card title="Inspection Items" className={styles.inspectionItemsCard}>
          <Table
            columns={columns}
            dataSource={itemsData}
            pagination={false}
            bordered
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleRowDoubleClick(record),
            })}
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
                {selectedItem.guidances.map((guidance) => {
                  if (guidance.media.length <= 0) {
                    return (
                      <div key={guidance.id} className={styles.guidanceItem}>
                        <Checkbox
                          checked={guidance.checked}
                          onChange={(e) => handleGuidanceChange(selectedItem.id, guidance.id, e.target.checked)}
                        >
                          {guidance.text}
                        </Checkbox>
                      </div>
                    )
                  } else {
                    return (
                      <Collapse
                        // defaultActiveKey={guidance.id}
                        ghost
                        className={styles.guidanceCollapse}
                      >
                        <Collapse.Panel
                          key={guidance.id}
                          header={
                            <div className={styles.guidanceHeader}>
                              <Checkbox
                                checked={guidance.checked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleGuidanceChange(selectedItem.id, guidance.id, e.target.checked);
                                }}
                                className={styles.guidanceCheckbox}
                              >
                                {guidance.text}
                              </Checkbox>
                            </div>
                          }
                          className={styles.guidancePanel}
                        >
                          {guidance.media && guidance.media.length > 0 ? (
                            renderMediaContent(guidance.media)
                          ) : (
                            <div className={styles.noMediaMessage}>
                              <Text type="secondary">No media content available for this guidance.</Text>
                            </div>
                          )}
                        </Collapse.Panel>
                      </Collapse>
                    )
                  }
                })}
              </div>

              <Divider orientation="left">Comments & Details</Divider>
              <div className={styles.commentsDetailsSection}>
                {renderCommentsAndDetails(selectedItem.commentsAndDetails)}
              </div>
            </div>
          )}
        </Modal>
      </Content>
      {/* Action Buttons */}
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
    </Layout>
  );
};

export default ReviewFormPage;

