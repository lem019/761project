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
  message
} from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { getFormList } from '@/services/form-service';
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

  // 获取已审核表单列表数据
  const fetchReviewedList = async () => {
    try {
      setLoading(true);
      const response = await getFormList({
        status: 'approved',
        page: currentPage,
        pageSize,
        viewMode: 'reviewer'
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

  // 初始加载和分页变化时重新获取数据
  useEffect(() => {
    fetchReviewedList();
  }, [currentPage, pageSize]);

  // 分页数据
  const paginatedData = filteredData;

  const handleSearch = () => {
    // 搜索逻辑已在 useEffect 中处理
  };

  const handleReset = () => {
    setSearchInspectors('');
    setSearchFormName('');
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
      sorter: (a, b) => a.formName.localeCompare(b.formName),
      render: (text) => (
        <Text style={{ color: '#1890ff', cursor: 'pointer' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Inspectors',
      dataIndex: 'inspectors',
      key: 'inspectors',
      sorter: (a, b) => a.inspectors.localeCompare(b.inspectors),
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
        <div>
          <Button
            type="link"
            onClick={() => handleReviewAndDownload(record)}
            style={{ color: '#1890ff' }}
          >
            Review
          </Button>
          <Button
            type="link"
            onClick={() => handleReviewAndDownload(record)}
            style={{ color: '#1890ff' }}
          >
            Download
          </Button>
        </div>
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
                  placeholder="example"
                  value={searchInspectors}
                  onChange={(e) => setSearchInspectors(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.searchItem}>
                <Text className={styles.searchLabel}>Form Name:</Text>
                <Input
                  placeholder="Please enter form name"
                  value={searchFormName}
                  onChange={(e) => setSearchFormName(e.target.value)}
                  className={styles.searchInput}
                />
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