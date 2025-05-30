'use client';

import { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Typography, Rate, Carousel, Button, Badge, Tag, Divider, Spin } from 'antd';
import { ShoppingCartOutlined, StarOutlined, TagOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
}

interface Category {
  id: number;
  name: string;
}

interface Feedback {
  id: number;
  content: string;
  rating: number;
  author: {
    name: string;
  };
  product: Product;
}

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, feedbacksRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/feedbacks')
        ]);

        const [productsData, categoriesData, feedbacksData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          feedbacksRes.json()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category?.id === selectedCategory)
    : products;

  const carouselStyle = {
    height: '400px',
    color: '#fff',
    lineHeight: '400px',
    textAlign: 'center',
    background: '#364d79',
  } as const;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 50px', position: 'fixed', width: '100%', zIndex: 1 }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>My Store</Title>
          </Col>
          <Col>
            <Link href="/admin">
              <Button type="primary">Admin Dashboard</Button>
            </Link>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Carousel autoplay style={{ marginBottom: 32 }}>
          {categories.map(category => (
            <div key={category.id}>
              <div style={carouselStyle}>
                <Title level={2} style={{ color: '#fff' }}>{category.name}</Title>
              </div>
            </div>
          ))}
        </Carousel>

        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Title level={2}>Our Products</Title>
          
          <div style={{ marginBottom: 24 }}>
            <Button 
              type={selectedCategory === null ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(null)}
              style={{ marginRight: 8 }}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category.id)}
                style={{ marginRight: 8 }}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <Row gutter={[16, 16]}>
            {filteredProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Badge.Ribbon text={product.category?.name} color="blue">
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingCartOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                      </div>
                    }
                    actions={[
                      <Button key="buy" type="primary" icon={<ShoppingCartOutlined />}>
                        Buy Now
                      </Button>
                    ]}
                  >
                    <Meta
                      title={product.name}
                      description={
                        <>
                          <Text>{product.description}</Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag color="green">${product.price}</Tag>
                            <Tag color={product.stock > 0 ? 'blue' : 'red'}>
                              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </Tag>
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>

          <Divider />

          <Title level={2}>Customer Reviews</Title>
          <Row gutter={[16, 16]}>
            {feedbacks.map(feedback => (
              <Col xs={24} sm={12} md={8} key={feedback.id}>
                <Card>
                  <Meta
                    title={feedback.product.name}
                    description={
                      <>
                        <Rate disabled defaultValue={feedback.rating} />
                        <p>{feedback.content}</p>
                        <Text type="secondary">- {feedback.author.name}</Text>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        ©{new Date().getFullYear()} My Store. All Rights Reserved.
      </Footer>
    </Layout>
  );
} 