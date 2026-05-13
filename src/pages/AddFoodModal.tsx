import { Space, Tag, Button, Modal, Avatar, message } from 'antd';
import { CloseOutlined, CheckOutlined, SearchOutlined, PlusCircleOutlined, ArrowLeftOutlined, ArrowUpOutlined, CameraOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { searchFood, getFoodsByCategory, FOOD_DATABASE, Food } from '../utils/foodDatabase';
import FoodIcons from '../components/FoodIcons';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: string;
}

const MEAL_TYPES = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' },
  { key: 'snack', label: '加餐' },
];

const CATEGORIES = [
  { key: 'all', label: '常用' },
  { key: '主食', label: '主食' },
  { key: '蔬菜', label: '素菜' },
  { key: '肉蛋', label: '荤菜' },
  { key: '奶制品', label: '奶制品' },
  { key: '豆类坚果', label: '豆类坚果' },
  { key: '水果', label: '水果' },
  { key: '零食饮料', label: '零食饮料' },
  { key: '汤类', label: '汤类' },
  { key: '霸王茶姬', label: '霸王茶姬' },
  { key: '蜜雪冰城', label: '蜜雪冰城' },
  { key: '瑞幸', label: '瑞幸' },
  { key: '库迪', label: '库迪' },
  { key: '肯德基', label: '肯德基' },
  { key: '麦当劳', label: '麦当劳' },
  { key: '塔斯汀', label: '塔斯汀' },
  { key: '沙县小吃', label: '沙县小吃' },
];

