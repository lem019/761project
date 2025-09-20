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
  Col
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

// 模拟数据
const mockData = [
  {
    id: 1,
    formName: 'TradeCode 99',
    inspectors: 'Vel cras auctor at tortor imperdiet amet id sed rhonc',
    createTime: '2021-02-05 08:28:36',
    submitTime: '2021-02-05 08:28:36'
  },
  {
    id: 2,
    formName: 'TradeCode 98',
    inspectors: 'Mauris quam tristique et parturient sapien.',
    createTime: '2021-02-04 15:30:22',
    submitTime: '2021-02-04 15:30:22'
  },
  {
    id: 3,
    formName: 'TradeCode 97',
    inspectors: 'Molestie est pharetra eu conque velit felis ipsum veli',
    createTime: '2021-02-03 12:15:45',
    submitTime: '2021-02-03 12:15:45'
  },
  {
    id: 4,
    formName: 'TradeCode 96',
    inspectors: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    createTime: '2021-02-02 09:45:33',
    submitTime: '2021-02-02 09:45:33'
  },
  {
    id: 5,
    formName: 'TradeCode 95',
    inspectors: 'Sed do eiusmod tempor incididunt ut labore et dolore',
    createTime: '2021-02-01 16:20:18',
    submitTime: '2021-02-01 16:20:18'
  },
  {
    id: 6,
    formName: 'TradeCode 94',
    inspectors: 'Molestie est pharetra eu conque velit felis ipsum veli',
    createTime: '2021-01-31 14:10:55',
    submitTime: '2021-01-31 14:10:55'
  },
  {
    id: 7,
    formName: 'TradeCode 93',
    inspectors: 'Ut enim ad minim veniam quis nostrud exercitation',
    createTime: '2021-01-30 11:35:42',
    submitTime: '2021-01-30 11:35:42'
  },
  {
    id: 8,
    formName: 'TradeCode 92',
    inspectors: 'Duis aute irure dolor in reprehenderit in voluptate',
    createTime: '2021-01-29 08:25:17',
    submitTime: '2021-01-29 08:25:17'
  },
  {
    id: 9,
    formName: 'TradeCode 91',
    inspectors: 'Excepteur sint occaecat cupidatat non proident sunt',
    createTime: '2021-01-28 13:40:29',
    submitTime: '2021-01-28 13:40:29'
  },
  {
    id: 10,
    formName: 'TradeCode 90',
    inspectors: 'In culpa qui officia deserunt mollit anim id est',
    createTime: '2021-01-27 10:15:36',
    submitTime: '2021-01-27 10:15:36'
  }
];

const ToReviewList = () => {
  const navigate = useNavigate();
  const [searchInspectors, setSearchInspectors] = useState('');
  const [searchFormName, setSearchFormName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState(mockData);

  // 过滤数据
  useEffect(() => {
    let filtered = mockData;

    // 按检查员过滤
    if (searchInspectors) {
      filtered = filtered.filter(item =>
        item.inspectors.toLowerCase().includes(searchInspectors.toLowerCase())
      );
    }

    // 按表单名称过滤
    if (searchFormName) {
      filtered = filtered.filter(item =>
        item.formName.toLowerCase().includes(searchFormName.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [searchInspectors, searchFormName]);

  // 分页数据
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const handleReview = (record) => {
    console.log('Review record:', record);
    // 跳转到审核页面，传递记录ID作为参数
    navigate(`/pc/review-form?id=${record.id}&formName=${encodeURIComponent(record.formName)}`);
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
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Submit Time',
      dataIndex: 'submitTime',
      key: 'submitTime',
      sorter: (a, b) => new Date(a.submitTime) - new Date(b.submitTime),
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleReview(record)}
          style={{ color: '#1890ff' }}
        >
          Review
        </Button>
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
            />
          </div>

          {/* 分页区域 */}
          <div className={styles.paginationSection}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
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