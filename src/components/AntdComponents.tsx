import { Layout, Menu, Table, Button, Modal, Form, Input, InputNumber, Rate } from 'antd';
import { ReactNode } from 'react';

const { Header, Content, Sider } = Layout;

interface Props {
  children: ReactNode;
}

export default function AntdComponents({ children }: Props) {
  return <>{children}</>;
} 