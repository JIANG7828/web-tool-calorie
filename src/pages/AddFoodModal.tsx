import { Card, Space, Tag, Button, Modal, Avatar } from 'antd';
import { CloseOutlined, CheckOutlined, SearchOutlined, CameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { searchFood, getFoodsByCategory, FOOD_DATABASE, Food, FOOD_CATEGORIES } from '../utils/foodDatabase';
import FoodRecognitionModal from '../components/FoodRecognitionModal';
import FoodIcons from '../components/FoodIcons';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEAL_TYPES = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' },
  { key: 'snack', label: '加餐' },
];

// Map food name to icon key
function getFoodIconKey(name: string, category: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('米饭') || lower.includes('炒饭') || lower.includes('盖浇饭') || lower.includes('糙米饭')) return 'rice';
  if (lower.includes('面条') || lower.includes('拉面') || lower.includes('刀削面') || lower.includes('乌冬面')) return 'noodles';
  if (lower.includes('饺子') || lower.includes('蒸饺') || lower.includes('煎饺')) return 'dumpling';
  if (lower.includes('馒头') || lower.includes('花卷')) return 'mantou';
  if (lower.includes('包子') || lower.includes('肉包') || lower.includes('菜包')) return 'baozi';
  if (lower.includes('面包') || lower.includes('吐司') || lower.includes('全麦面包')) return 'bread';
  if (lower.includes('馄饨') || lower.includes('云吞')) return 'wonton';
  if (lower.includes('玉米')) return 'corn';
  if (lower.includes('红薯') || lower.includes('地瓜')) return 'sweetPotato';
  if (lower.includes('土豆') || lower.includes('马铃薯')) return 'potato';
  if (lower.includes('粥') || lower.includes('白粥') || lower.includes('小米粥') || lower.includes('燕麦粥')) return 'porridge';
  if (lower.includes('鸡蛋') || lower.includes('鹌鹑蛋') || lower.includes('蛋')) return 'egg';
  if (lower.includes('牛奶') || lower.includes('纯牛奶') || lower.includes('低脂牛奶')) return 'milk';
  if (lower.includes('酸奶')) return 'yogurt';
  if (lower.includes('豆腐')) return 'tofu';
  if (lower.includes('鸡胸肉') || lower.includes('鸡胸')) return 'chickenBreast';
  if (lower.includes('牛肉') || lower.includes('牛排') || lower.includes('牛腩') || lower.includes('牛腱')) return 'beef';
  if (lower.includes('猪肉') || lower.includes('五花肉') || lower.includes('猪里脊')) return 'pork';
  if (lower.includes('鱼') || lower.includes('鲈鱼') || lower.includes('草鱼') || lower.includes('鲤鱼')) return 'fish';
  if (lower.includes('虾') || lower.includes('虾仁') || lower.includes('虾滑')) return 'shrimp';
  if (lower.includes('西兰花')) return 'broccoli';
  if (lower.includes('西红柿') || lower.includes('番茄')) return 'tomato';
  if (lower.includes('黄瓜')) return 'cucumber';
  if (lower.includes('胡萝卜')) return 'carrot';
  if (lower.includes('苹果')) return 'apple';
  if (lower.includes('香蕉')) return 'banana';
  if (lower.includes('橙子') || lower.includes('橘子')) return 'orange';
  if (lower.includes('葡萄')) return 'grape';
  if (lower.includes('西瓜')) return 'watermelon';
  if (lower.includes('草莓')) return 'strawberry';
  if (lower.includes('花生')) return 'peanut';
  if (lower.includes('核桃')) return 'walnut';
  if (lower.includes('咖啡')) return 'coffee';
  if (lower.includes('奶茶') || lower.includes('波霸')) return 'milkTea';
  if (lower.includes('可乐') || lower.includes('雪碧') || lower.includes('芬达')) return 'cola';
  if (lower.includes('冰淇淋') || lower.includes('雪糕')) return 'icecream';
  if (lower.includes('蛋糕') || lower.includes('芝士蛋糕') || lower.includes('慕斯')) return 'cake';
  if (lower.includes('巧克力')) return 'chocolate';
  if (lower.includes('披萨')) return 'pizza';
  if (lower.includes('汉堡')) return 'burger';
  if (lower.includes('薯条')) return 'fries';
  if (lower.includes('寿司')) return 'sushi';
  if (lower.includes('汤') || lower.includes('羹')) return 'soup';
  if (lower.includes('沙拉')) return 'salad';
  if (lower.includes('果汁')) return 'juice';
  if (lower.includes('茶') || lower.includes('绿茶') || lower.includes('红茶')) return 'tea';
  if (lower.includes('蜂蜜')) return 'honey';
  if (lower.includes('饼干') || lower.includes('曲奇')) return 'cookie';
  if (lower.includes('爆米花')) return 'popcorn';
  if (lower.includes('薯片')) return 'chips';
  // Default to appropriate category icon
  if (lower.includes('蔬菜') || lower.includes('白菜') || lower.includes('菠菜') || lower.includes('生菜')) return 'vegetable';
  if (lower.includes('坚果') || lower.includes('杏仁') || lower.includes('腰果') || lower.includes('瓜子') || lower.includes('松子')) return 'nut';
  if (lower.includes('饮料') || lower.includes('柠檬水') || lower.includes('苏打水')) return 'drink';
  // Fallback based on category
  if (category.includes('主食')) return 'rice';
  if (category.includes('蔬菜')) return 'vegetable';
  if (category.includes('水果')) return 'apple';
  if (category.includes('肉蛋')) return 'egg';
  if (category.includes('奶')) return 'milk';
  if (category.includes('豆')) return 'tofu';
  if (category.includes('零食') || category.includes('饮料')) return 'cookie';
  if (category.includes('汤')) return 'soup';
  return 'rice';
}

