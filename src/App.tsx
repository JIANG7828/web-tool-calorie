import { useState } from 'react';
import Home from './pages/Home';
import ExercisePage from './pages/ExercisePage';
import ProfilePage from './pages/ProfilePage';

type TabType = 'home' | 'exercise' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'exercise':
        return <ExercisePage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative">
      <div className="pb-20">
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-4 transition-all ${
              activeTab === 'home'
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">
              {activeTab === 'home' ? '🏠' : '🏡'}
            </div>
            <div className="text-xs font-medium">首页</div>
          </button>

          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex flex-col items-center py-2 px-4 transition-all ${
              activeTab === 'exercise'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">
              {activeTab === 'exercise' ? '🔥' : '💪'}
            </div>
            <div className="text-xs font-medium">运动</div>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-4 transition-all ${
              activeTab === 'profile'
                ? 'text-purple-600'
                : 'text-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">
              {activeTab === 'profile' ? '👤' : '👥'}
            </div>
            <div className="text-xs font-medium">我的</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
