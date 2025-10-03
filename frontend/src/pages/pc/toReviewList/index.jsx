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
  message
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getFormList, getFormTemplates } from '@/services/form-service';
import styles from './index.module.less';
import dayjs from 'dayjs';
const { Option } = Select;
const { Text } = Typography;

const ToReviewList = () => {
  const navigate = useNavigate();
  const [searchInspectors, setSearchInspectors] = useState('');
  const [searchFormName, setSearchFormName] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [formTemplates, setFormTemplates] = useState([]);

  // Get pending review form list data
  const fetchToReviewList = async (override = {}) => {
    try {
      setLoading(true);
      const pageParam = override.page ?? currentPage;
      const sizeParam = override.pageSize ?? pageSize;
      const inspectorFilter = override.qInspector ?? searchInspectors;
      const formNameFilter = override.qFormName ?? searchFormName;

      const params = {
        status: 'pending',
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
        setFilteredData(items);
        setTotal(response.pagination?.total || 0);
      }
    } catch (error) {
      message.error('Failed to get pending review form list');
    } finally {
      setLoading(false);
    }
  };

  // todo 毫无必要 这个页面不需要 template
  // Get form templates list
  const fetchFormTemplates = async () => {
    try {
      const templates = await getFormTemplates();
      setFormTemplates(templates || []);
    } catch (error) {
      message.error('Failed to get form templates list');
    }
  };

  // Initial load and re-fetch data when pagination changes
  useEffect(() => {
    fetchToReviewList();
  }, [currentPage, pageSize]);

  // Get form templates when page loads
  useEffect(() => {
    fetchFormTemplates();
  }, []);

  // Pagination data
  const paginatedData = filteredData;

  const handleSearch = () => {
    setCurrentPage(1);
    fetchToReviewList({ page: 1 });
  };

  const handleReset = () => {
    setSearchInspectors('');
    setSearchFormName(undefined);
    setCurrentPage(1);
    // Trigger search after reset
    fetchToReviewList({ page: 1, qInspector: '', qFormName: '' });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleReview = (record) => {
    // Navigate to review page, pass record ID as parameter
    navigate(`/pc/review-form?id=${record.id}&templateId=${record.templateId}`);
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
      render: (text, record) => (
        <Text
          style={{
            color: record.id === 6 ? '#722ed1' : 'inherit',
            textDecoration: record.id === 6 ? 'underline' : 'none'
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: 'Create Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Update Time',
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
        <Button
          type="primary"
          onClick={() => handleReview(record)}
          icon={<EyeOutlined />}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card className={styles.contentCard}>
        {/* Search area */}
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

        {/* Table area */}
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

        {/* Pagination area */}
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

export default ToReviewList;