import { Button, Card, Col, Divider, Flex, Slider, Switch, Typography } from "antd"
import { CheckOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import useSensorStore from "@/store/sensor.store";

type MonitorCardProps = {
  type: string;
  ip?: string;
  name: string;
  description: string;
  maxParticipants?: number;
  currentReading?: number;
  lastAlert?: string;
  threshold?: number;
  notifications?: boolean;
  alarm?: boolean;
}

const formatTimeDiff = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60)
    return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;

  const hours = Math.floor(diff / 3600000);
  if (hours < 24)
    return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;

  const days = Math.floor(diff / 86400000);
  return `Hace ${days} día${days !== 1 ? "s" : ""}`;
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="space-between" align="center">
    <Typography.Text type="secondary">{label}:</Typography.Text>
    <Typography.Text>{value}</Typography.Text>
  </Flex>
);

const HeaderSection = ({ name, description }: { name: string, description: string }) => (
  <Flex justify="space-between" align="center">
    <div>
      <Typography.Title level={5}>{name}</Typography.Title>
      <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
    </div>
  </Flex>
);

const SensorCardContent = ({
  ip,
  currentReading,
  lastAlert,
  notifications,
  alarm,
  threshold
}: Partial<MonitorCardProps>) => {
  // 🔧 FIX: Usar solo un estado para el threshold actual
  const [localThreshold, setLocalThreshold] = useState(threshold || 50);
  const { isThresholdSetting, setAlarm, setNotifications, setThreshold, isAlarmSetting } = useSensorStore();

  // 🔧 FIX: Sincronizar cuando cambie el threshold desde el store
  useEffect(() => {
    if (threshold !== undefined) {
      setLocalThreshold(threshold);
    }
  }, [threshold]);

  // 🔧 FIX: Determinar si hay cambios pendientes
  const hasChanges = useMemo(() => {
    return localThreshold !== threshold;
  }, [localThreshold, threshold]);

  const handleConfirm = async () => {
    if (!ip) {
      toast.error("IP del sensor no disponible...");
      return;
    }

    console.log(`🔄 Actualizando threshold: ${threshold} → ${localThreshold}`);
    
    try {
      await setThreshold(ip, localThreshold);
      toast.success(`Umbral actualizado: ${localThreshold} dB`);
    } catch (error) {
      console.error('❌ Error updating threshold:', error);
      toast.error("Error al actualizar el umbral");
      // Revertir el cambio local en caso de error
      setLocalThreshold(threshold || 50);
    }
  };

  const handleAlarm = async (value: boolean) => {
    if (!ip) {
      toast.error("IP del sensor no disponible...");
      return;
    }

    console.log(`Setting alarm for sensor ${ip} to ${value}`);
    await setAlarm(ip, value);
  };

  const handleNotifications = async (value: boolean) => {
    if (!ip) {
      toast.error("IP del sensor no disponible...");
      return;
    }

    console.log(`Setting notifications for sensor ${ip} to ${value}`);
    await setNotifications(ip, value);
  };

  return (
    <>
      <Divider orientation="left" plain orientationMargin="0">Datos</Divider>

      <InfoRow label="Lectura actual" value={currentReading && `${currentReading} dB`} />

      <InfoRow label="Última alerta" value={lastAlert && formatTimeDiff(lastAlert)} />

      <Divider orientation="left" plain orientationMargin="0">Configuración</Divider>
      <Flex vertical gap={6}>
        <Flex justify="space-between" align="center">
          <Typography.Text type="secondary">Alarma:</Typography.Text>
          {/* se cambio en el switch la prop value por checked y se añadieron props que inhabilitan el switch cuando se está guardando los datos */}
          <Switch key={`alarm-${ip}`} checked={alarm} onChange={(value) => handleAlarm(value)} loading={isAlarmSetting} disabled={isAlarmSetting} /> 
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text type="secondary">Notificaciones:</Typography.Text>
          <Switch key={`notifications-${ip}`} checked={notifications} onChange={(value) => handleNotifications(value)} />
        </Flex>

        <InfoRow 
          label="Umbral" 
          value={`${localThreshold} dB ${hasChanges ? '(modificado)' : ''}`} 
        />
        <Flex align="center" gap={8} style={{ marginTop: 6 }}>
          <Slider
            min={0}
            max={150}
            value={localThreshold}
            onChange={setLocalThreshold}
            style={{ flex: 1 }}
            disabled={isThresholdSetting}
          />
          {hasChanges && (
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<CheckOutlined />}
              onClick={handleConfirm}
              loading={isThresholdSetting}
            />
          )}
        </Flex>
      </Flex>
    </>
  )
}

const LocationCardContent = ({
  maxParticipants,
}: Partial<MonitorCardProps>) => {

  return (
    <>
      <Divider orientation="left" plain orientationMargin="0">Datos</Divider>
      <InfoRow label="Máx. participantes" value={maxParticipants ? maxParticipants : "N/A"} />
    </>
  )

}

const MonitorCard = (props: MonitorCardProps) => {

  return (
    <Col xs={24} sm={12} md={8} lg={8}>
      <Card variant="borderless">
        <HeaderSection name={props.name} description={props.description} />

        {
          props.type === "sensor" ?
            <SensorCardContent {...props} />
            :
            <LocationCardContent {...props} />
        }
      </Card>
    </Col>
  )
}

export default MonitorCard