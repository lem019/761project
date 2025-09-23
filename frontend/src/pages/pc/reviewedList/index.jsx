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
  Spin,
  message,
  Flex
} from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getFormList, getFormTemplates } from '@/services/form-service';
import styles from './index.module.less';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ReviewedList = () => {
  const navigate = useNavigate();
  const [searchInspectors, setSearchInspectors] = useState('');
  const [searchFormName, setSearchFormName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [formTemplates, setFormTemplates] = useState([]);

  // 获取已审核表单列表数据
  const fetchReviewedList = async () => {
    try {
      setLoading(true);
      const response = await getFormList({
        status: 'approved',
        page: currentPage,
        pageSize,
        viewMode: 'reviewer',
        inspector: searchInspectors,
        formName: searchFormName
      });

      if (response) {
        const items = response.items || [];
        setFilteredData(items.map(item => ({
          id: item.id,
          formName: item.templateName || 'Unknown Form',
          inspectors: item.creatorName || 'Unknown Inspector', // 这里需要从用户信息获取
          createTime: item.createdAt || '',
          approvedTime: item.reviewedAt || item.createdAt || ''
        })));
        setTotal(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error('获取已审核表单列表失败:', error);
      message.error('获取已审核表单列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取表单模板列表
  const fetchFormTemplates = async () => {
    try {
      const templates = await getFormTemplates();
      setFormTemplates(templates || []);
    } catch (error) {
      console.error('获取表单模板列表失败:', error);
      message.error('获取表单模板列表失败');
    }
  };

  // 初始加载和分页变化时重新获取数据
  useEffect(() => {
    fetchReviewedList();
  }, [currentPage, pageSize]);

  // 页面加载时获取表单模板
  useEffect(() => {
    fetchFormTemplates();
  }, []);

  // 分页数据
  const paginatedData = filteredData;

  const handleSearch = () => {
    // Reset to first page when searching
    setCurrentPage(1);
    // Trigger data fetch with current search parameters
    fetchReviewedList();
  };

  const handleReset = () => {
    setSearchInspectors('');
    setSearchFormName(undefined);
    setCurrentPage(1);
    // Trigger search after reset
    setTimeout(() => {
      fetchReviewedList();
    }, 0);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleReviewAndDownload = (record) => {
    console.log('Review and download record:', record);
    // 跳转到审核页面，传递记录ID作为参数
    navigate(`/pc/review-form?id=${record.id}&formName=${encodeURIComponent(record.formName)}&mode=view`);
  };

  const columns = [
    {
      title: 'Form Name',
      dataIndex: 'formName',
      key: 'formName',
      render: (text) => (
        <Text>
          {text}
        </Text>
      ),
    },
    {
      title: 'Inspectors',
      dataIndex: 'inspectors',
      key: 'inspectors',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Approved Time',
      dataIndex: 'approvedTime',
      key: 'approvedTime',
      sorter: (a, b) => new Date(a.approvedTime) - new Date(b.approvedTime),
      render: (text) => <Text>{text}</Text>,
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
            type="default"
            onClick={() => handleReviewAndDownload(record)}
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
        {/* 搜索区域 */}
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

        {/* 表格区域 */}
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

        {/* 分页区域 */}
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