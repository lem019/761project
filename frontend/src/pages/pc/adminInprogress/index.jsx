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
  Col,
  Spin,
  message
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getFormList } from '@/services/form-service';
import styles from './index.module.less';
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

// 状态映射
const statusMap = {
  'pending': { color: '#faad14', text: 'Pending' },
  'draft': { color: '#1890ff', text: 'Draft' },
  'declined': { color: '#ff4d4f', text: 'Declined' },
  'approved': { color: '#52c41a', text: 'Approved' }
};

const AdminInprogress = () => {
  const [searchFormName, setSearchFormName] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // 获取表单列表数据
  const fetchFormList = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'All' ? 'all' : statusFilter.toLowerCase();
      const response = await getFormList({
        status,
        page: currentPage,
        pageSize
      });

      if (response) {
        const items = response.items || [];
        setFilteredData(items.map(item => ({
          id: item.id,
          formName: item.templateName || 'Unknown Form',
          status: item.status,
          createTime: item.createdAt || ''
        })));
        setTotal(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error('获取表单列表失败:', error);
      message.error('获取表单列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时重新获取数据
  useEffect(() => {
    fetchFormList();
  }, [currentPage, pageSize, statusFilter]);

  // 分页数据
  const paginatedData = filteredData;

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
        const statusInfo = statusMap[status] || { color: '#999', text: status };
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
        {/* <div className={styles.searchSection}>
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
        </div> */}

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
            onRow={(record) => ({
            onClick: () => {
              if (record.status === "draft") {
                const templateId = record.templateId || "pmr";
                navigate(`/pc/template/${templateId}?id=${record.id}`);
              }
              if (record.status === "pending") {
                const templateId = record.templateId || "pmr";
                navigate(`/pc/template/${templateId}?id=${record.id}&view=1`);
              }
            },
            style: record.status === "draft" ? { cursor: "pointer" } : {},
          })}
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

export default AdminInprogress;