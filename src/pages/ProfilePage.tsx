import { useState, useEffect, useRef } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { useAuthStore } from '../store/authStore';
import { getBMR, getTDEE, getTargetCal } from '../utils/calorie';
import { calculateStreak } from '../utils/checkInSystem';
import WeightTrendPage from './WeightTrendPage';
import DataStatisticsPage from './DataStatisticsPage';
import WechatQRCode from '../components/WechatQRCode';
import { Card, Tag, Button, Modal, Typography, Input, Avatar, Space as AntSpace, Divider, Alert, App, DatePicker } from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined,
  CloseOutlined,
  LeftOutlined,
  LogoutOutlined,
  LoginOutlined,
  LockOutlined,
  WechatOutlined,
  LineChartOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  QrcodeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { generateAvatar } from '../utils/avatarGenerator';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { message } = App.useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showWeightTrend, setShowWeightTrend] = useState(false);
  const [showDataStatistics, setShowDataStatistics] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerId, setRegisterId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerNickname, setRegisterNickname] = useState('');
  const [registerGender, setRegisterGender] = useState<'male' | 'female'>('female');
  const [registerErrors, setRegisterErrors] = useState<string[]>([]);
  const [loginError, setLoginError] = useState('');
  const [forgotWechatId, setForgotWechatId] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showLoginQR, setShowLoginQR] = useState(false);
  const [showRegisterQR, setShowRegisterQR] = useState(false);
  const [showForgotQR, setShowForgotQR] = useState(false);

  const {
    userSettings,
    updateUserSettings,
    weightRecords,
    checkIns,
    allFoodRecords,
    getTodayTotalCalories,
    getTodayExerciseCalories,
  } = useCalorieStore();

  const {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    loginWithWechat,
    registerWithWechat,
    generateResetCode,
    verifyResetCode,
    resetPassword,
    resetPasswordByWechat,
  } = useAuthStore();

  // 忘记密码状态
  const [forgotStep, setForgotStep] = useState<'username' | 'verify' | 'reset' | 'wechat'>('username');
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotResetCode, setForgotResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const calorieStoreRef = useRef(false);

  useEffect(() => {
    const url = generateAvatar(userSettings.gender, userSettings.nickname || '用户');
    setAvatarUrl(url);
  }, [userSettings.gender, userSettings.nickname]);

  useEffect(() => {
    if (isLoggedIn && currentUser && !calorieStoreRef.current) {
      updateUserSettings({
        nickname: currentUser.nickname,
        gender: currentUser.gender,
      });
      calorieStoreRef.current = true;
    }
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    if (!isLoggedIn) {
      calorieStoreRef.current = false;
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setLoginError('');
    if (!loginId || !loginPassword) {
      setLoginError('请输入用户名和密码');
      return;
    }
    const result = await login(loginId, loginPassword);
    if (result.success) {
      message.success('登录成功！');
      setShowLoginModal(false);
      setShowLoginQR(false);
      setLoginId('');
      setLoginPassword('');
      setLoginError('');
      window.location.reload();
    } else {
      setLoginError(result.error || '登录失败');
    }
  };

  const handleLoginWithWechat = async (wechatId: string) => {
    const result = await loginWithWechat(wechatId);
    if (result.success) {
      message.success('微信登录成功！');
      setShowLoginModal(false);
      setShowLoginQR(false);
      window.location.reload();
    } else {
      message.error(result.error || '微信登录失败，请先注册');
      setShowLoginQR(false);
    }
  };

  const handleRegister = async () => {
    setRegisterErrors([]);
    if (!registerId || !registerPassword || !registerNickname) {
      setRegisterErrors(['请填写完整信息']);
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterErrors(['两次密码输入不一致']);
      return;
    }
    const result = await register(registerId, registerPassword, registerNickname, registerGender);
    if (result.success) {
      message.success('注册成功！');
      setShowRegisterModal(false);
      setShowRegisterQR(false);
      setRegisterId('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterNickname('');
      setRegisterErrors([]);
      window.location.reload();
    } else {
      setRegisterErrors(result.errors || ['注册失败']);
    }
  };

  const handleRegisterWithWechat = async (wechatId: string) => {
    const result = await registerWithWechat(wechatId, registerNickname || '微信用户', registerGender);
    if (result.success) {
      message.success('微信注册成功！');
      setShowRegisterModal(false);
      setShowRegisterQR(false);
      window.location.reload();
    } else {
      message.error(result.errors?.join('，') || '注册失败');
      setShowRegisterQR(false);
    }
  };

  // ===== 发送重置码
  const handleGenerateResetCode = async () => {
    setResetPasswordError('');
    if (!forgotUsername) {
      setResetPasswordError('请输入用户名');
      return;
    }
    const result = await generateResetCode(forgotUsername);
    if (result.success && result.code) {
      setGeneratedCode(result.code);
      message.success(`重置码已生成！请查看控制台获取验证码: ${result.code}`);
      setForgotStep('verify');
    } else {
      setResetPasswordError(result.error || '发送重置码失败');
    }
  };

  // 验证重置码
  const handleVerifyResetCode = async () => {
    setResetPasswordError('');
    if (!forgotResetCode) {
      setResetPasswordError('请输入重置码');
      return;
    }
    const result = await verifyResetCode(forgotUsername, forgotResetCode);
    if (result.success) {
      message.success('验证成功！请设置新密码');
      setForgotStep('reset');
    } else {
      setResetPasswordError(result.error || '验证失败');
    }
  };

  // 通过用户名重置密码
  const handleResetPassword = async () => {
    setResetPasswordError('');
    if (forgotNewPassword !== forgotConfirmPassword) {
      setResetPasswordError('两次密码输入不一致');
      return;
    }
    const result = await resetPassword(forgotUsername, forgotNewPassword, forgotConfirmPassword);
    if (result.success) {
      message.success('密码重置成功！');
      // 重置所有忘记密码状态
      setShowForgotModal(false);
      setShowForgotQR(false);
      setForgotUsername('');
      setForgotWechatId('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setForgotResetCode('');
      setForgotStep('username');
      setGeneratedCode(null);
      setResetPasswordError('');
    } else {
      setResetPasswordError(result.error || '重置失败');
    }
  };

  // 通过微信重置密码
  const handleResetPasswordByWechat = async () => {
    setResetPasswordError('');
    if (!forgotWechatId) {
      setResetPasswordError('请先通过微信扫码验证身份');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setResetPasswordError('两次密码输入不一致');
      return;
    }
    const result = await resetPasswordByWechat(forgotWechatId, forgotNewPassword, forgotConfirmPassword);
    if (result.success) {
      message.success('密码重置成功！');
      setShowForgotModal(false);
      setShowForgotQR(false);
      setForgotWechatId('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setForgotStep('username');
      setResetPasswordError('');
    } else {
      setResetPasswordError(result.error || '重置失败');
    }
  };

  const handleForgotWithWechat = (wechatId: string) => {
    setForgotWechatId(wechatId);
    setForgotStep('wechat');
    message.success('身份验证成功！请设置新密码');
  };

  const handleLogout = () => {
    logout();
    message.success('已退出登录');
    window.location.reload();
  };

  const totalMealRecords = allFoodRecords.length;
  const healthyDietDays = (() => {
    const uniqueDates = [...new Set(allFoodRecords.map((r) => r.date))];
    const targetCalFromSettings = (() => {
      const weight = userSettings.weight || 55;
      const activityLevel = userSettings.activityLevel || 1.2;
      const bmr = weight * 22;
      const tdee = bmr * activityLevel;
      if (userSettings.target === 'fat') return Math.round(tdee - 400);
      if (userSettings.target === 'muscle') return Math.round(tdee + 300);
      return Math.round(tdee);
    })();
    return uniqueDates.filter((date) => {
      const dayCal = allFoodRecords.filter((r) => r.date === date).reduce((sum, r) => sum + r.calorie, 0);
      return dayCal <= targetCalFromSettings;
    }).length;
  })();

  const calculateTotalWeightLoss = () => {
    if (weightRecords.length < 2) return 0;
    const firstWeight = weightRecords[weightRecords.length - 1].weight;
    const latestWeight = weightRecords[0].weight;
    return Math.max(0, (firstWeight - latestWeight) * 2);
  };

  const totalWeightLoss = calculateTotalWeightLoss();

  const bmr = getBMR(userSettings.gender, userSettings.weight, userSettings.height, userSettings.age);
  const tdee = getTDEE(bmr, userSettings.activityLevel);
  const targetCal = getTargetCal(tdee, userSettings.target);

  const streak = calculateStreak(checkIns);

  const getTargetLabel = () => {
    const labels: Record<string, string> = { fat: '减脂', keep: '维持', muscle: '增肌' };
    return labels[userSettings.target];
  };

  const getTargetColor = () => {
    const colors: Record<string, string> = { fat: 'orange', keep: 'green', muscle: 'blue' };
    return colors[userSettings.target];
  };

  const calculateWeeklyCalorieDeficit = () => {
    const today = new Date();
    let totalDeficit = 0;
    let count = 0;

    for (let i = 0; i < 7; i++) {
      const dateStr = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const checkIn = checkIns.find((c) => c.date === dateStr);
      if (checkIn) {
        const deficit = (checkIn.target || targetCal) - checkIn.calorie;
        totalDeficit += Math.max(0, deficit);
        count++;
      }
    }

    return count > 0 ? Math.round(totalDeficit / count) : 0;
  };

  const weeklyCalorieDeficit = calculateWeeklyCalorieDeficit();

  const calorieComplianceRate = (() => {
    const targetSetDate = userSettings.targetSetDate;
    const targetAchievementDate = userSettings.targetAchievementDate;
    if (!targetSetDate) return 0;
    const endDate = targetAchievementDate || new Date().toISOString().split('T')[0];
    const start = new Date(targetSetDate);
    const end = new Date(endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const calorieTargetDays = checkIns.filter((c) => c.calorie <= (c.target || targetCal)).length;
    return Math.round((calorieTargetDays / totalDays) * 100);
  })();

  const exerciseComplianceRate = (() => {
    const targetSetDate = userSettings.targetSetDate;
    const targetAchievementDate = userSettings.targetAchievementDate;
    if (!targetSetDate) return 0;
    const endDate = targetAchievementDate || new Date().toISOString().split('T')[0];
    const start = new Date(targetSetDate);
    const end = new Date(endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const exerciseTargetDays = checkIns.filter((c) => (c.exerciseCal || 0) >= (c.exerciseTarget || 0)).length;
    return Math.round((exerciseTargetDays / totalDays) * 100);
  })();

  const waterComplianceRate = (() => {
    const targetSetDate = userSettings.targetSetDate;
    const targetAchievementDate = userSettings.targetAchievementDate;
    if (!targetSetDate) return 0;
    const endDate = targetAchievementDate || new Date().toISOString().split('T')[0];
    const start = new Date(targetSetDate);
    const end = new Date(endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const waterTargetDays = checkIns.filter((c) => (c.waterCount || 0) >= (c.waterTarget || 0)).length;
    return Math.round((waterTargetDays / totalDays) * 100);
  })();

  function RingChart({ percent, color, size = 80 }: { percent: number; color: string; size?: number }) {
    const r = 36;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percent / 100) * circumference;
    return (
      <div style={{ textAlign: 'center' }}>
        <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke="#F0F0F0" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          />
        </svg>
        <Text strong style={{ fontSize: '14px', color: color }}>{percent}%</Text>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <div style={{ padding: '16px 20px', background: '#FFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Avatar size={72} src={avatarUrl} style={{ background: '#FFF', border: '3px solid #FFE4E1' }}>
              <UserOutlined style={{ fontSize: '32px', color: userSettings.gender === 'male' ? '#1677FF' : '#FA541C' }} />
            </Avatar>
            <div>
              <Title level={3} style={{ margin: 0, color: '#333', fontWeight: 600 }}>
                {isLoggedIn && currentUser ? currentUser.nickname : (userSettings.nickname || '想瘦的小伙伴')}
              </Title>
              <Text style={{ color: '#666', fontSize: '14px', display: 'block' }}>
                {isLoggedIn ? `欢迎回来，${currentUser?.nickname || '用户'}` : `已加入 ${streak} 天`}
              </Text>
              <Tag color={getTargetColor()} style={{ marginTop: '4px' }}>
                {getTargetLabel()}
              </Tag>
            </div>
          </div>

          {!isLoggedIn ? (
            <Button
              type="primary"
              size="small"
              icon={<LoginOutlined />}
              onClick={() => { setShowLoginModal(true); setShowLoginQR(false); }}
            >
              登录
            </Button>
          ) : (
            <Button
              type="text"
              size="small"
              icon={<LogoutOutlined />}
              danger
              onClick={handleLogout}
            >
              退出
            </Button>
          )}
        </div>

        <Card style={{ borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '20px 16px' } }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0, color: '#333', fontSize: '28px', fontWeight: 700 }}>
                {totalMealRecords}
              </Title>
              <Text style={{ color: '#666', fontSize: '12px' }}>记录次数</Text>
            </div>
            <div style={{ borderLeft: '1px solid #F0F0F0', paddingLeft: '24px' }}>
              <Title level={2} style={{ margin: 0, color: '#333', fontSize: '28px', fontWeight: 700 }}>
                {healthyDietDays}
              </Title>
              <Text style={{ color: '#666', fontSize: '12px' }}>健康天数</Text>
            </div>
            <div style={{ borderLeft: '1px solid #F0F0F0', paddingLeft: '24px' }}>
              <Title level={2} style={{ margin: 0, color: '#333', fontSize: '28px', fontWeight: 700 }}>
                {totalWeightLoss.toFixed(1)}
              </Title>
              <Text style={{ color: '#666', fontSize: '12px' }}>累计减重(斤)</Text>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '20px' }}>
        <Card style={{ borderRadius: '8px', marginBottom: '24px' }} styles={{ body: { padding: '16px' } }}>
          <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '16px' }}>达标比例</Text>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <RingChart percent={calorieComplianceRate} color="#1677FF" size={80} />
              <Text style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>热量达标</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <RingChart percent={exerciseComplianceRate} color="#FA8C16" size={80} />
              <Text style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>运动达标</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <RingChart percent={waterComplianceRate} color="#722ED1" size={80} />
              <Text style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>喝水达标</Text>
            </div>
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => setShowDataStatistics(true)}
          style={{
            borderRadius: '8px',
            padding: '16px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #E6F7FF 0%, #B3DFFF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              <LineChartOutlined style={{ fontSize: '28px', color: '#1890FF' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '4px' }}>数据统计</Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#1890FF' }}>
                  {weeklyCalorieDeficit}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>千卡</span>
              </div>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginTop: '4px' }}>最近7天日均热量缺口</Text>
            </div>
            <LeftOutlined style={{ color: '#CCC', fontSize: '20px' }} />
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => setShowWeightTrend(true)}
          style={{
            borderRadius: '8px',
            padding: '16px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #F6FFED 0%, #B7EB8F 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              <BarChartOutlined style={{ fontSize: '28px', color: '#52C41A' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '4px' }}>体重管理</Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#52C41A' }}>
                  {weightRecords.length > 0 ? (weightRecords[weightRecords.length - 1].weight * 2).toFixed(0) : '--'}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>斤</span>
              </div>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {weightRecords.length > 0 ? '上次记录于1天前' : '点击记录您的体重'}
              </Text>
            </div>
            <LeftOutlined style={{ color: '#CCC', fontSize: '20px' }} />
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => setShowSettings(true)}
          style={{
            borderRadius: '8px',
            padding: '16px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #FFF7E6 0%, #FFE082 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              <UserSwitchOutlined style={{ fontSize: '28px', color: '#FA8C16' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '4px' }}>个人资料</Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#FA8C16' }}>
                  {userSettings.height || '--'}cm / {userSettings.age || '--'}岁 / {userSettings.gender === 'male' ? '男' : '女'}
                </span>
              </div>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginTop: '4px' }}>点击修改个人信息</Text>
            </div>
            <LeftOutlined style={{ color: '#CCC', fontSize: '20px' }} />
          </div>
        </Card>
      </div>

      {showDataStatistics && (
        <div style={{ position: 'fixed', inset: 0, background: '#FFF', zIndex: 1000, overflow: 'auto' }}>
          <DataStatisticsPage
            checkIns={checkIns}
            targetCal={targetCal}
            onBack={() => setShowDataStatistics(false)}
          />
        </div>
      )}

      {showWeightTrend && (
        <div style={{ position: 'fixed', inset: 0, background: '#FFF', zIndex: 1000, overflow: 'auto' }}>
          <WeightTrendPage onBack={() => setShowWeightTrend(false)} />
        </div>
      )}

      <Modal
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '0', height: '100%' } }}
        width="100%"
        style={{ margin: 0, top: 0, height: '100%' }}
      >
        <div style={{ minHeight: '100vh', background: '#F5F7FA', paddingTop: '80px' }}>
          <div style={{
            background: '#FFF',
            padding: '24px 20px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            borderBottom: '1px solid #F0F0F0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button
                  onClick={() => setShowSettings(false)}
                  type="text"
                  icon={<LeftOutlined style={{ fontSize: '20px', fontWeight: 600 }} />}
                  style={{ color: '#333' }}
                />
                <Title level={4} style={{ margin: 0, color: '#333' }}>个人资料</Title>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setShowSettings(false)}
                style={{ color: '#999' }}
              />
            </div>
            <Text style={{ color: '#666', fontSize: '14px', marginTop: '4px', display: 'block' }}>
              管理您的个人信息和运动目标
            </Text>
          </div>

          <div style={{ padding: '20px' }}>
            <Card style={{ borderRadius: '8px', marginBottom: '16px' }} styles={{ body: { padding: '16px' } }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>昵称</Text>
                  <Input
                    value={userSettings.nickname}
                    onChange={(e) => updateUserSettings({ nickname: e.target.value })}
                    prefix={<UserOutlined />}
                  />
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>性别</Text>
                  <AntSpace.Compact style={{ width: '100%' }}>
                    <Button
                      block
                      type={userSettings.gender === 'male' ? 'primary' : 'default'}
                      onClick={() => updateUserSettings({ gender: 'male' })}
                    >
                      男
                    </Button>
                    <Button
                      block
                      type={userSettings.gender === 'female' ? 'primary' : 'default'}
                      onClick={() => updateUserSettings({ gender: 'female' })}
                    >
                      女
                    </Button>
                  </AntSpace.Compact>
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>年龄</Text>
                  <Input
                    type="number"
                    value={userSettings.age}
                    onChange={(e) => updateUserSettings({ age: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>身高 (cm)</Text>
                  <Input
                    type="number"
                    value={userSettings.height}
                    onChange={(e) => updateUserSettings({ height: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>体重 (kg)</Text>
                  <Input
                    type="number"
                    value={userSettings.weight}
                    onChange={(e) => updateUserSettings({ weight: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>目标体重 (kg)</Text>
                  <Input
                    type="number"
                    value={userSettings.targetWeight || ''}
                    onChange={(e) => updateUserSettings({ targetWeight: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>当前目标</Text>
                  <AntSpace.Compact style={{ width: '100%' }}>
                    {[
                      { key: 'fat', label: '减脂' },
                      { key: 'keep', label: '维持' },
                      { key: 'muscle', label: '增肌' },
                    ].map((item) => (
                      <Button
                        key={item.key}
                        block
                        type={userSettings.target === item.key ? 'primary' : 'default'}
                        onClick={() => updateUserSettings({ target: item.key as 'fat' | 'keep' | 'muscle' })}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </AntSpace.Compact>
                </div>

                <div>
                  <Text style={{ display: 'block', marginBottom: '8px', color: '#999' }}>目标完成日期</Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={userSettings.targetAchievementDate ? dayjs(userSettings.targetAchievementDate) : undefined}
                    onChange={(date) => updateUserSettings({
                      targetAchievementDate: date ? date.format('YYYY-MM-DD') : undefined,
                      targetSetDate: userSettings.targetSetDate || dayjs().format('YYYY-MM-DD')
                    })}
                    placeholder="选择目标完成日期"
                  />
                </div>

                <Button type="primary" block size="large" onClick={() => setShowSettings(false)}>
                  保存设置
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Modal>

      <Modal
        open={showLoginModal}
        onCancel={() => { setShowLoginModal(false); setShowLoginQR(false); setLoginId(''); setLoginPassword(''); setLoginError(''); }}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '24px' } }}
        width={showLoginQR ? 320 : 420}
      >
        {showLoginQR ? (
          <WechatQRCode
            mode="login"
            onSuccess={handleLoginWithWechat}
            onCancel={() => setShowLoginQR(false)}
          />
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ margin: 0, color: '#333' }}>欢迎回来</Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>登录以同步您的数据</Text>
            </div>

            {loginError && (
              <Alert message={loginError} type="error" showIcon closable style={{ marginBottom: '16px' }} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>用户名</Text>
                <Input
                  placeholder="请输入用户名"
                  prefix={<UserOutlined style={{ color: '#CCC' }} />}
                  size="large"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  onPressEnter={handleLogin}
                />
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>密码</Text>
                <Input.Password
                  placeholder="请输入密码"
                  prefix={<LockOutlined style={{ color: '#CCC' }} />}
                  size="large"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  onPressEnter={handleLogin}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => { setShowLoginModal(false); setShowForgotModal(true); }}
                >
                  忘记密码？
                </Button>
              </div>

              <Button type="primary" block size="large" onClick={handleLogin}>
                登录
              </Button>

              <Divider plain>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <QrcodeOutlined />
                  <Text style={{ color: '#999', fontSize: '12px' }}>其他方式</Text>
                </div>
              </Divider>

              <Button
                block
                size="large"
                icon={<WechatOutlined style={{ color: '#07C160' }} />}
                onClick={() => setShowLoginQR(true)}
              >
                微信扫码登录
              </Button>

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: '#999', fontSize: '13px' }}>还没有账号？</Text>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                    setShowRegisterQR(false);
                  }}
                >
                  立即注册
                </Button>
              </div>

              <Text style={{ color: '#999', fontSize: '12px', textAlign: 'center', display: 'block' }}>
                登录即表示您同意
                <Button type="link" size="small" style={{ padding: '0 4px', height: 'auto' }}>用户协议</Button>
                和
                <Button type="link" size="small" style={{ padding: '0 4px', height: 'auto' }}>隐私政策</Button>
              </Text>
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={showRegisterModal}
        onCancel={() => { setShowRegisterModal(false); setShowRegisterQR(false); setRegisterId(''); setRegisterPassword(''); setRegisterConfirmPassword(''); setRegisterNickname(''); setRegisterErrors([]); }}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '24px' } }}
        width={showRegisterQR ? 320 : 420}
      >
        {showRegisterQR ? (
          <WechatQRCode
            mode="register"
            onSuccess={handleRegisterWithWechat}
            onCancel={() => setShowRegisterQR(false)}
          />
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ margin: 0, color: '#333' }}>创建账号</Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>开始您的健康管理之旅</Text>
            </div>

            {registerErrors.length > 0 && (
              <Alert
                message={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {registerErrors.map((err, i) => (
                      <Text key={i} style={{ fontSize: '12px' }}>{err}</Text>
                    ))}
                  </div>
                }
                type="error"
                showIcon
                closable
                style={{ marginBottom: '16px' }}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>昵称</Text>
                <Input
                  placeholder="请输入昵称"
                  prefix={<UserOutlined style={{ color: '#CCC' }} />}
                  size="large"
                  value={registerNickname}
                  onChange={(e) => setRegisterNickname(e.target.value)}
                />
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>性别</Text>
                <AntSpace.Compact style={{ width: '100%' }}>
                  <Button
                    block
                    size="large"
                    type={registerGender === 'male' ? 'primary' : 'default'}
                    onClick={() => setRegisterGender('male')}
                  >
                    男
                  </Button>
                  <Button
                    block
                    size="large"
                    type={registerGender === 'female' ? 'primary' : 'default'}
                    onClick={() => setRegisterGender('female')}
                  >
                    女
                  </Button>
                </AntSpace.Compact>
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>用户名</Text>
                <Input
                  placeholder="字母、数字、下划线，4-20位"
                  prefix={<UserOutlined style={{ color: '#CCC' }} />}
                  size="large"
                  value={registerId}
                  onChange={(e) => setRegisterId(e.target.value)}
                />
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>
                  密码
                </Text>
                <Input.Password
                  placeholder="至少8位，含大小写字母和数字"
                  prefix={<LockOutlined style={{ color: '#CCC' }} />}
                  size="large"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                />
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>确认密码</Text>
                <Input.Password
                  placeholder="请再次输入密码"
                  prefix={<LockOutlined style={{ color: '#CCC' }} />}
                  size="large"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                />
              </div>

              <Button type="primary" block size="large" onClick={handleRegister}>
                注册
              </Button>

              <Divider plain>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <QrcodeOutlined />
                  <Text style={{ color: '#999', fontSize: '12px' }}>其他方式</Text>
                </div>
              </Divider>

              <Button
                block
                size="large"
                icon={<WechatOutlined style={{ color: '#07C160' }} />}
                onClick={() => setShowRegisterQR(true)}
              >
                微信扫码注册
              </Button>

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: '#999', fontSize: '13px' }}>已有账号？</Text>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                    setShowLoginQR(false);
                  }}
                >
                  立即登录
                </Button>
              </div>

              <Text style={{ color: '#999', fontSize: '12px', textAlign: 'center', display: 'block' }}>
                注册即表示您同意
                <Button type="link" size="small" style={{ padding: '0 4px', height: 'auto' }}>用户协议</Button>
                和
                <Button type="link" size="small" style={{ padding: '0 4px', height: 'auto' }}>隐私政策</Button>
              </Text>
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={showForgotModal}
        onCancel={() => { 
          setShowForgotModal(false); 
          setShowForgotQR(false); 
          setForgotWechatId(''); 
          setForgotNewPassword(''); 
          setForgotConfirmPassword(''); 
          setForgotUsername('');
          setForgotResetCode('');
          setForgotStep('username');
          setResetPasswordError('');
          setGeneratedCode(null);
        }}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '24px' } }}
        width={showForgotQR ? 320 : 420}
      >
        {showForgotQR ? (
          <WechatQRCode
            mode="forgot"
            onSuccess={handleForgotWithWechat}
            onCancel={() => setShowForgotQR(false)}
          />
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ margin: 0, color: '#333' }}>找回密码</Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                {forgotStep === 'username' && '请输入您的用户名'}
                {forgotStep === 'verify' && '请输入验证码'}
                {(forgotStep === 'reset' || forgotStep === 'wechat') && '请设置新密码'}
              </Text>
            </div>

            {resetPasswordError && (
              <Alert message={resetPasswordError} type="error" showIcon closable style={{ marginBottom: '16px' }} />
            )}

            {generatedCode && forgotStep === 'verify' && (
              <Alert
                message={`验证码已生成！请使用控制台中的验证码: ${generatedCode}`}
                type="info"
                showIcon
                closable
                style={{ marginBottom: '16px' }}
              />
            )}

            {forgotWechatId && forgotStep === 'wechat' && (
              <Alert
                message={
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <WechatOutlined style={{ color: '#07C160' }} />
                    <Text>身份验证成功，请设置新密码</Text>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {/* 步骤 1: 输入用户名 */}
              {forgotStep === 'username' && (
                <>
                  <div>
                    <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>用户名</Text>
                    <Input
                      placeholder="请输入您的用户名"
                      prefix={<UserOutlined style={{ color: '#CCC' }} />}
                      size="large"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                    />
                  </div>
                  
                  <Button type="primary" block size="large" onClick={handleGenerateResetCode}>
                    获取验证码
                  </Button>

                  <Divider plain>或</Divider>
                  
                  <Button
                    block
                    size="large"
                    icon={<WechatOutlined style={{ color: '#07C160' }} />}
                    onClick={() => setShowForgotQR(true)}
                  >
                    通过微信验证重置
                  </Button>
                </>
              )}

              {/* 步骤 2: 验证重置码 */}
              {forgotStep === 'verify' && (
                <>
                  <div>
                    <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>验证码</Text>
                    <Input
                      placeholder="请输入6位验证码"
                      prefix={<LockOutlined style={{ color: '#CCC' }} />}
                      size="large"
                      value={forgotResetCode}
                      onChange={(e) => setForgotResetCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  
                  <Button type="primary" block size="large" onClick={handleVerifyResetCode}>
                    验证
                  </Button>
                  
                  <Button 
                    block 
                    size="large" 
                    onClick={() => {
                      setForgotStep('username');
                      setForgotUsername('');
                      setForgotResetCode('');
                      setGeneratedCode(null);
                    }}
                  >
                    返回
                  </Button>
                </>
              )}

              {/* 步骤 3: 重置密码 */}
              {(forgotStep === 'reset' || forgotStep === 'wechat') && (
                <>
                  <div>
                    <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>新密码</Text>
                    <Input.Password
                      placeholder="至少8位，含大小写字母和数字"
                      prefix={<LockOutlined style={{ color: '#CCC' }} />}
                      size="large"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </div>

                  <div>
                    <Text style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '12px' }}>确认新密码</Text>
                    <Input.Password
                      placeholder="请再次输入新密码"
                      prefix={<LockOutlined style={{ color: '#CCC' }} />}
                      size="large"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </div>

                  <Button 
                    type="primary" 
                    block 
                    size="large" 
                    onClick={forgotStep === 'wechat' ? handleResetPasswordByWechat : handleResetPassword}
                  >
                    重置密码
                  </Button>

                  <Button 
                    block 
                    size="large" 
                    onClick={() => {
                      setForgotStep('username');
                      setForgotUsername('');
                      setForgotWechatId('');
                      setForgotResetCode('');
                      setForgotNewPassword('');
                      setForgotConfirmPassword('');
                      setGeneratedCode(null);
                      setShowForgotQR(false);
                    }}
                  >
                    返回
                  </Button>
                </>
              )}

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: '#999', fontSize: '13px' }}>想起密码了？</Text>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setShowForgotModal(false);
                    setShowLoginModal(true);
                    setShowLoginQR(false);
                    setForgotStep('username');
                  }}
                >
                  返回登录
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
