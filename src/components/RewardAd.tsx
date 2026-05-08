import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';

interface RewardAdProps {
  onComplete: () => void;
  onSkip?: () => void;
  rewardText?: string;
}

export default function RewardAd({ onComplete, onSkip, rewardText = '解锁Pro功能' }: RewardAdProps) {
  const [countdown, setCountdown] = useState(5);
  const { canShowAd, recordAdView } = useCalorieStore();
  const [watching, setWatching] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!canShowAd()) {
    return null;
  }

  const handleWatchAd = () => {
    setWatching(true);
    let count = 5;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        setCompleted(true);
        recordAdView();
      }
    }, 1000);
  };

  const handleComplete = () => {
    recordAdView();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 overflow-hidden">
        {!watching ? (
          <>
            <div className="p-6 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">观看广告</h3>
              <p className="text-sm text-gray-600 mb-4">
                观看5秒广告，解锁{rewardText}
              </p>
              <button
                onClick={handleWatchAd}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium"
              >
                观看广告
              </button>
            </div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full py-3 bg-gray-100 text-gray-600 text-sm"
              >
                稍后再说
              </button>
            )}
          </>
        ) : !completed ? (
          <div className="p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-8 border-purple-200"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-purple-500"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((countdown / 5) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((countdown / 5) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">{countdown}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">正在播放广告...</p>
            <p className="text-xs text-gray-400 mt-2">请耐心等待</p>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">观看完成</h3>
            <p className="text-sm text-gray-600 mb-4">
              恭喜你已获得{rewardText}
            </p>
            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium"
            >
              立即使用
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
