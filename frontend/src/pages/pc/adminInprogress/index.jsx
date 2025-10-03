import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Card,
  Pagination,
  Tag,
  Typography,
  Spin,
  message,
  Empty
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFormList } from '@/services/form-service';
import styles from './index.module.less';
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Text, Title } = Typography;

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
  const fetchFormList = async (override = {}) => {
    try {
      setLoading(true);
      const status = statusFilter === 'All' ? "draft,pending,declined" : statusFilter.toLowerCase();
      const pageParam = override.page ?? currentPage;
      const sizeParam = override.pageSize ?? pageSize;
      const formNameFilter = override.qFormName ?? searchFormName;

      const params = {
        status,
        page: pageParam,
        pageSize: sizeParam,
        // 将搜索词（表单名）传给后端做前缀匹配
        qFormName: formNameFilter
      };

      const response = await getFormList(params);

      if (response) {
        const items = response.items || [];
        setFilteredData(items.map(item => ({
          id: item.id,
          formName: item.templateName || 'Unknown Form',
          status: item.status,
          createTime: item.createdAt || '',
          templateId: item.templateId || 'pmr'
        })));
        setTotal(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch form list:', error);
      message.error('Failed to fetch form list');
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

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleFormClick = (record) => {
    if (record.status === "draft" || record.status === "declined") {
      navigate(`/pc/template/${record.templateId}?id=${record.id}`);
    } else if (record.status === "pending") {
      navigate(`/pc/template/${record.templateId}?id=${record.id}&view=1`);
    }
  };

  const handleEdit = (record, e) => {
    e.stopPropagation();
    handleFormClick(record);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      {/* 页面标题区域 */}
      <div className={styles.header}>
        <Title level={2} className={styles.title}>Inspections in Progress</Title>
        <Text className={styles.subtitle}>Manage your draft, pending, and declined inspections</Text>
      </div>

      {/* 搜索和筛选区域 */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search
            placeholder="Search inspections..."
            value={searchFormName}
            onChange={(e) => setSearchFormName(e.target.value)}
            onSearch={() => {
              setCurrentPage(1);
              fetchFormList({ page: 1, qFormName: searchFormName });
            }}
            className={styles.searchInput}
            prefix={<SearchOutlined />}
          />
        </div>
        
        {/* 状态筛选标签 */}
        <div className={styles.statusFilters}>
          <Button
            type={statusFilter === 'All' ? 'primary' : 'default'}
            onClick={() => handleStatusFilter('All')}
            className={`${styles.statusButton} ${statusFilter === 'All' ? styles.active : ''}`}
          >
            All
          </Button>
          <Button
            type={statusFilter === 'Draft' ? 'primary' : 'default'}
            onClick={() => handleStatusFilter('Draft')}
            className={`${styles.statusButton} ${statusFilter === 'Draft' ? styles.active : ''}`}
          >
            Draft
          </Button>
          <Button
            type={statusFilter === 'Pending' ? 'primary' : 'default'}
            onClick={() => handleStatusFilter('Pending')}
            className={`${styles.statusButton} ${statusFilter === 'Pending' ? styles.active : ''}`}
          >
            Pending
          </Button>
          <Button
            type={statusFilter === 'Declined' ? 'primary' : 'default'}
            onClick={() => handleStatusFilter('Declined')}
            className={`${styles.statusButton} ${statusFilter === 'Declined' ? styles.active : ''}`}
          >
            Declined
          </Button>
        </div>
      </div>

      {/* 检查项列表区域 */}
      <div className={styles.inspectionsSection}>
        <div className={styles.sectionHeader}>
          <Title level={4} className={styles.sectionTitle}>Your Inspections</Title>
          <Text className={styles.sectionSubtitle}>All your inspections across different stages</Text>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : paginatedData.length === 0 ? (
          <Empty description="No inspections found" />
        ) : (
          <div className={styles.inspectionsList}>
            {paginatedData.map((item) => {
              const statusInfo = statusMap[item.status] || { color: '#999', text: item.status };
              return (
                <Card
                  key={item.id}
                  className={styles.inspectionCard}
                  hoverable={item.status === 'draft'}
                  onClick={() => handleFormClick(item)}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardLeft}>
                      <Title level={5} className={styles.inspectionTitle}>
                        {item.formName}
                      </Title>
                      <div className={styles.cardMeta}>
                        <Tag color={statusInfo.color} className={styles.statusTag}>
                          {statusInfo.text}
                        </Tag>
                        <Text className={styles.createTime}>
                          Created: {formatDate(item.createTime)}
                        </Text>
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => handleEdit(item, e)}
                        className={styles.actionButton}
                      >
                        Edit
                      </Button>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleDelete(item, e)}
                        className={styles.actionButton}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 分页区域 */}
      {total > 0 && (
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
      )}
    </div>
  );
};

export default AdminInprogress;