const getCalorieColor = (calorie: number): string => {
  if (calorie < 50) return '#52C41A';
  if (calorie < 150) return '#FAAD14';
  if (calorie < 300) return '#FA8C16';
  return '#FF4D4F';
};

export default function AddFoodModal({ isOpen, onClose }: AddFoodModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState(100);
  const [mealType, setMealType] = useState('lunch');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showRecognition, setShowRecognition] = useState(false);
  const { addFoodRecord } = useCalorieStore();

  const foods = searchTerm
    ? searchFood(searchTerm)
    : activeCategory === 'all'
    ? FOOD_DATABASE
    : getFoodsByCategory(activeCategory);

  const handleAdd = () => {
    if (!selectedFood) return;
    const calorie = Math.round((selectedFood.calorie * portion) / 100);
    const macro = selectedFood.protein !== undefined
      ? {
          protein: Math.round((selectedFood.protein * portion) / 100),
          fat: Math.round(((selectedFood.fat || 0) * portion) / 100),
          carbs: Math.round(((selectedFood.carbs || 0) * portion) / 100),
        }
      : undefined;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addFoodRecord({
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      name: selectedFood.name,
      calorie,
      time: timeStr,
      mealType: mealType as any,
      macro,
      timestamp: now.getTime(),
    });
    setSelectedFood(null);
    setSearchTerm('');
    setPortion(100);
    onClose();
  };

  const handleFoodFromRecognition = (food: Food, grams: number) => {
    const calorie = Math.round((food.calorie * grams) / 100);
    const macro = food.protein !== undefined
      ? {
          protein: Math.round((food.protein * grams) / 100),
          fat: Math.round(((food.fat || 0) * grams) / 100),
          carbs: Math.round(((food.carbs || 0) * grams) / 100),
        }
      : undefined;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addFoodRecord({
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      name: food.name,
      calorie,
      time: timeStr,
      mealType: mealType as any,
      macro,
      timestamp: now.getTime(),
    });
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{
          body: { padding: '16px' },
        }}
        mask={{ closable: true }}
      >
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h2 className="page-title" style={{ marginBottom: '12px' }}>添加食物</h2>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="搜索食物名称..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setActiveCategory('all'); }}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: '1px solid #D9D9D9', borderRadius: '6px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <SearchOutlined style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: '#666', fontSize: '14px',
            }} />
          </div>

          {/* Meal Type */}
          <Space size={8} style={{ marginBottom: '12px' }} wrap>
            {MEAL_TYPES.map((t) => (
              <Button
                key={t.key}
                type={mealType === t.key ? 'primary' : 'default'}
                size="small"
                onClick={() => setMealType(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </Space>

          {/* AI Recognition */}
          <Button
            type="default"
            icon={<CameraOutlined />}
            onClick={() => setShowRecognition(true)}
            style={{ width: '100%', marginBottom: '12px', borderRadius: '6px' }}
          >
            拍照识别食物
          </Button>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }} className="scrollbar-hide">
            <Button
              size="small"
              type={activeCategory === 'all' && !searchTerm ? 'primary' : 'default'}
              onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
            >
              全部
            </Button>
            {FOOD_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="small"
                type={activeCategory === cat ? 'primary' : 'default'}
                onClick={() => { setActiveCategory(cat); setSearchTerm(''); }}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Food Count */}
          <p className="caption-text" style={{ marginBottom: '12px' }}>共 {foods.length} 种食物</p>

          {/* Food List */}
          {foods.length > 0 ? (
            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              <Space orientation="vertical" size={6} style={{ width: '100%' }}>
                {foods.slice(0, 50).map((food) => {
                  const iconKey = getFoodIconKey(food.name, food.category);
                  const iconSvg = FoodIcons[iconKey as keyof typeof FoodIcons] || FoodIcons.rice;

                  return (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px', borderRadius: '8px', cursor: 'pointer',
                        border: selectedFood?.id === food.id ? '1px solid #1677FF' : '1px solid #F0F0F0',
                        backgroundColor: selectedFood?.id === food.id ? '#E6F4FF' : '#FAFAFA',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Avatar
                        shape="square"
                        size={36}
                        style={{
                          background: '#F5F7FA',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                        }}
                      >
                        {iconSvg}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {food.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: getCalorieColor(food.calorie) }}>
                            {food.calorie}千卡
                          </span>
                          <span style={{ fontSize: '12px', color: '#666' }}>/{food.unit}</span>
                        </div>
                      </div>
                      {selectedFood?.id === food.id && (
                        <CheckOutlined style={{ color: '#1677FF', fontSize: '16px' }} />
                      )}
                    </div>
                  );
                })}
              </Space>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
              <p style={{ fontSize: '14px' }}>
                {searchTerm ? '未找到相关食物' : '选择分类查看食物'}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
          {selectedFood && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>份量</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>{portion}g</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span className="caption-text">50g</span>
                <span className="caption-text">500g</span>
              </div>

              {/* Nutrition Summary */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                <Tag color="blue" style={{ fontSize: '12px' }}>
                  🔥 {Math.round((selectedFood.calorie * portion) / 100)} 千卡
                </Tag>
                {selectedFood.protein !== undefined && (
                  <>
                    <Tag color="blue" style={{ fontSize: '12px' }}>蛋白质 {Math.round((selectedFood.protein * portion) / 100)}g</Tag>
                    <Tag color="gold" style={{ fontSize: '12px' }}>脂肪 {Math.round(((selectedFood.fat || 0) * portion) / 100)}g</Tag>
                  </>
                )}
              </div>
            </div>
          )}
          <Button
            type="primary"
            block
            onClick={handleAdd}
            disabled={!selectedFood}
            size="large"
            style={{ borderRadius: '6px' }}
          >
            确认添加
          </Button>
        </div>
      </Modal>

      {/* Food Recognition Modal */}
      <FoodRecognitionModal
        isOpen={showRecognition}
        onClose={() => setShowRecognition(false)}
        onFoodSelected={handleFoodFromRecognition}
      />
    </>
  );
}
