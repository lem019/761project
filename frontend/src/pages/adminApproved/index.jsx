import React, { useState, useEffect } from 'react';
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
    formName: 'IND81 PMR Maintenance Service Report',
    completedTime: '2021-02-05 08:28:36'
  },
  {
    id: 2,
    formName: 'IND80 Booth Maintenance Service Report',
    completedTime: '2021-02-03 19:49:33'
  },
  {
    id: 3,
    formName: 'IND80 Dynapumps Booth Maintenance Service Report',
    completedTime: '2021-02-02 19:17:15'
  },
  {
    id: 4,
    formName: 'Report 4',
    completedTime: '2021-02-02 09:46:33'
  },
  {
    id: 5,
    formName: 'Report 5',
    completedTime: '2021-02-02 07:57:01'
  },
  {
    id: 6,
    formName: 'Report 94',
    completedTime: '2021-02-02 05:01:54'
  },
  {
    id: 7,
    formName: 'IND82 PMR Maintenance Service Report',
    completedTime: '2021-02-01 16:30:22'
  },
  {
    id: 8,
    formName: 'IND81 Dynapumps Booth Maintenance Service Report',
    completedTime: '2021-02-01 14:15:45'
  },
  {
    id: 9,
    formName: 'IND83 Booth Maintenance Service Report',
    completedTime: '2021-01-31 11:20:18'
  },
  {
    id: 10,
    formName: 'IND82 PMR Maintenance Service Report',
    completedTime: '2021-01-31 09:45:33'
  }
];

const AdminApproved = () => {
  const [searchFormName, setSearchFormName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState(mockData);

  // 过滤数据
  useEffect(() => {
    let filtered = mockData;

    // 按表单名称过滤
    if (searchFormName) {
      filtered = filtered.filter(item =>
        item.formName.toLowerCase().includes(searchFormName.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [searchFormName]);

  // 分页数据
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = () => {
    // 搜索逻辑已在 useEffect 中处理
  };

  const handleReset = () => {
    setSearchFormName('');
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: 'Form Name',
      dataIndex: 'formName',
      key: 'formName',
      render: (text) => (
        <Text style={{ color: '#1890ff', cursor: 'pointer' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'CompletedTime',
      dataIndex: 'completedTime',
      key: 'completedTime',
      sorter: (a, b) => new Date(a.completedTime) - new Date(b.completedTime),
      render: (text) => <Text>{text}</Text>,
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
                <Text className={styles.searchLabel}>Form Name:</Text>
                <Input
                  placeholder="Please enter form name"
                  value={searchFormName}
                  onChange={(e) => setSearchFormName(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
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

export default AdminApproved;