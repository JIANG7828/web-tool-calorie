import { useState, useRef } from 'react';
import { recognizeFood, getLocalCalorie, FoodRecognitionResult } from '../services/baiduFoodRecognition';
import { FOOD_DATABASE, Food } from '../utils/foodDatabase';

interface FoodRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodSelected: (food: Food, grams: number) => void;
}

export default function FoodRecognitionModal({ isOpen, onClose, onFoodSelected }: FoodRecognitionModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResults, setRecognitionResults] = useState<FoodRecognitionResult[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [grams, setGrams] = useState(100);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 处理图片选择
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  // 打开相机
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
      setError('');
    } catch (err) {
      setError('无法访问相机，请检查权限设置');
      console.error('相机访问错误:', err);
    }
  };

  // 关闭相机
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // 拍照
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
        
        // 将 data URL 转换为 File 对象
        fetch(imageDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
          });
        
        closeCamera();
      }
    }
  };

  // 识别食物
  const handleRecognize = async () => {
    if (!selectedFile) {
      setError('请先选择或拍摄图片');
      return;
    }

    setIsRecognizing(true);
    setError('');

    try {
      const results = await recognizeFood(selectedFile);
      setRecognitionResults(results);
    } catch (err) {
      console.error('识别失败:', err);
      setError('识别失败，请重试');
    } finally {
      setIsRecognizing(false);
    }
  };

  // 选择食物
  const handleFoodSelect = (result: FoodRecognitionResult) => {
    // 在本地数据库中查找匹配的食物
    const matchedFood = FOOD_DATABASE.find(food => 
      food.name.includes(result.name) || result.name.includes(food.name)
    );

    if (matchedFood) {
      setSelectedFood(matchedFood);
    } else {
      // 如果没有找到匹配，创建临时食物
      const tempFood: Food = {
        id: `temp-${Date.now()}`,
        name: result.name,
        calorie: result.calorie || getLocalCalorie(result.name),
        unit: '100g',
        category: '其他',
      };
      setSelectedFood(tempFood);
    }
  };

  // 添加食物
  const handleAddFood = () => {
    if (selectedFood) {
      onFoodSelected(selectedFood, grams);
      handleReset();
      onClose();
    }
  };

  // 重置
  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setRecognitionResults([]);
    setSelectedFood(null);
    setGrams(100);
    setError('');
    closeCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">📷 AI 拍照识别食物</h3>
          <button onClick={onClose} className="text-2xl hover:opacity-70">×</button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* 图片预览/相机 */}
          {isCameraOpen ? (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={takePhoto}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
                >
                  📸 拍照
                </button>
                <button
                  onClick={closeCamera}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600"
                >
                  取消
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            <div className="space-y-4">
              <img src={selectedImage} alt="预览" className="w-full rounded-lg" />
              
              {!recognitionResults.length && !isRecognizing && (
                <button
                  onClick={handleRecognize}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90"
                >
                  🔍 开始识别
                </button>
              )}
              
              <button
                onClick={handleReset}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                重新选择图片
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={openCamera}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-6 rounded-xl hover:opacity-90 flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">📷</span>
                  <span className="font-medium">拍照识别</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-br from-green-500 to-teal-600 text-white py-6 rounded-xl hover:opacity-90 flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">🖼️</span>
                  <span className="font-medium">相册选择</span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <p className="text-center text-gray-500 text-sm">
                支持拍照或从相册选择食物图片
              </p>
            </div>
          )}

          {/* 识别中 */}
          {isRecognizing && (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">🔄</div>
              <p className="text-gray-600">AI 正在识别中...</p>
            </div>
          )}

          {/* 识别结果 */}
          {recognitionResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">🔍 识别结果</h4>
              <div className="space-y-2">
                {recognitionResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleFoodSelect(result)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedFood?.name === result.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{result.name}</div>
                        <div className="text-sm text-gray-500">
                          置信度: {result.probability}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">
                          {result.calorie || getLocalCalorie(result.name)} 千卡
                        </div>
                        <div className="text-xs text-gray-400">/ 100g</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 选择份量 */}
          {selectedFood && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">📝 设置份量</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">{selectedFood.name}</span>
                  <span className="text-orange-600 font-bold">
                    {selectedFood.calorie} 千卡/100g
                  </span>
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-gray-600">摄入份量 (克)</span>
                    <input
                      type="number"
                      value={grams}
                      onChange={(e) => setGrams(Number(e.target.value))}
                      min="1"
                      max="2000"
                      className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <div className="text-center text-lg">
                    <span className="text-gray-600">计算热量: </span>
                    <span className="font-bold text-orange-600">
                      {Math.round((selectedFood.calorie * grams) / 100)} 千卡
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 300].map(g => (
                  <button
                    key={g}
                    onClick={() => setGrams(g)}
                    className={`py-2 rounded-lg text-sm font-medium ${
                      grams === g
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        {selectedFood && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleAddFood}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:opacity-90"
            >
              ✅ 确认添加 {Math.round((selectedFood.calorie * grams) / 100)} 千卡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
