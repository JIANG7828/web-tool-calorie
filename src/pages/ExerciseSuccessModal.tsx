import { ExerciseRecord } from '../store/calorieStore';
import { Modal, Typography, Statistic, Button, Avatar, Card } from 'antd';
import { TrophyOutlined, ThunderboltOutlined, ClockCircleOutlined, FireOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ExerciseSuccessModalProps {
  exercise: ExerciseRecord;
  onClose: () => void;
}

export default function ExerciseSuccessModal({ exercise, onClose }: ExerciseSuccessModalProps) {
  const getMessage = () => {
    const calories = exercise.calorie;
    if (calories >= 500) {
      return {
        title: '运动达人！',
        icon: <TrophyOutlined />,
        color: '#FAAD14',
        message: '今天运动量非常棒！',
      };
    } else if (calories >= 300) {
      return {
        title: '表现不错！',
        icon: <ThunderboltOutlined />,
        color: '#52C41A',
        message: '继续保持运动习惯！',
      };
    } else {
      return {
        title: '记录成功！',
        icon: <FireOutlined />,
        color: '#1677FF',
        message: '运动有助于健康！',
      };
    }
  };

  const { title, icon, color, message } = getMessage();

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <Avatar size={80} style={{ background: color, marginBottom: '16px' }} icon={icon} />
        <Title level={4} style={{ margin: '0 0 8px' }}>{title}</Title>
        <Text type="secondary">{message}</Text>

        <Card
          style={{ borderRadius: '8px', background: '#FFF7E6', border: 'none', marginTop: '24px' }}
          styles={{ body: { padding: '16px' } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>运动项目</Text>
              <Text strong>{exercise.name}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text><ClockCircleOutlined style={{ marginRight: '4px' }} />运动时长</Text>
              <Text strong>{exercise.duration} 分钟</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text><FireOutlined style={{ marginRight: '4px' }} />消耗热量</Text>
              <Text strong type="warning">{exercise.calorie} 千卡</Text>
            </div>
          </div>
        </Card>

        <Button type="primary" block size="large" icon={<CheckOutlined />} onClick={onClose} style={{ marginTop: '24px' }}>
          知道了
        </Button>
      </div>
    </Modal>
  );
}
