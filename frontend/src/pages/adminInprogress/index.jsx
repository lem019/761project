import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Table,
  Space,
  Card,
  Pagination,
  Select,
  Tag,
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
    status: 'Pending',
    createTime: '2024-01-15 14:30:22'
  },
  {
    id: 2,
    formName: 'IND80 Dynapumps Booth Maintenance Service Report',
    status: 'Draft',
    createTime: '2024-01-14 09:15:45'
  },
  {
    id: 3,
    formName: 'IND80 Booth Maintenance Service Report',
    status: 'Declined',
    createTime: '2024-01-13 16:22:18'
  },
  {
    id: 4,
    formName: 'IND81 PMR Maintenance Service Report',
    status: 'Pending',
    createTime: '2024-01-12 11:08:33'
  },
  {
    id: 5,
    formName: 'IND80 Dynapumps Booth Maintenance Service Report',
    status: 'Draft',
    createTime: '2024-01-11 13:45:07'
  },
  {
    id: 6,
    formName: 'IND80 Booth Maintenance Service Report',
    status: 'Pending',
    createTime: '2024-01-10 10:12:56'
  },
  {
    id: 7,
    formName: 'IND82 PMR Maintenance Service Report',
    status: 'Draft',
    createTime: '2024-01-09 15:30:12'
  },
  {
    id: 8,
    formName: 'IND81 Dynapumps Booth Maintenance Service Report',
    status: 'Pending',
    createTime: '2024-01-08 09:45:33'
  },
  {
    id: 9,
    formName: 'IND83 Booth Maintenance Service Report',
    status: 'Declined',
    createTime: '2024-01-07 14:20:45'
  },
  {
    id: 10,
    formName: 'IND82 PMR Maintenance Service Report',
    status: 'Draft',
    createTime: '2024-01-06 11:15:22'
  }
];

const statusMap = {
  'Pending': { color: '#faad14', text: 'Pending' },
  'Draft': { color: '#1890ff', text: 'Draft' },
  'Declined': { color: '#ff4d4f', text: 'Declined' },
  'Approved': { color: '#52c41a', text: 'Approved' }
};

const AdminInprogress = () => {
  const [searchFormName, setSearchFormName] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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

    // 按状态过滤
    if (statusFilter !== 'All') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [searchFormName, statusFilter]);

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
    setStatusFilter('All');
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusInfo = statusMap[status];
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
      },
      filters: [
        { text: 'All', value: 'All' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Draft', value: 'Draft' },
        { text: 'Declined', value: 'Declined' },
        { text: 'Approved', value: 'Approved' },
      ],
      onFilter: (value, record) => {
        if (value === 'All') return true;
        return record.status === value;
      },
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
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
              <div className={styles.searchItem}>
                <Text className={styles.searchLabel}>Status:</Text>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className={styles.statusSelect}
                  placeholder="All"
                >
                  <Option value="All">All</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Draft">Draft</Option>
                  <Option value="Declined">Declined</Option>
                  <Option value="Approved">Approved</Option>
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

export default AdminInprogress;