import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Input,
  Table,
  Space,
  Card,
  Pagination,
  Select,
  Row,
  Col,
  message,
  Modal,
  Form,
  Spin
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getForm, createForm, deleteForm } from '@/api/form';
import styles from './index.module.less';

const { Search } = Input;
const { Option } = Select;

const statusMap = {
  0: 'Draft',
  1: 'To Review',
  2: 'Approved',
  3: 'Rejected'
};

const CreateForm = () => {
  const [searchFormType, setSearchFormType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // Mobile and infinite scroll related states
  const [isMobile, setIsMobile] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allForms, setAllForms] = useState([]);
  const scrollContainerRef = useRef(null);

  // Form type definitions
  const formTypes = [
    { value: '0', label: 'SPRAY BOOTH MAINTENANCE SERVICE REPORT' }
  ];

  const formTypeMap = {
    '0': 'SPRAY BOOTH MAINTENANCE SERVICE REPORT'
  };

  // Detect if it's mobile device
  const checkIsMobile = useCallback(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    return mobile;
  }, []);

  // Fetch forms list
  const fetchForms = async (page = currentPage, size = pageSize, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = {
        page: page,
        pageSize: size,
        formType: searchFormType
      };
      const response = await getForm(params);

      // Handle new API response format
      if (response && response.items) {
        const newForms = response.items || [];
        const responseTotal = response.pagination?.total || 0;
        
        if (append) {
          // Infinite scroll mode: append data
          setAllForms(prev => [...prev, ...newForms]);
          setHasMore(newForms.length === pageSize && allForms.length + newForms.length < responseTotal);
        } else {
          // Pagination mode: replace data
          setForms(newForms);
          setTotal(responseTotal);
          setAllForms(newForms);
        }
      } else {
        // Compatible with old format
        const newForms = response || [];
        if (append) {
          setAllForms(prev => [...prev, ...newForms]);
          setHasMore(newForms.length === pageSize);
        } else {
          setForms(newForms);
          setTotal(newForms.length);
          setAllForms(newForms);
        }
      }
    } catch (error) {
      message.error('Failed to fetch forms list');
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Component mount: fetch data and detect mobile
  useEffect(() => {
    checkIsMobile();
    fetchForms();
    
    // Listen for window resize
    const handleResize = () => {
      checkIsMobile();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkIsMobile]);

  // Infinite scroll load more data
  const loadMore = useCallback(async () => {
    if (!isMobile || loadingMore || !hasMore) return;
    
    const nextPage = Math.floor(allForms.length / pageSize) + 1;
    await fetchForms(nextPage, pageSize, true);
  }, [isMobile, loadingMore, hasMore, allForms.length, pageSize]);

  // Scroll event handler
  const handleScroll = useCallback((e) => {
    if (!isMobile) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && hasMore && !loadingMore) {
      loadMore();
    }
  }, [isMobile, hasMore, loadingMore, loadMore]);

  const columns = [
    {
      title: 'Form Name',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => {
        return formTypeMap[record.type] || title;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return statusMap[status] || status;
      }
    },
    {
      title: 'Create Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp) => {
        return timestamp;
        // return new Date(timestamp).toLocaleString();
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleContinue(record)}>Continue</a>
          {record.status === 0 && (
            <a
              onClick={() => handleDelete(record)}
              style={{ color: '#ff4d4f' }}
            >
              Delete
            </a>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    // Reset state and refetch data
    setCurrentPage(1);
    setAllForms([]);
    setHasMore(true);
    fetchForms(1, pageSize, false);
  };

  const handleReset = () => {
    setSearchFormType('');
    setCurrentPage(1);
    setAllForms([]);
    setHasMore(true);
    fetchForms(1, pageSize, false);
  };

  const handleCreateForm = () => {
    setOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      setLoading(true);
      // Call create form API
      await createForm({ type: values.formType });
      message.success('Form created successfully');
      // Close modal and reset form
      setOpen(false);
      form.resetFields();
      // Refetch list
      setCurrentPage(1);
      setAllForms([]);
      setHasMore(true);
      await fetchForms(1, pageSize, false);
    } catch (error) {
      if (error.errorFields) {
        // Form validation failed
        return;
      }
      console.error('Error creating form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleContinue = (record) => {
    // Navigate to form edit page
    console.log('Continue editing form:', record);
    // Add routing logic here
    // navigate(`/form-edit/${record.id}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete this form?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      centered: isMobile,
      width: isMobile ? '90%' : 416,
      onOk: async () => {
        try {
          setLoading(true);
          await deleteForm(record.id);
          message.success('Delete successful');
          // Refetch list
          setCurrentPage(1);
          setAllForms([]);
          setHasMore(true);
          await fetchForms(1, pageSize, false);
        } catch (error) {
          message.error('Delete failed');
          console.error('Error deleting form:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Mobile card component
  const FormCard = ({ form }) => (
    <Card className={styles['mobile-form-card']} size="small">
      <div className={styles['card-header']}>
        <div className={styles['form-title']}>
          {formTypeMap[form.type] || form.title}
        </div>
        <div className={`${styles['status-badge']} ${styles[`status-${form.status}`]}`}>
          {statusMap[form.status] || form.status}
        </div>
      </div>

      <div className={styles['card-content']}>
        <div className={styles['form-info']}>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>Create Time:</span>
            <span className={styles['info-value']}>{form.createdAt}</span>
          </div>
        </div>
      </div>

      <div className={styles['card-actions']}>
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleContinue(form)}
        >
          Continue
        </Button>
        {form.status === 0 && (
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(form)}
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className={styles['page-container']}>
      {/* Create button */}
      <Row gutter={16} align="middle">
        <Col md={24} xs={3} sm={3} xl={24} xxl={24}>
          <div className={styles['create-button-container']}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateForm}
            >
             { isMobile ? '' : 'Create Form' } 
            </Button>
          </div>
        </Col>
        <Col md={24} xs={21} sm={21} xl={24} xxl={24}>
          {/* Search form */}
          <Card className={styles['search-card']} size={isMobile ? 'small' : ''}>
            <Form title={isMobile ? '' : 'Search Form'}>
              <Row gutter={16} align="middle">
                <Col md={6} xs={24} sm={24}>
                 { isMobile ? '' : <label className={styles['form-name-label']}>
                    Form Type:
                  </label>}
                  <Select
                    placeholder="Select form type"
                    options={formTypes}
                    value={searchFormType}
                    style={{ width: '100%' }}
                    allowClear
                    onChange={(value) => {
                      setSearchFormType(value);
                      setCurrentPage(1);
                      setAllForms([]);
                      setHasMore(true);
                      // Delay search execution to avoid frequent calls
                      setTimeout(() => handleSearch(), 100);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(1);
                        handleSearch();
                      }
                    }}
                  >
                  </Select>
                </Col>
                <Col span={6} className={styles['button-group']}>
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                    >
                      {isMobile ? '' : 'Reset'}
                    </Button>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleSearch}
                    >
                      {isMobile ? '' : 'Query'}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>




      {/* Data display area */}
      {isMobile ? (
        /* Mobile card list */
        <div
          className={styles['mobile-cards-container']}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className={styles['cards-list']}>
            {allForms?.map((form, index) => (
              <FormCard key={form.id || index} form={form} />
            ))}
          </div>

          {/* Load more indicator */}
          {loadingMore && (
            <div className={styles['loading-more']}>
              <Spin size="small" />
              <span>Loading more...</span>
            </div>
          )}

          {!hasMore && allForms.length > 0 && (
            <div className={styles['no-more-data']}>
              No more data
            </div>
          )}
        </div>
      ) : (
        /* Desktop table */
        <Card className={styles['table-card']}>
          <Table
            columns={columns}
            dataSource={forms}
            pagination={false}
            loading={loading}
            rowKey="id"
          />

          {/* Pagination */}
          <div className={styles['pagination-container']}>
            <span className={styles['pagination-info']}>
              {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, total)} of ${total} items`}
            </span>
            <div className={styles['pagination-controls']}>
              <span className={styles['page-size-text']}>10/page</span>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                showSizeChanger={false}
                showQuickJumper
                onChange={(page) => {
                  setCurrentPage(page);
                  fetchForms(page, pageSize);
                }}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
            </div>
          </div>
        </Card>
      )}

      <Modal
        title="Create New Form"
        open={open}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        confirmLoading={loading}
        okText="Create"
        cancelText="Cancel"
        centered={isMobile}
        width={isMobile ? '90%' : 520}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Form Type" name="formType" rules={[{ required: true, message: 'Please select your form type!' }]}>
            <Select
              autoFocus
              placeholder="Select form type"
              options={formTypes}
              allowClear
            >
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateForm;