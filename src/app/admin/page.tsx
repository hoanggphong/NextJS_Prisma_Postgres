'use client';

import { useEffect, useState } from 'react';
import { Layout, Form, Input, Button, Table, Modal, InputNumber, Rate, Space, message, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';

const { Content } = Layout;
const { TextArea } = Input;

interface User {
  id: number;
  email: string;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
}

interface Feedback {
  id: number;
  content: string;
  rating: number;
  author: User;
  product: Product;
}

interface Category {
  id: number;
  name: string;
}

type TableItem = User | Product | Feedback | Category;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'feedbacks' | 'categories'>('users');
  const [data, setData] = useState<User[] | Product[] | Feedback[] | Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'feedbacks' || isModalVisible) {
      // Fetch users and products for feedback form
      const fetchUsersAndProducts = async () => {
        try {
          const [usersResponse, productsResponse, categoriesResponse] = await Promise.all([
            fetch('/api/users'),
            fetch('/api/products'),
            fetch('/api/categories')
          ]);
          
          if (!usersResponse.ok || !productsResponse.ok || !categoriesResponse.ok) {
            throw new Error('Failed to fetch data');
          }

          const [usersData, productsData, categoriesData] = await Promise.all([
            usersResponse.json(),
            productsResponse.json(),
            categoriesResponse.json()
          ]);

          setUsers(usersData);
          setProducts(productsData);
          setCategories(categoriesData);
        } catch (error) {
          if (error instanceof Error) {
            message.error(`Failed to fetch options: ${error.message}`);
          }
        }
      };

      fetchUsersAndProducts();
    }
  }, [activeTab, isModalVisible]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/${activeTab}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Failed to fetch data: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setData([]);
    }
  };

  const handleAdd = async (values: any) => {
    try {
      const response = await fetch(`/api/${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add');
      }

      message.success('Added successfully');
      fetchData();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Add error:', error);
      message.error('Failed to add: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = async (values: any) => {
    try {
      const response = await fetch(`/api/${activeTab}/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update');
      }

      message.success('Updated successfully');
      fetchData();
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      console.error('Edit error:', error);
      message.error('Failed to update: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      message.success('Deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const columns = {
    users: [
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: User) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Space>
        ),
      },
    ] as ColumnsType<User>,
    products: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { 
        title: 'Category', 
        dataIndex: ['category', 'name'], 
        key: 'category',
        render: (_: any, record: Product) => record.category?.name || 'N/A'
      },
      { title: 'Stock', dataIndex: 'stock', key: 'stock' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Product) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Space>
        ),
      },
    ] as ColumnsType<Product>,
    feedbacks: [
      { title: 'Content', dataIndex: 'content', key: 'content' },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        render: (rating: number) => <Rate disabled defaultValue={rating} />,
      },
      { title: 'Author', dataIndex: ['author', 'name'], key: 'author' },
      { title: 'Product', dataIndex: ['product', 'name'], key: 'product' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Feedback) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue({
                  ...record,
                  authorId: record.author.id,
                  productId: record.product.id,
                });
                setIsModalVisible(true);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Space>
        ),
      },
    ] as ColumnsType<Feedback>,
    categories: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Category) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Space>
        ),
      },
    ] as ColumnsType<Category>,
  };

  const formItems = {
    users: (
      <>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
      </>
    ),
    products: (
      <>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={categories.map(category => ({
              value: category.id,
              label: category.name
            }))}
          />
        </Form.Item>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </>
    ),
    feedbacks: (
      <>
        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
          <Rate />
        </Form.Item>
        <Form.Item name="authorId" label="Author" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select an author"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={users.map(user => ({
              value: user.id,
              label: `${user.name} (${user.email})`
            }))}
          />
        </Form.Item>
        <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select a product"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={products.map(product => ({
              value: product.id,
              label: product.name
            }))}
          />
        </Form.Item>
      </>
    ),
    categories: (
      <>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </>
    ),
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Table<User>
            columns={columns.users}
            dataSource={Array.isArray(data) ? (data as User[]) : []}
            rowKey="id"
          />
        );
      case 'products':
        return (
          <Table<Product>
            columns={columns.products}
            dataSource={Array.isArray(data) ? (data as Product[]) : []}
            rowKey="id"
          />
        );
      case 'feedbacks':
        return (
          <Table<Feedback>
            columns={columns.feedbacks}
            dataSource={Array.isArray(data) ? (data as Feedback[]) : []}
            rowKey="id"
          />
        );
      case 'categories':
        return (
          <Table<Category>
            columns={columns.categories}
            dataSource={Array.isArray(data) ? (data as Category[]) : []}
            rowKey="id"
          />
        );
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
          <Button
            type={activeTab === 'users' ? 'primary' : 'default'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </Button>
          <Button
            type={activeTab === 'products' ? 'primary' : 'default'}
            onClick={() => setActiveTab('products')}
          >
            Products
          </Button>
          <Button
            type={activeTab === 'feedbacks' ? 'primary' : 'default'}
            onClick={() => setActiveTab('feedbacks')}
          >
            Feedbacks
          </Button>
          <Button
            type={activeTab === 'categories' ? 'primary' : 'default'}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add New
          </Button>
        </div>

        {renderTable()}

        <Modal
          title={`${editingRecord ? 'Edit' : 'Add'} ${activeTab.slice(0, -1)}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingRecord(null);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingRecord ? handleEdit : handleAdd}
          >
            {formItems[activeTab]}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Save' : 'Add'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
} 