function getFoodIconKey(name: string, category: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('米饭') || lower.includes('炒饭') || lower.includes('盖浇饭') || lower.includes('糙米饭')) return 'rice';
  if (lower.includes('面条') || lower.includes('拉面') || lower.includes('刀削面') || lower.includes('乌冬面') || lower.includes('炒面') || lower.includes('热干面') || lower.includes('油泼面')) return 'noodles';
  if (lower.includes('饺子') || lower.includes('蒸饺') || lower.includes('煎饺')) return 'dumpling';
  if (lower.includes('馒头') || lower.includes('花卷')) return 'mantou';
  if (lower.includes('包子') || lower.includes('肉包') || lower.includes('菜包')) return 'baozi';
  if (lower.includes('面包') || lower.includes('吐司') || lower.includes('全麦面包')) return 'bread';
  if (lower.includes('馄饨') || lower.includes('云吞') || lower.includes('抄手')) return 'wonton';
  if (lower.includes('玉米')) return 'corn';
  if (lower.includes('红薯') || lower.includes('地瓜')) return 'sweetPotato';
  if (lower.includes('土豆') || lower.includes('马铃薯')) return 'potato';
  if (lower.includes('粥') || lower.includes('白粥') || lower.includes('小米粥') || lower.includes('燕麦粥')) return 'porridge';
  if (lower.includes('鸡蛋') || lower.includes('鹌鹑蛋') || lower.includes('蛋') || lower.includes('煎蛋') || lower.includes('水煮蛋') || lower.includes('蒸蛋') || lower.includes('茶叶蛋')) return 'egg';
  if (lower.includes('牛奶') || lower.includes('纯牛奶') || lower.includes('低脂牛奶')) return 'milk';
  if (lower.includes('酸奶')) return 'yogurt';
  if (lower.includes('豆腐')) return 'tofu';
  if (lower.includes('鸡胸肉') || lower.includes('鸡胸') || lower.includes('鸡腿') || lower.includes('鸡翅') || lower.includes('鸡排') || lower.includes('炸鸡')) return 'chickenBreast';
  if (lower.includes('牛肉') || lower.includes('牛排') || lower.includes('牛腩') || lower.includes('牛腱') || lower.includes('肥牛')) return 'beef';
  if (lower.includes('猪肉') || lower.includes('五花肉') || lower.includes('猪里脊') || lower.includes('红烧肉') || lower.includes('回锅肉') || lower.includes('肉片') || lower.includes('炒肉')) return 'pork';
  if (lower.includes('鱼') || lower.includes('草鱼') || lower.includes('鲤鱼') || lower.includes('酸菜鱼') || lower.includes('水煮鱼') || lower.includes('清蒸鱼')) return 'fish';
  if (lower.includes('虾') || lower.includes('虾仁') || lower.includes('虾滑')) return 'shrimp';
  if (lower.includes('西兰花')) return 'broccoli';
  if (lower.includes('西红柿') || lower.includes('番茄') || lower.includes('番茄炒蛋')) return 'tomato';
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
  if (lower.includes('咖啡') || lower.includes('拿铁') || lower.includes('美式') || lower.includes('卡布奇诺') || lower.includes('摩卡') || lower.includes('生椰拿铁')) return 'coffee';
  if (lower.includes('奶茶') || lower.includes('波霸') || lower.includes('珍珠奶茶') || lower.includes('水果茶') || lower.includes('柠檬茶') || lower.includes('果茶')) return 'milkTea';
  if (lower.includes('可乐') || lower.includes('雪碧') || lower.includes('芬达')) return 'cola';
  if (lower.includes('冰淇淋') || lower.includes('雪糕')) return 'icecream';
  if (lower.includes('蛋糕') || lower.includes('芝士蛋糕') || lower.includes('慕斯')) return 'cake';
  if (lower.includes('巧克力')) return 'chocolate';
  if (lower.includes('披萨')) return 'pizza';
  if (lower.includes('汉堡') || lower.includes('巨无霸') || lower.includes('板烧') || lower.includes('麦辣') || lower.includes('香辣鸡腿')) return 'burger';
  if (lower.includes('薯条') || lower.includes('薯格')) return 'fries';
  if (lower.includes('寿司')) return 'sushi';
  if (lower.includes('汤') || lower.includes('羹')) return 'soup';
  if (lower.includes('沙拉')) return 'salad';
  if (lower.includes('果汁')) return 'juice';
  if (lower.includes('茶') || lower.includes('绿茶') || lower.includes('红茶') || lower.includes('白茶') || lower.includes('乌龙茶') || lower.includes('茉莉花茶')) return 'tea';
  if (lower.includes('蜂蜜')) return 'honey';
  if (lower.includes('饼干') || lower.includes('曲奇')) return 'cookie';
  if (lower.includes('爆米花')) return 'popcorn';
  if (lower.includes('薯片')) return 'chips';
  if (lower.includes('蔬菜') || lower.includes('白菜') || lower.includes('菠菜') || lower.includes('生菜') || lower.includes('青菜') || lower.includes('炒青菜') || lower.includes('空心菜') || lower.includes('韭菜') || lower.includes('芹菜') || lower.includes('茄子') || lower.includes('豆角') || lower.includes('豆芽')) return 'vegetable';
  if (lower.includes('坚果') || lower.includes('杏仁') || lower.includes('腰果') || lower.includes('瓜子') || lower.includes('松子') || lower.includes('开心果')) return 'nut';
  if (lower.includes('饮料') || lower.includes('柠檬水') || lower.includes('苏打水')) return 'drink';
  if (lower.includes('炒饭') || lower.includes('炒面') || lower.includes('炒粉') || lower.includes('炒河粉') || lower.includes('盖浇饭') || lower.includes('盖饭')) return 'rice';
  if (lower.includes('拌面') || lower.includes('热干面') || lower.includes('凉面')) return 'noodles';
  if (lower.includes('锅贴') || lower.includes('煎包') || lower.includes('生煎')) return 'baozi';
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

const getCalorieColor = (calorie: number | undefined): string => {
  if (!calorie || calorie < 50) return '#52C41A';
  if (calorie < 150) return '#FAAD14';
  if (calorie < 300) return '#FA8C16';
  return '#FF4D4F';
};

