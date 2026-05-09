interface WaterSuccessModalProps {
  waterCount: number;
  onClose: () => void;
}

export default function WaterSuccessModal({ waterCount, onClose }: WaterSuccessModalProps) {
  const getMessage = () => {
    if (waterCount >= 8) {
      return { title: '太棒了！', emoji: '🎉', message: '今日饮水目标已达成！' };
    } else if (waterCount >= 6) {
      return { title: '继续加油！', emoji: '💪', message: `已喝 ${waterCount} 杯，还差 ${8 - waterCount} 杯` };
    } else {
      return { title: '记录成功！', emoji: '', message: `已喝 ${waterCount} 杯，继续保持！` };
    }
  };

  const { title, emoji, message } = getMessage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-sm mx-4 p-6 animate-slide-up">
        <div className="text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {/* Water Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>今日饮水</span>
              <span>{waterCount}/8 杯</span>
            </div>
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((waterCount / 8) * 100, 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-medium transition-all hover:shadow-lg active:scale-[0.98]"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
