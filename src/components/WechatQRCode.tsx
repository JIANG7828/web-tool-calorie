import { useState, useEffect } from 'react';
import { Card, Space, Typography, Button, Spin, App } from 'antd';
import { WechatOutlined, ScanOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface WechatQRCodeProps {
  mode: 'login' | 'register' | 'forgot';
  onSuccess?: (wechatId: string) => void;
  onCancel?: () => void;
}

export default function WechatQRCode({ mode, onSuccess, onCancel }: WechatQRCodeProps) {
  const { message } = App.useApp();
  const [qrCode, setQrCode] = useState('');
  const [scanState, setScanState] = useState<'waiting' | 'scanned' | 'success' | 'expired'>('waiting');
  const [countdown, setCountdown] = useState(300);
  const [mockWechatId, setMockWechatId] = useState('');

  useEffect(() => {
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=health_app_${mode}_${Date.now()}`);
    setCountdown(300);
    setScanState('waiting');
  }, [mode]);

  useEffect(() => {
    if (countdown <= 0) {
      setScanState('expired');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const simulateScan = () => {
    setScanState('scanned');
    setTimeout(() => {
      const fakeWechatId = `wx_${Math.random().toString(36).substr(2, 12)}`;
      setMockWechatId(fakeWechatId);
      setScanState('success');
      message.success('微信扫码成功！');
      onSuccess?.(fakeWechatId);
    }, 1500);
  };

  const refreshQRCode = () => {
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=health_app_${mode}_${Date.now()}`);
    setScanState('waiting');
    setCountdown(300);
    setMockWechatId('');
  };

  const modeConfig = {
    login: {
      title: '微信扫码登录',
      subtitle: '使用微信扫描二维码快速登录',
      successText: '扫码成功，正在登录...',
    },
    register: {
      title: '微信扫码注册',
      subtitle: '使用微信扫描二维码快速注册',
      successText: '扫码成功，正在注册...',
    },
    forgot: {
      title: '微信扫码找回密码',
      subtitle: '使用微信扫码验证身份找回密码',
      successText: '扫码成功，正在验证身份...',
    },
  };

  const config = modeConfig[mode];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#333' }}>{config.title}</Title>
          <Text style={{ color: '#999', fontSize: '13px' }}>{config.subtitle}</Text>
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Card
            style={{
              width: '220px',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            styles={{ body: { padding: '0' } }}
          >
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
              {scanState === 'waiting' && (
                <img
                  src={qrCode}
                  alt="微信扫码"
                  style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                />
              )}

              {scanState === 'scanned' && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '8px',
                }}>
                  <LoadingOutlined style={{ fontSize: '48px', color: '#07C160' }} />
                  <Text style={{ marginTop: '12px', color: '#333', fontSize: '14px' }}>
                    已扫码，请在手机上确认
                  </Text>
                </div>
              )}

              {scanState === 'success' && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '8px',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#07C160',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}>
                    <WechatOutlined style={{ fontSize: '32px', color: '#FFF' }} />
                  </div>
                  <Text strong style={{ color: '#333', fontSize: '14px' }}>
                    {config.successText}
                  </Text>
                </div>
              )}

              {scanState === 'expired' && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '8px',
                }}>
                  <ScanOutlined style={{ fontSize: '48px', color: '#999' }} />
                  <Text style={{ marginTop: '12px', color: '#999', fontSize: '14px' }}>
                    二维码已过期
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    onClick={refreshQRCode}
                    style={{ marginTop: '8px' }}
                  >
                    点击刷新
                  </Button>
                </div>
              )}

              {scanState === 'waiting' && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  right: '8px',
                  bottom: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }} onClick={simulateScan}>
                  <ScanOutlined style={{ fontSize: '40px', color: '#07C160', marginBottom: '8px' }} />
                  <Text style={{ color: '#07C160', fontSize: '13px', fontWeight: 600 }}>
                    模拟扫码（点击此处）
                  </Text>
                  <Text style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>
                    演示模式：点击模拟微信扫码
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </div>

        {scanState === 'waiting' && (
          <Text style={{ color: '#666', fontSize: '12px' }}>
            二维码有效期：{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </Text>
        )}

        <Text style={{ color: '#999', fontSize: '11px' }}>
          打开微信 → 扫一扫 → 扫描二维码
        </Text>

        {onCancel && (
          <Button type="text" size="small" onClick={onCancel}>
            返回其他方式
          </Button>
        )}
      </div>
    </div>
  );
}