export default function AddFoodModal({ isOpen, onClose, defaultMealType }: AddFoodModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<Map<string, { food: Food; portion: number }>>(new Map());
  const [mealType, setMealType] = useState('lunch');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addFoodRecord } = useCalorieStore();
  const listRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isOpen && defaultMealType) {
      setMealType(defaultMealType);
    }
    if (!isOpen) {
      setSelectedFoods(new Map());
      setSearchTerm('');
      setActiveCategory('all');
    }
  }, [isOpen, defaultMealType]);

  const foods = searchTerm
    ? searchFood(searchTerm)
    : activeCategory === 'all'
    ? FOOD_DATABASE
    : getFoodsByCategory(activeCategory);

  const getFoodsByCat = (catKey: string) => {
    if (catKey === 'all') return FOOD_DATABASE;
    return getFoodsByCategory(catKey);
  };

  const toggleFood = (food: Food) => {
    const newMap = new Map(selectedFoods);
    if (newMap.has(food.id)) {
      newMap.delete(food.id);
    } else {
      newMap.set(food.id, { food, portion: 100 });
    }
    setSelectedFoods(newMap);
  };

  const updatePortion = (foodId: string, newPortion: number) => {
    const newMap = new Map(selectedFoods);
    const item = newMap.get(foodId);
    if (item) {
      newMap.set(foodId, { ...item, portion: newPortion });
    }
    setSelectedFoods(newMap);
  };

  const handleAdd = () => {
    if (selectedFoods.size === 0) {
      messageApi.warning('请先选择食物');
      return;
    }
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let totalCalories = 0;
    selectedFoods.forEach(({ food, portion }) => {
      const calorie = Math.round(((food.calorie || 0) * portion) / 100);
      const macro = food.protein !== undefined
        ? {
            protein: Math.round((food.protein * portion) / 100),
            fat: Math.round(((food.fat || 0) * portion) / 100),
            carbs: Math.round(((food.carbs || 0) * portion) / 100),
          }
        : undefined;

      addFoodRecord({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        date: now.toISOString().split('T')[0],
        name: food.name,
        calorie,
        time: timeStr,
        mealType: mealType as any,
        macro,
        timestamp: now.getTime(),
      });
      totalCalories += calorie;
    });

    messageApi.success(`已添加 ${selectedFoods.size} 种食物，共 ${totalCalories} 千卡`);
    setSelectedFoods(new Map());
    setSearchTerm('');
    onClose();
  };

  const scrollToCategory = (catKey: string) => {
    setActiveCategory(catKey);
    
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(() => {
      if (catKey === 'all') {
        listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = categoryRefs.current[catKey];
      if (el && listRef.current) {
        const container = listRef.current;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offsetTop = elRect.top - containerRect.top + container.scrollTop;
        container.scrollTo({
          top: offsetTop - 10, // 10px padding
          behavior: 'smooth'
        });
      }
    });
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveCategory('all');
  };

  const totalCalories = Array.from(selectedFoods.values()).reduce((sum, { food, portion }) => {
    return sum + Math.round(((food.calorie || 0) * portion) / 100);
  }, 0);

  const renderFoodItem = (food: Food) => {
    if (!food || !food.name) return null;
    const isSelected = selectedFoods.has(food.id);
    const itemData = selectedFoods.get(food.id);
    const currentPortion = itemData?.portion || 100;
    const iconKey = getFoodIconKey(food.name, food.category);
    const iconSvg = FoodIcons[iconKey as keyof typeof FoodIcons] || FoodIcons.rice;
    const isLowCal = (food.calorie || 0) <= 100;
    const calorie = food.calorie || 0;
    const unit = food.unit || '100g';

    return (
      <div
        key={food.id}
        onClick={() => toggleFood(food)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
          border: isSelected ? '1px solid #1677FF' : '1px solid #F0F0F0',
          backgroundColor: isSelected ? '#E6F4FF' : '#FFF',
          transition: 'all 0.2s',
          marginBottom: '6px',
        }}
      >
        <Avatar
          shape="square"
          size={40}
          style={{
            background: '#F5F7FA',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            flexShrink: 0,
          }}
        >
          {iconSvg}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
            {isLowCal && <Tag color="green" style={{ fontSize: '10px', margin: 0, lineHeight: '16px', padding: '0 4px' }}>低Gi</Tag>}
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>{food.name}</span>
          </div>
          <span style={{ fontSize: '12px', color: getCalorieColor(calorie) }}>
            {calorie} 千卡/{unit}
          </span>
          {isSelected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={currentPortion}
                onChange={(e) => {
                  e.stopPropagation();
                  updatePortion(food.id, Number(e.target.value));
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '100px', height: '4px' }}
              />
              <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{currentPortion}g</span>
              <Tag color="blue" style={{ fontSize: '11px', margin: 0 }}>
                {Math.round((calorie * currentPortion) / 100)} 千卡
              </Tag>
            </div>
          )}
        </div>
        <Button
          type={isSelected ? 'primary' : 'text'}
          shape="circle"
          size="small"
          icon={isSelected ? <CheckOutlined /> : <PlusCircleOutlined />}
          style={{ padding: 0, flexShrink: 0 }}
          onClick={(e) => { e.stopPropagation(); toggleFood(food); }}
        />
      </div>
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '0', height: '100%', display: 'flex', flexDirection: 'column' } }}
        width="100%"
        style={{ margin: 0, top: 0, maxWidth: '100%' }}
      >
        {/* Header */}
        <div style={{ background: '#FFF', padding: '16px 20px', borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onClose}
              size="large"
              style={{ padding: '4px 8px' }}
            />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#333', flex: 1 }}>添加食物</h2>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="搜索食物名称..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setActiveCategory('all'); }}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: '1px solid #E8E8E8', borderRadius: '24px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                background: '#FAFAFA',
              }}
            />
            <SearchOutlined style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: '#999', fontSize: '14px',
            }} />
          </div>

          {/* Meal Type */}
          <Space size={8} style={{ marginBottom: '12px' }} wrap>
            {MEAL_TYPES.map((t) => (
              <Button
                key={t.key}
                type={mealType === t.key ? 'primary' : 'default'}
                size="small"
                style={{ borderRadius: '16px' }}
                onClick={() => setMealType(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </Space>

          {/* Add Button */}
          <Button
            type="primary"
            block
            onClick={handleAdd}
            disabled={selectedFoods.size === 0}
            size="large"
            style={{ borderRadius: '24px', height: '44px', fontSize: '15px', marginBottom: '8px' }}
          >
            确认添加{selectedFoods.size > 0 ? `（${selectedFoods.size} 种 · ${totalCalories} 千卡）` : ''}
          </Button>

          {/* Link to Recognition Page */}
          <Button
            type="default"
            block
            icon={<CameraOutlined />}
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'recognition' } }));
            }}
            style={{ borderRadius: '24px', height: '36px', fontSize: '13px' }}
          >
            去 AI 拍照识食物
          </Button>
        </div>

        {/* Content: Left Nav + Right List */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Category Nav */}
          <div style={{
            width: '80px',
            background: '#F7F8FA',
            overflowY: 'auto',
            flexShrink: 0,
            borderRight: '1px solid #F0F0F0',
          }}>
            <div
              onClick={scrollToTop}
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#999',
                cursor: 'pointer',
                borderBottom: '1px solid #F0F0F0',
              }}
            >
              <ArrowUpOutlined /> 顶部
            </div>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <div
                  key={cat.key}
                  onClick={() => scrollToCategory(cat.key)}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: isActive ? '#1677FF' : '#999',
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? '#FFF' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: isActive ? '3px solid #1677FF' : '3px solid transparent',
                  }}
                >
                  {cat.label}
                </div>
              );
            })}
          </div>

          {/* Right Food List */}
          <div
            ref={listRef}
            style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}
          >
            {searchTerm ? (
              foods.length > 0 ? (
                foods.slice(0, 50).map(food => renderFoodItem(food))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                  <p style={{ fontSize: '14px' }}>未找到相关食物</p>
                </div>
              )
            ) : (
              activeCategory === 'all'
                ? CATEGORIES.map((cat) => {
                    const catFoods = getFoodsByCat(cat.key);
                    if (catFoods.length === 0) return null;
                    return (
                      <div
                        key={cat.key}
                        ref={(el) => { categoryRefs.current[cat.key] = el; }}
                        style={{ marginBottom: '16px' }}
                      >
                        <div style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#333',
                          marginBottom: '8px',
                          paddingLeft: '4px',
                          borderLeft: '3px solid #52C41A',
                        }}>
                          {cat.label} <span style={{ fontSize: '12px', fontWeight: 400, color: '#999' }}>({catFoods.length})</span>
                        </div>
                        {catFoods.map(food => renderFoodItem(food))}
                      </div>
                    );
                  })
                : (
                  <div
                    ref={(el) => { categoryRefs.current[activeCategory] = el; }}
                  >
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#333',
                      marginBottom: '8px',
                      paddingLeft: '4px',
                      borderLeft: '3px solid #52C41A',
                    }}>
                      {CATEGORIES.find(c => c.key === activeCategory)?.label} <span style={{ fontSize: '12px', fontWeight: 400, color: '#999' }}>({foods.length})</span>
                    </div>
                    {foods.map(food => renderFoodItem(food))}
                  </div>
                )
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
