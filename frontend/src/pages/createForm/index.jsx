import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Table, 
  Space, 
  Card,
  Pagination,
  Select,
  Row,
  Col
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Search } = Input;
const { Option } = Select;

const CreateForm = () => {
  const [searchFormName, setSearchFormName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 模拟数据
  const mockData = [
    {
      key: '1',
      formName: 'TradeCode 99',
      createTime: '2021-02-05 08:28:36',
    },
    {
      key: '2',
      formName: 'TradeCode 98',
      createTime: '2021-02-05 08:28:36',
    },
    {
      key: '3',
      formName: 'TradeCode 97',
      createTime: '2021-02-05 08:28:36',
    },
    {
      key: '4',
      formName: 'TradeCode 96',
      createTime: '2021-02-05 08:28:36',
    },
    {
      key: '5',
      formName: 'TradeCode 95',
      createTime: '2021-02-05 08:28:36',
    },
  ];

  const columns = [
    {
      title: 'Form Name',
      dataIndex: 'formName',
      key: 'formName',
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Continue</a>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchFormName);
  };

  const handleReset = () => {
    setSearchFormName('');
  };

  const handleCreateForm = () => {
    console.log('Creating new form');
  };

  return (
    <div className={styles['page-container']}>
      {/* 创建按钮 */}
      <div className={styles['create-button-container']}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateForm}
        >
          Create Form
        </Button>
      </div>

      {/* 搜索表单 */}
      <Card className={styles['search-card']}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <label className={styles['form-name-label']}>
              Form Name:
            </label>
            <Input
              placeholder="Please enter form name"
              value={searchFormName}
              onChange={(e) => setSearchFormName(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={6} className={styles['button-group']}>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Query
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card className={styles['table-card']}>
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={false}
        />
        
        {/* 分页 */}
        <div className={styles['pagination-container']}>
          <span className={styles['pagination-info']}>
            {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, 100)} of 100 items`}
          </span>
          <div className={styles['pagination-controls']}>
            <span className={styles['page-size-text']}>10/page</span>
            <Pagination
              current={currentPage}
              total={100}
              pageSize={pageSize}
              showSizeChanger={false}
              showQuickJumper
              onChange={(page) => setCurrentPage(page)}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateForm;