import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { calcSportCal } from '../utils/calorie';
import { DAILY_ACTIVITIES, SPORT_ACTIVITIES } from '../utils/activities';
import ExerciseSuccessModal from './ExerciseSuccessModal';
import { Card, Typography, Button, Modal, Slider, Statistic, Avatar, Input } from 'antd';
import {
  FireOutlined,
  CloseOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  DeleteOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import SportsIcons from '../components/SportsIcons';

const { Title, Text } = Typography;

// Map activity name to icon key
function getSportIconKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('走路') || lower.includes('散步') || lower.includes('stroll')) return 'stroll';
  if (lower.includes('舞蹈') || lower.includes('健身操')) return 'dance';
  if (lower.includes('跑步') || lower.includes('跑')) return 'run';
  if (lower.includes('爬楼梯') || lower.includes('登山') || lower.includes('登山') || lower.includes('爬山')) return 'climbing';
  if (lower.includes('快走') || lower.includes('fast')) return 'fastWalk';
  if (lower.includes('跳绳') || lower.includes('jump')) return 'jumpRope';
  if (lower.includes('骑行') || lower.includes('自行车') || lower.includes('骑车')) return 'cycling';
  if (lower.includes('瑜伽') || lower.includes('普拉提') || lower.includes('pilates')) return 'yoga';
  if (lower.includes('羽毛球') || lower.includes('羽球')) return 'badminton';
  if (lower.includes('呼啦圈') || lower.includes('hula')) return 'hulaHoop';
  if (lower.includes('游泳') || lower.includes('swim')) return 'swimming';
  if (lower.includes('篮球') || lower.includes('basketball')) return 'basketball';
  if (lower.includes('足球') || lower.includes('football') || lower.includes('soccer')) return 'football';
  if (lower.includes('网球') || lower.includes('tennis')) return 'tennis';
  if (lower.includes('哑铃') || lower.includes('力量') || lower.includes('举重') || lower.includes('健身')) return 'dumbbell';
  if (lower.includes('拉伸') || lower.includes('stretch')) return 'stretching';
  if (lower.includes('拳击') || lower.includes('boxing')) return 'boxing';
  if (lower.includes('椭圆机') || lower.includes('elliptical')) return 'elliptical';
  if (lower.includes('划船') || lower.includes('rowing')) return 'rowing';
  if (lower.includes('慢跑') || lower.includes('jog')) return 'jog';
  // Default to walk
  return 'walk';
}

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: typeof DAILY_ACTIVITIES[0] | typeof SPORT_ACTIVITIES[0];
  onAdd: (duration: number) => void;
}

