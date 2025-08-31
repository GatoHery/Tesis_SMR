// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Imports
import { Card, Col, Flex, FloatButton, Form, Input, Modal, Row, theme, Typography } from "antd";
import { FaUsers, FaPlus } from "react-icons/fa";

// ** Custom Components Imports
import DataCardList from "@/components/DataCardList";
import UsersTable from "@/components/GenericTable/Users";

// ** Zustand Store Imports
import useThemeStore from "@/store/theme.store";
import useUserStore from "@/store/user.store";

const Users = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = theme.useToken()
  const { darkMode } = useThemeStore();
  const { fetchUsers, fetchUserStats, createUser, stats, loadingStats } = useUserStore();
  const [form] = Form.useForm();

  const { Title, Paragraph } = Typography;

  const data = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      change: stats.diffFromLastWeek,
      icon: <FaUsers size={24} color={darkMode ? '#fff' : token.colorPrimary} />,
      description: 'desde la semana pasada',
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return (
    <>
      <Flex vertical gap={24}>
        <Row>
          <Col>
            <Title level={2}>Usuarios</Title>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <DataCardList data={data} loading={loadingStats} />
        </Row>

        <Row>
          <Col xs={24}>
            <Card variant="borderless">
              <Title level={5}>Lista de usuarios</Title>
              <Paragraph type="secondary">
                Usuarios registrados
              </Paragraph>
              <div className="ant-list-box table-responsive">
                <UsersTable />
              </div>
            </Card>
          </Col>
        </Row>
      </Flex>

      <Modal
        title="Nuevo usuario"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Crear"
        cancelText="Cancelar"
        confirmLoading={isCreating}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            setIsCreating(true);
            console.log("Form:", values);

            await createUser(values);

            form.resetFields();
            setIsModalOpen(false);
            setIsCreating(false);
          }}
        >
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa un correo' },
              { type: 'email', message: 'Correo no válido' },
            ]}
          >
            <Input placeholder="john.doe@email.com" />
          </Form.Item>

          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa una contraseña' }]}
          >
            <Input.Password placeholder="Contraseña segura" />
          </Form.Item>
        </Form>
      </Modal>

      <FloatButton
        icon={<FaPlus />}
        type="primary"
        style={{ insetInlineEnd: 30 }}
        onClick={showModal}
      />
    </>
  )
}

export default Users