import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Table,
  Space,
  Card,
  Pagination,
  Select,
  Typography,
  Row,
  Col,
  message,
  Flex
} from 'antd';
import dayjs from 'dayjs';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getFormList, getFormTemplates } from '@/services/form-service';
import styles from './index.module.less';

const { Option } = Select;
const { Text } = Typography;

const ReviewedList = () => {
  const navigate = useNavigate();
  const [searchInspectors, setSearchInspectors] = useState('');
  const [searchFormName, setSearchFormName] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [formTemplates, setFormTemplates] = useState([]);

  // Get reviewed form list data
  const fetchReviewedList = async (override = {}) => {
    try {
      setLoading(true);
      // TODO: need to include declined forms in the future
      const pageParam = override.page ?? currentPage;
      const sizeParam = override.pageSize ?? pageSize;
      const inspectorFilter = override.qInspector ?? searchInspectors;
      const formNameFilter = override.qFormName ?? searchFormName;

      const params = {
        status: 'approved',
        page: pageParam,
        pageSize: sizeParam,
        viewMode: 'reviewer'
      };

      if (typeof inspectorFilter === 'string' && inspectorFilter.trim()) {
        params.qInspector = inspectorFilter.trim();
      }
      if (typeof formNameFilter === 'string' && formNameFilter.trim()) {
        params.qFormName = formNameFilter.trim();
      }

      const response = await getFormList(params);

      if (response) {
        const items = response.items || [];
        setFilteredData(items.map(item => ({
          id: item.id,
          formName: item.templateName || 'Unknown Form',
          inspectors: item.creatorName || 'Unknown Inspector', // 这里需要从用户信息获取
          createTime: item.createdAt || '',
          approvedTime: item.reviewedAt || item.createdAt || '',
          templateId: item.templateId || 'pmr' // 添加templateId，使用默认值
        })));
        setTotal(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Failed to get reviewed form list:', error);
      message.error('Failed to get reviewed form list');
    } finally {
      setLoading(false);
    }
  };

  // Get form templates list
  const fetchFormTemplates = async () => {
    try {
      const templates = await getFormTemplates();
      setFormTemplates(templates || []);
    } catch (error) {
      console.error('Failed to get form templates list:', error);
      message.error('Failed to get form templates list');
    }
  };

  // Re-fetch data on initial load and pagination changes
  useEffect(() => {
    fetchReviewedList();
  }, [currentPage, pageSize]);

  // Get form templates on page load
  useEffect(() => {
    fetchFormTemplates();
  }, []);

  // Pagination data
  const paginatedData = filteredData;

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReviewedList({ page: 1 });
  };

  const handleReset = () => {
    setSearchInspectors('');
    setSearchFormName(undefined);
    setCurrentPage(1);
    // Trigger search after reset
    fetchReviewedList({ page: 1, qInspector: '', qFormName: '' });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleReviewAndDownload = (record) => {
    // Navigate to review page, passing record ID as parameter
    navigate(`/pc/review-form?id=${record.id}&templateId=${record.templateId}`);
  };

  const handleDownloadReport = (record) => {
    console.log('Download report record:', record);
    // 跳转到下载页面，使用templateId作为路径参数，id作为查询参数
    const templateId = record.templateId || 'pmr';
    navigate(`/pc/download-form/${templateId}?id=${record.id}&formName=${encodeURIComponent(record.formName)}`);
  };

  const columns = [
    {
      title: 'Form Name',
      dataIndex: 'templateName',
      key: 'templateName',
      render: (text) => (
        <Text>
          {text}
        </Text>
      ),
    },
    {
      title: 'Inspectors',
      dataIndex: ['metaData', 'inspector'],
      key: 'inspectors',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Create Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Approved Time',
      dataIndex: ['updatedAt', '_seconds'],
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt._seconds) - new Date(b.updatedAt._seconds),
      render: (text) => <Text>{
        dayjs(text * 1000).format('DD/MM/YYYY HH:mm:ss A')
      }</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex gap="middle">
          <Button
            type="primary"
            onClick={() => handleReviewAndDownload(record)}
            style={{ color: '#1890ff' }}
            icon={<EyeOutlined />}
          >
            Review
          </Button>
          <Button
            type="link"
            onClick={() => handleDownloadReport(record)}
            style={{ color: '#1890ff' }}
            icon={<DownloadOutlined />}
          >
            Download
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card className={styles.contentCard}>
        {/* Search Section */}
        <div className={styles.searchSection}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <div className={styles.searchItem}>
                <Text className={styles.searchLabel}>Inspectors:</Text>
                <Input
                  placeholder="please enter inspector name"
                  value={searchInspectors}
                  onChange={(e) => setSearchInspectors(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.searchItem}>
                <Text className={styles.searchLabel}>Form Name:</Text>
                <Select
                  placeholder="Please select form name"
                  value={searchFormName}
                  onChange={(value) => setSearchFormName(value)}
                  className={styles.searchInput}
                  allowClear
                >
                  {formTemplates.map(template => (
                    <Option key={template.id} value={template.name}>
                      {template.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Space className={styles.actionButtons}>
                <Button onClick={handleReset} className={styles.resetButton}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  onClick={handleSearch}
                  className={styles.queryButton}
                >
                  Query
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Table Section */}
        <div className={styles.tableSection}>
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey="id"
            pagination={false}
            className={styles.dataTable}
            size="middle"
            loading={loading}
          />
        </div>

        {/* Pagination Section */}
        <div className={styles.paginationSection}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            pageSizeOptions={['10', '20', '50', '100']}
            className={styles.pagination}
          />
        </div>
      </Card>
    </div>
  );
};

export default ReviewedList;