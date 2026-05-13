import { useState, useRef } from 'react';
import { Button, Card, message, Space, Tag } from 'antd';
import { CameraOutlined, PictureOutlined, CloseOutlined, CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCalorieStore } from '../store/calorieStore';
import { recognizeFood, getLocalCalorie, FoodRecognitionResult } from '../services/baiduFoodRecognition';
import { getFoodsByCategory, Food } from '../utils/foodDatabase';

interface RecognizedItem {
  result: FoodRecognitionResult;
  food: Food;
  grams: number;
}

export default function FoodRecognitionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResults, setRecognitionResults] = useState<FoodRecognitionResult[]>([]);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  const [error, setError] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addFoodRecord } = useCalorieStore();

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

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

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
      const items: RecognizedItem[] = results.map(result => {
        const allFoods = getFoodsByCategory('all');
        const matchedFood = allFoods.find(food =>
          food.name.includes(result.name) || result.name.includes(food.name)
        );
        const food = matchedFood || {
          id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: result.name,
          calorie: result.calorie || getLocalCalorie(result.name),
          unit: '100g',
          category: '其他',
        };
        return { result, food, grams: 100 };
      });
      setRecognizedItems(items);
    } catch (err) {
      console.error('识别失败:', err);
      setError('识别失败，请重试');
    } finally {
      setIsRecognizing(false);
    }
  };

  const updateGrams = (index: number, grams: number) => {
    setRecognizedItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], grams };
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setRecognizedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    if (recognizedItems.length === 0) {
      messageApi.warning('请先识别食物');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let totalCalories = 0;
    let totalCount = 0;

    recognizedItems.forEach(({ food, grams }) => {
      const calorie = Math.round(((food.calorie || 0) * grams) / 100);
      const macro = food.protein !== undefined
        ? {
            protein: Math.round((food.protein * grams) / 100),
            fat: Math.round(((food.fat || 0) * grams) / 100),
            carbs: Math.round(((food.carbs || 0) * grams) / 100),
          }
        : undefined;

      addFoodRecord({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        date: now.toISOString().split('T')[0],
        name: food.name,
        calorie,
        time: timeStr,
        mealType: 'lunch',
        macro,
        timestamp: now.getTime(),
      });
      totalCalories += calorie;
      totalCount++;
    });

    messageApi.success(`已保存 ${totalCount} 种食物，共 ${totalCalories} 千卡`);
    handleReset();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setRecognitionResults([]);
    setRecognizedItems([]);
    setError('');
    closeCamera();
  };

  const getItemCalorie = (item: RecognizedItem) => {
    return Math.round(((item.food.calorie || 0) * item.grams) / 100);
  };

  const getTotalCalories = () => {
    return recognizedItems.reduce((sum, item) => sum + getItemCalorie(item), 0);
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '20px', padding: '4px 0',
        }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'home' } }))}
            size="large"
            style={{ padding: '4px 8px' }}
          />
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#333' }}>📷 AI 拍照识食物</h1>
          <div style={{ width: '36px' }} />
        </div>

        {/* Description */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px', padding: '16px', marginBottom: '20px',
          color: '#fff',
        }}>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            拍一张食物照片，AI 自动识别并记录热量
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FFF2F0', border: '1px solid #FFCCC7', borderRadius: '8px',
            padding: '12px', marginBottom: '16px', color: '#CF1322', fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {/* Camera / Image Selection */}
        {isCameraOpen ? (
          <div style={{ marginBottom: '16px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', borderRadius: '12px', backgroundColor: '#000' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Space style={{ width: '100%', marginTop: '12px' }} size={12}>
              <Button type="primary" size="large" onClick={takePhoto} style={{ flex: 1 }}>
                📸 拍照
              </Button>
              <Button size="large" onClick={closeCamera} style={{ flex: 1 }}>
                取消
              </Button>
            </Space>
          </div>
        ) : selectedImage ? (
          <div style={{ marginBottom: '16px' }}>
            <img
              src={selectedImage}
              alt="预览"
              style={{ width: '100%', borderRadius: '12px', marginBottom: '12px' }}
            />

            {!recognitionResults.length && !isRecognizing && (
              <Button
                type="primary"
                size="large"
                block
                onClick={handleRecognize}
                style={{ borderRadius: '12px', height: '44px', fontSize: '15px', marginBottom: '12px' }}
              >
                🔍 开始识别
              </Button>
            )}

            <Button
              size="large"
              block
              onClick={handleReset}
              style={{ borderRadius: '12px', height: '40px' }}
            >
              重新拍照/选择
            </Button>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <Space orientation="vertical" style={{ width: '100%' }} size={16}>
              <button
                onClick={openCamera}
                style={{
                  width: '100%', padding: '32px', borderRadius: '12px',
                  border: '2px dashed #D9D9D9', background: '#FAFAFA',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '12px',
                }}
              >
                <CameraOutlined style={{ fontSize: '40px', color: '#667eea' }} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>拍照识别</span>
                <span style={{ fontSize: '12px', color: '#999' }}>直接拍摄食物照片</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', padding: '32px', borderRadius: '12px',
                  border: '2px dashed #D9D9D9', background: '#FAFAFA',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '12px',
                }}
              >
                <PictureOutlined style={{ fontSize: '40px', color: '#764ba2' }} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>相册选择</span>
                <span style={{ fontSize: '12px', color: '#999' }}>从相册选择食物图片</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </Space>
          </div>
        )}

        {/* Recognizing */}
        {isRecognizing && (
          <Card style={{ marginBottom: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
            <p style={{ margin: 0, color: '#666' }}>AI 正在识别中...</p>
          </Card>
        )}

        {/* Recognized Items */}
        {recognizedItems.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '16px', fontWeight: 700, color: '#333',
              marginBottom: '12px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span> 识别结果</span>
              <Tag color="blue">{recognizedItems.length} 种食物</Tag>
            </div>

            {recognizedItems.map((item, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: '12px', borderRadius: '8px' }}
                styles={{ body: { padding: '12px' } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>{item.food.name}</span>
                    <Tag color="orange" style={{ marginLeft: '8px' }}>
                      {item.food.calorie || 0} 千卡/100g
                    </Tag>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => removeItem(index)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#666' }}>份量:</span>
                  <input
                    type="number"
                    value={item.grams}
                    onChange={(e) => updateGrams(index, Number(e.target.value))}
                    min="1"
                    max="2000"
                    style={{
                      width: '70px', padding: '4px 8px', border: '1px solid #D9D9D9',
                      borderRadius: '4px', fontSize: '14px', textAlign: 'center',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#666' }}>克</span>
                  <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 700, color: '#FA8C16' }}>
                    {getItemCalorie(item)} 千卡
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  {[50, 100, 200, 300].map(g => (
                    <Button
                      key={g}
                      size="small"
                      type={item.grams === g ? 'primary' : 'default'}
                      onClick={() => updateGrams(index, g)}
                      style={{ flex: 1, fontSize: '12px' }}
                    >
                      {g}g
                    </Button>
                  ))}
                </div>
              </Card>
            ))}

            {/* Total */}
            <div style={{
              background: '#F6FFED', border: '1px solid #B7EB8F', borderRadius: '8px',
              padding: '12px 16px', marginBottom: '16px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 600 }}>
                总计: {recognizedItems.length} 种食物
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#52C41A' }}>
                {getTotalCalories()} 千卡
              </span>
            </div>

            {/* Save Button */}
            <Button
              type="primary"
              size="large"
              block
              icon={<CheckOutlined />}
              onClick={handleSaveAll}
              style={{ borderRadius: '12px', height: '48px', fontSize: '16px' }}
            >
              ✅ 保存到饮食记录
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