function ActivityModal({ isOpen, onClose, activity, onAdd }: ActivityModalProps) {
  const [duration, setDuration] = useState(30);
  const iconKey = getSportIconKey(activity.name);
  const iconSvg = SportsIcons[iconKey as keyof typeof SportsIcons] || SportsIcons.walk;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined />}
      styles={{ body: { padding: '16px' } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>{activity.name}</Title>

        <Card style={{ borderRadius: '8px', background: '#F5F7FA', border: 'none', textAlign: 'center' }}>
          <div style={{ padding: '16px 0' }}>
            {iconSvg}
          </div>
          <Text style={{ color: '#666', fontSize: '14px', display: 'block' }}>
            MET值: {activity.met}
          </Text>
          <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            {'description' in activity && activity.description ? String(activity.description) : '坚持运动，健康每一天！'}
          </Text>
        </Card>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text>运动时长</Text>
            <Text strong>{duration} 分钟</Text>
          </div>
          <Slider
            min={5}
            max={120}
            step={5}
            value={duration}
            onChange={(val) => setDuration(val)}
            marks={{ 5: '5', 60: '60', 120: '120' }}
          />
        </div>

        <Card style={{ borderRadius: '8px', background: '#FFF7E6', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text><FireOutlined style={{ marginRight: '4px' }} />预计消耗</Text>
            <Statistic
              value={Math.round(calcSportCal(activity.met, 60, duration))}
              suffix="千卡"
              styles={{ content: { color: '#FA8C16', fontSize: '20px' } }}
            />
          </div>
        </Card>

        <Button type="primary" block size="large" icon={<CheckOutlined />} onClick={() => { onAdd(duration); onClose(); }}>
          确认添加
        </Button>
      </div>
    </Modal>
  );
}

export default function ExercisePage() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastExercise, setLastExercise] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<typeof DAILY_ACTIVITIES[0] | typeof SPORT_ACTIVITIES[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { userSettings, allExerciseRecords, addExerciseRecord, removeExerciseRecord, getTodayExerciseCalories } = useCalorieStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayExercises = allExerciseRecords.filter(r => r.date === todayStr);

  const totalCal = getTodayExerciseCalories();

  // Filter activities by search
  const filteredDaily = DAILY_ACTIVITIES.filter(a => a.name.includes(searchTerm));
  const filteredSports = SPORT_ACTIVITIES.filter(a => a.name.includes(searchTerm));

  const handleAddExercise = (duration: number) => {
    if (!selectedActivity) return;
    const calorie = calcSportCal(selectedActivity.met, userSettings.weight, duration);
    const exerciseRecord = {
      name: selectedActivity.name,
      met: selectedActivity.met,
      duration,
      calorie: Math.round(calorie),
      date: new Date().toISOString().split('T')[0],
      id: Date.now().toString(),
    };
    addExerciseRecord(exerciseRecord);
    setLastExercise(exerciseRecord);
    setShowSuccessModal(true);
    setSelectedActivity(null);
  };

  const handleActivityClick = (activity: typeof DAILY_ACTIVITIES[0] | typeof SPORT_ACTIVITIES[0]) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  // Render activity card with SVG icon
  const renderActivityCard = (activity: typeof DAILY_ACTIVITIES[0] | typeof SPORT_ACTIVITIES[0], bgColor: string, iconColor: string) => {
    const iconKey = getSportIconKey(activity.name);
    const iconSvg = SportsIcons[iconKey as keyof typeof SportsIcons] || SportsIcons.walk;

    return (
      <Card
        key={activity.name}
        hoverable
        styles={{ body: { padding: '12px' } }}
        onClick={() => handleActivityClick(activity)}
        style={{ borderRadius: '12px', background: '#FFF', border: '1px solid #F0F0F0' }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
          <Avatar
            shape="square"
            size={48}
            style={{
              background: bgColor,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {iconSvg}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: '14px', display: 'block' }}>{activity.name}</Text>
            <Text style={{ color: '#999', fontSize: '12px' }}>
              {Math.round(calcSportCal(activity.met, 60, 60))}千卡/60分钟
            </Text>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Clean white header */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0, color: '#333' }}>运动项目</Title>
          <Button type="text" icon={<SearchOutlined />} style={{ fontSize: '18px' }} />
        </div>

        <Input
          placeholder="搜索运动项目"
          prefix={<SearchOutlined style={{ color: '#999' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            borderRadius: '24px',
            height: '44px',
            fontSize: '14px',
            background: '#FFF',
            border: '1px solid #E0E0E0',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: '16px' }}>
        {/* Daily Activities */}
        {filteredDaily.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: '12px' }}>
              <BulbOutlined style={{ marginRight: '8px', color: '#FA8C16' }} />日常活动
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {filteredDaily.map((activity) => renderActivityCard(activity, '#FFF7E6', '#FA8C16'))}
            </div>
          </div>
        )}

        {/* Sport Activities */}
        {filteredSports.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: '12px' }}>
              <ThunderboltOutlined style={{ marginRight: '8px', color: '#1677FF' }} />体育运动
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {filteredSports.map((activity) => renderActivityCard(activity, '#F0F5FF', '#1677FF'))}
            </div>
          </div>
        )}

        {/* Today's Exercises */}
        {todayExercises.length > 0 && (
          <Card title="今日运动记录" styles={{ body: { padding: '16px' } }} style={{ borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {todayExercises.map((ex) => {
                const iconKey = getSportIconKey(ex.name);
                const iconSvg = SportsIcons[iconKey as keyof typeof SportsIcons] || SportsIcons.walk;

                return (
                  <Card
                    key={ex.id}
                    styles={{ body: { padding: '12px 16px' } }}
                    style={{ borderRadius: '8px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Avatar
                          shape="square"
                          size={40}
                          style={{
                            background: '#FFF7E6',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {iconSvg}
                        </Avatar>
                        <div>
                          <Text strong style={{ fontSize: '14px', display: 'block' }}>{ex.name}</Text>
                          <Text style={{ color: '#999', fontSize: '12px' }}>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />{ex.duration} 分钟
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Text type="warning" strong>{ex.calorie} 千卡</Text>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeExerciseRecord(ex.id)}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Activity Modal */}
      {showModal && selectedActivity && (
        <ActivityModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
          onAdd={handleAddExercise}
        />
      )}

      {/* Exercise Success Modal */}
      {showSuccessModal && lastExercise && (
        <ExerciseSuccessModal
          exercise={lastExercise}
          onClose={() => {
            setShowSuccessModal(false);
            setLastExercise(null);
          }}
        />
      )}
    </div>
  );
}
