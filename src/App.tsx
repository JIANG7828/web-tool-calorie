import { Layout, ConfigProvider, App as AntdApp } from 'antd';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import ExercisePage from './pages/ExercisePage';
import ProfilePage from './pages/ProfilePage';
import TakeoutPage from './pages/TakeoutPage';
import FoodRecognitionPage from './pages/FoodRecognitionPage';
import FoodRecordsPage from './pages/FoodRecordsPage';
import { HomeOutlined, BookOutlined, CameraOutlined, FireOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { useCalorieStore } from './store/calorieStore';

const { Content } = Layout;

type TabType = 'home' | 'recipe' | 'recognition' | 'records' | 'exercise' | 'profile';

interface AddFoodRecordEvent {
  name: string;
  calorie: number;
  time: string;
  mealType: string;
  macro: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { addFoodRecord } = useCalorieStore();

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab: TabType }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };

    const handleAddFoodRecord = (event: Event) => {
      const customEvent = event as CustomEvent<AddFoodRecordEvent>;
      if (customEvent.detail) {
        const { name, calorie, time, mealType, macro } = customEvent.detail;
        const now = new Date();
        addFoodRecord({
          id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
          date: now.toISOString().split('T')[0],
          name,
          calorie,
          time,
          mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
          macro,
          timestamp: now.getTime(),
        });
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    window.addEventListener('addFoodRecord', handleAddFoodRecord as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
      window.removeEventListener('addFoodRecord', handleAddFoodRecord as EventListener);
    };
  }, [addFoodRecord]);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'recipe':
        return <TakeoutPage />;
      case 'recognition':
        return <FoodRecognitionPage />;
      case 'records':
        return <FoodRecordsPage />;
      case 'exercise':
        return <ExercisePage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Home />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677FF',
          colorSuccess: '#52C41A',
          colorWarning: '#FAAD14',
          colorError: '#FF4D4F',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Card: {
            borderRadiusLG: 8,
          },
          Button: {
            borderRadius: 6,
          },
          Input: {
            borderRadius: 6,
          },
          Tabs: {
            borderRadius: 8,
          },
        },
      }}
    >
      <AntdApp>
        <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', maxWidth: '480px', margin: '0 auto' }}>
        <Layout.Content style={{ paddingBottom: '64px' }}>
          {renderPage()}
        </Layout.Content>

        <Layout.Footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: '480px',
            margin: '0 auto',
            padding: '8px 0',
            backgroundColor: '#fff',
            borderTop: '1px solid #F0F0F0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { key: 'home' as TabType, icon: <HomeOutlined />, label: '首页' },
              { key: 'recipe' as TabType, icon: <BookOutlined />, label: '菜谱' },
              { key: 'records' as TabType, icon: <FileTextOutlined />, label: '记录' },
              { key: 'recognition' as TabType, icon: <CameraOutlined />, label: '识食物' },
              { key: 'exercise' as TabType, icon: <FireOutlined />, label: '运动' },
              { key: 'profile' as TabType, icon: <UserOutlined />, label: '我的' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: activeTab === item.key ? '#1677FF' : '#999',
                  fontSize: '12px',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Layout.Footer>
      </Layout>
      </AntdApp>
    </ConfigProvider>
  );
}

export default AppContent;
