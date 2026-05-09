import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import {
  getCombosByTarget,
  getSmartRecipes,
  getRecipesByCategory,
  getLowCalorieMenuItems,
  getRecommendedRestaurants,
  RESTAURANTS,
  RESTAURANT_MENUS,
  LOW_CAL_RECIPES,
  Combo,
  SmartRecipe,
  LowCalRecipe,
  Restaurant,
  MenuItem,
} from '../utils/takeoutRecommend';
import { Card, Tabs, Tag, Space, Button, Modal, Descriptions, Typography, Progress, Empty } from 'antd';
import {
  RobotOutlined,
  ShopOutlined,
  FireOutlined,
  LineChartOutlined,
  BulbOutlined,
  CloseOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const RECIPE_CATEGORIES = [
  { key: 'all', label: '全部', icon: <LineChartOutlined /> },
  { key: '蛋白质', label: '蛋白质', icon: <ThunderboltOutlined /> },
  { key: '主食', label: '主食', icon: <CoffeeOutlined /> },
  { key: '蔬菜', label: '蔬菜', icon: <BulbOutlined /> },
  { key: '汤品', label: '汤品', icon: <FireOutlined /> },
  { key: '早餐', label: '早餐', icon: <StarOutlined /> },
  { key: '加餐', label: '加餐', icon: <ShopOutlined /> },
];

export default function TakeoutPage() {
  const { userSettings, todayRecords, getTodayTotalCalories, addFoodRecord } = useCalorieStore();

  const getTargetCalorie = () => {
    const weight = userSettings.weight || 55;
    const activityLevel = userSettings.activityLevel || 1.2;
    const bmr = weight * 22;
    const tdee = bmr * activityLevel;
    if (userSettings.target === 'fat') return Math.round(tdee - 400);
    if (userSettings.target === 'muscle') return Math.round(tdee + 300);
    return Math.round(tdee);
  };

  const targetCal = getTargetCalorie();
  const totalCal = getTodayTotalCalories();
  const remaining = targetCal - totalCal;
  const userTarget: 'fat' | 'muscle' | 'keep' = userSettings.target || 'fat';

  const [selectedRecipe, setSelectedRecipe] = useState<SmartRecipe | LowCalRecipe | MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState('smart');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showComboDetail, setShowComboDetail] = useState(false);

  const muscleCombos = getCombosByTarget('muscle');
  const fatCombos = getCombosByTarget('fat');
  const smartRecipes = getSmartRecipes(remaining, userTarget);
  const filteredRecipes = activeCategory === 'all' ? smartRecipes : getRecipesByCategory(activeCategory, userTarget);
  const lowCalItems = LOW_CAL_RECIPES;
  const restaurants = getRecommendedRestaurants(remaining, 'distance');

  const handleAddRecipe = (recipe: SmartRecipe | LowCalRecipe | MenuItem, extraCal?: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const calorie = extraCal !== undefined ? extraCal : recipe.calorie;

    addFoodRecord({
      name: recipe.name,
      calorie,
      time: timeStr,
      mealType: 'lunch',
      macro: recipe.protein !== undefined
        ? { protein: recipe.protein, fat: recipe.fat || 0, carbs: recipe.carbs || 0 }
        : undefined,
      timestamp: now.getTime(),
    });
    setSelectedRecipe(null);
    setShowComboDetail(false);
  };

  const level = remaining < 200 ? 'snack' : remaining < 400 ? 'light' : remaining < 600 ? 'regular' : 'heavy';
  const levelLabels: Record<string, { label: string; color: string }> = {
    snack: { label: '加餐小食', color: '#FAAD14' },
    light: { label: '轻食简餐', color: '#52C41A' },
    regular: { label: '营养正餐', color: '#1677FF' },
    heavy: { label: '丰盛大餐', color: '#FF4D4F' },
  };

  const tabList = [
    { key: 'smart', label: '智能推荐', icon: <RobotOutlined /> },
    { key: 'combos', label: '推荐套餐', icon: <FireOutlined /> },
    { key: 'restaurants', label: '附近餐厅', icon: <ShopOutlined /> },
    { key: 'lowcal', label: '低卡精选', icon: <BulbOutlined /> },
  ];

  const caloriePercent = Math.min(Math.round((totalCal / targetCal) * 100), 100);

  const renderSmartRecipes = () => (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={5} style={{ margin: 0 }}>智能推荐菜谱</Title>
        <Text style={{ color: '#666', fontSize: '12px' }}>{filteredRecipes.length} 道</Text>
      </div>

      <Space wrap size={8}>
        {RECIPE_CATEGORIES.map((cat) => (
          <Button
            key={cat.key}
            type={activeCategory === cat.key ? 'primary' : 'default'}
            size="small"
            icon={cat.icon}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </Space>

      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            hoverable
            styles={{ body: { padding: '16px' } }}
            onClick={() => setSelectedRecipe(recipe)}
            style={{ borderRadius: '8px' }}
          >
            <Space align="start" style={{ width: '100%' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#F0F5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}>
                {recipe.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text strong style={{ fontSize: '14px' }}>{recipe.name}</Text>
                  <Text type="warning" strong>{recipe.calorie}千卡</Text>
                </div>
                <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  {recipe.description}
                </Text>
                <Space size={4} wrap>
                  <Tag color="blue">蛋{recipe.protein}g</Tag>
                  <Tag color="gold">脂{recipe.fat}g</Tag>
                  <Tag color="green">碳{recipe.carbs}g</Tag>
                </Space>
              </div>
            </Space>
          </Card>
        ))
      ) : (
        <Card style={{ borderRadius: '8px', textAlign: 'center', padding: '32px 0' }}>
          <Empty description="当前热量额度暂无推荐" />
          <Text style={{ color: '#666', fontSize: '12px' }}>建议适当运动消耗多余热量</Text>
        </Card>
      )}
    </Space>
  );

  const renderCombos = () => (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      {muscleCombos.length > 0 && (
        <div>
          <Title level={5} style={{ marginBottom: '16px' }}>
            <ThunderboltOutlined style={{ marginRight: '8px' }} />增肌套餐
          </Title>
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            {muscleCombos.map((combo) => (
              <Card
                key={combo.id}
                hoverable
                styles={{ body: { padding: '16px' } }}
                onClick={() => { setSelectedCombo(combo); setShowComboDetail(true); }}
                style={{ borderRadius: '8px', background: '#FFF7E6', borderColor: '#FFE7BA' }}
              >
                <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <span style={{ fontSize: '24px' }}>{combo.emoji}</span>
                      <Text strong style={{ color: '#D46B08' }}>{combo.name}</Text>
                    </Space>
                    <Tag color="orange">增肌</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#FA8C16' }}>{combo.totalCalorie}千卡</Title>
                    <Text style={{ color: '#666' }}>¥{combo.totalPrice}</Text>
                  </div>
                  <Space size={4} wrap>
                    {combo.tags.map((tag) => (
                      <Tag key={tag} color="orange" style={{ fontSize: '10px' }}>{tag}</Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            ))}
          </Space>
        </div>
      )}

      {fatCombos.length > 0 && (
        <div>
          <Title level={5} style={{ marginBottom: '16px' }}>
            <BulbOutlined style={{ marginRight: '8px' }} />减脂套餐
          </Title>
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            {fatCombos.map((combo) => (
              <Card
                key={combo.id}
                hoverable
                styles={{ body: { padding: '16px' } }}
                onClick={() => { setSelectedCombo(combo); setShowComboDetail(true); }}
                style={{ borderRadius: '8px', background: '#F6FFED', borderColor: '#B7EB8F' }}
              >
                <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <span style={{ fontSize: '24px' }}>{combo.emoji}</span>
                      <Text strong style={{ color: '#389E0D' }}>{combo.name}</Text>
                    </Space>
                    <Tag color="green">减脂</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#52C41A' }}>{combo.totalCalorie}千卡</Title>
                    <Text style={{ color: '#666' }}>¥{combo.totalPrice}</Text>
                  </div>
                  <Space size={4} wrap>
                    {combo.tags.map((tag) => (
                      <Tag key={tag} color="green" style={{ fontSize: '10px' }}>{tag}</Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            ))}
          </Space>
        </div>
      )}
    </Space>
  );

  const renderRestaurants = () => (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={5} style={{ margin: 0 }}>附近餐厅</Title>
        <Text style={{ color: '#666', fontSize: '12px' }}>按距离排序</Text>
      </div>

      {restaurants.map((restaurant) => (
        <Card
          key={restaurant.id}
          hoverable
          styles={{ body: { padding: '16px' } }}
          onClick={() => setSelectedRestaurant(restaurant)}
          style={{ borderRadius: '8px' }}
        >
          <Space align="start" style={{ width: '100%' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#FFF7E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0,
            }}>
              {restaurant.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>{restaurant.name}</Text>
              <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                <EnvironmentOutlined style={{ marginRight: '4px' }} />{restaurant.address}
              </Text>
              <Space size={8}>
                <Tag color="orange"><StarOutlined /> {restaurant.rating}</Tag>
                <Tag color="blue">{restaurant.distance}km</Tag>
                <Tag color="green"><ClockCircleOutlined /> {restaurant.deliveryTime}</Tag>
              </Space>
            </div>
          </Space>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F0F0F0' }}>
            <Space size={4} wrap>
              {restaurant.tags.map((tag) => (
                <Tag key={tag} style={{ fontSize: '10px' }}>{tag}</Tag>
              ))}
            </Space>
          </div>
        </Card>
      ))}
    </Space>
  );

  const renderLowCal = () => (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={5} style={{ margin: 0 }}>低卡精选</Title>
        <Text style={{ color: '#666', fontSize: '12px' }}>{lowCalItems.length} 道</Text>
      </div>

      {lowCalItems.map((item) => (
        <Card
          key={item.id}
          hoverable
          styles={{ body: { padding: '16px' } }}
          onClick={() => setSelectedRecipe(item)}
          style={{ borderRadius: '8px' }}
        >
          <Space align="start" style={{ width: '100%' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#F6FFED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
            }}>
              {item.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <Text strong style={{ fontSize: '14px' }}>{item.name}</Text>
                <Text type="success" strong>{item.calorie}千卡</Text>
              </div>
              <Tag color="green" style={{ marginBottom: '8px' }}>{item.category}</Tag>
              <Space size={4} wrap>
                <Tag color="blue">蛋{item.protein}g</Tag>
                <Tag color="gold">脂{item.fat}g</Tag>
                <Tag color="green">碳{item.carbs}g</Tag>
              </Space>
            </div>
          </Space>
        </Card>
      ))}
    </Space>
  );

  const tabContentMap: Record<string, () => JSX.Element> = {
    smart: renderSmartRecipes,
    combos: renderCombos,
    restaurants: renderRestaurants,
    lowcal: renderLowCal,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0958D9 0%, #1677FF 100%)',
        padding: '48px 20px 32px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0, color: '#FFF' }}>推荐菜谱</Title>
          <Tag color="white" style={{ fontSize: '12px', padding: '4px 12px' }}>
            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
          </Tag>
        </div>

        <Card style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', backdropFilter: 'blur(10px)' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <div>
              <Text style={{ color: '#FFF', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                今日剩余可摄入
              </Text>
              <Title level={2} style={{ margin: 0, color: '#FFF' }}>
                {remaining} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>千卡</span>
              </Title>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Progress
                type="circle"
                percent={caloriePercent}
                size={64}
                strokeColor="#52C41A"
                format={() => <Text style={{ fontSize: '14px', color: '#FFF' }}>{caloriePercent}%</Text>}
              />
              <Text style={{ color: '#FFF', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {levelLabels[level].label}
              </Text>
            </div>
          </Space>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: '12px 20px', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(10px)', zIndex: 10, borderBottom: '1px solid #F0F0F0' }}>
        <Space wrap size={8}>
          {tabList.map((tab) => (
            <Button
              key={tab.key}
              type={activeTab === tab.key ? 'primary' : 'default'}
              size="small"
              icon={tab.icon}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 32px' }}>
        {tabContentMap[activeTab]?.()}
      </div>

      {/* Recipe Detail Modal */}
      <Modal
        open={!!selectedRecipe && !showComboDetail}
        onCancel={() => setSelectedRecipe(null)}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '16px' } }}
      >
        {selectedRecipe && (
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>{selectedRecipe.name}</Title>

            <Card style={{ borderRadius: '8px', background: '#F6FFED', border: 'none' }}>
              <Title level={3} style={{ margin: 0, color: '#52C41A' }}>
                {selectedRecipe.calorie} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>千卡</span>
              </Title>
              {'description' in selectedRecipe && (
                <Text style={{ color: '#666', fontSize: '12px' }}>{selectedRecipe.description}</Text>
              )}
              {'category' in selectedRecipe && typeof selectedRecipe.category === 'string' && (
                <Tag color="green" style={{ marginTop: '8px' }}>{selectedRecipe.category}</Tag>
              )}
            </Card>

            {selectedRecipe.protein !== undefined && (
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>营养成分</Text>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Card style={{ flex: 1, borderRadius: '8px', background: '#F0F5FF', textAlign: 'center', border: 'none' }}>
                      <Title level={4} style={{ margin: 0, color: '#1677FF' }}>{selectedRecipe.protein}g</Title>
                      <Text style={{ color: '#666', fontSize: '12px' }}>蛋白质</Text>
                    </Card>
                    <Card style={{ flex: 1, borderRadius: '8px', background: '#FFFBE6', textAlign: 'center', border: 'none' }}>
                      <Title level={4} style={{ margin: 0, color: '#FAAD14' }}>{selectedRecipe.fat || 0}g</Title>
                      <Text style={{ color: '#666', fontSize: '12px' }}>脂肪</Text>
                    </Card>
                    <Card style={{ flex: 1, borderRadius: '8px', background: '#F6FFED', textAlign: 'center', border: 'none' }}>
                      <Title level={4} style={{ margin: 0, color: '#52C41A' }}>{selectedRecipe.carbs || 0}g</Title>
                      <Text style={{ color: '#666', fontSize: '12px' }}>碳水</Text>
                    </Card>
                </Space>
              </div>
            )}

            {'method' in selectedRecipe && selectedRecipe.method && (
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>制作方法</Text>
                <Card style={{ borderRadius: '8px', background: '#FFF7E6', border: 'none' }}>
                  <Paragraph style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: 0 }}>
                    {selectedRecipe.method}
                  </Paragraph>
                </Card>
              </div>
            )}

            <Card style={{ borderRadius: '8px', background: '#FFF7E6', border: 'none' }}>
              <Text style={{ color: '#D46B08', fontSize: '12px' }}>
                <BulbOutlined /> 提示：添加后将从剩余热量中扣除 {selectedRecipe.calorie} 千卡
              </Text>
            </Card>

            <Button type="primary" block size="large" icon={<CheckOutlined />} onClick={() => handleAddRecipe(selectedRecipe)}>
              添加到今日记录
            </Button>
          </Space>
        )}
      </Modal>

      {/* Combo Detail Modal */}
      <Modal
        open={showComboDetail && !!selectedCombo}
        onCancel={() => setShowComboDetail(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '16px' } }}
      >
        {selectedCombo && (
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>
              <span style={{ marginRight: '8px' }}>{selectedCombo.emoji}</span>
              {selectedCombo.name}
            </Title>

            <Card
              style={{
                borderRadius: '8px',
                background: selectedCombo.target === 'muscle' ? '#FFF7E6' : '#F6FFED',
                border: 'none',
              }}
            >
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={3} style={{ margin: 0, color: selectedCombo.target === 'muscle' ? '#FA8C16' : '#52C41A' }}>
                  {selectedCombo.totalCalorie} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>千卡</span>
                </Title>
                <Tag color={selectedCombo.target === 'muscle' ? 'orange' : 'green'} style={{ fontSize: '14px' }}>
                  ¥{selectedCombo.totalPrice.toFixed(1)}
                </Tag>
              </Space>
            </Card>

            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>套餐内容</Text>
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                {selectedCombo.items.map((itemId, index) => {
                  const allMenus = Object.values(RESTAURANT_MENUS).flat();
                  const menuItem = allMenus.find((m) => m.id === itemId);
                  return (
                    <Card key={index} style={{ borderRadius: '8px', background: '#FAFAFA', border: 'none' }}>
                      <Space style={{ width: '100%' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#666',
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text style={{ fontSize: '14px', display: 'block' }}>{menuItem?.name || itemId}</Text>
                          <Text style={{ color: '#666', fontSize: '12px' }}>{menuItem?.calorie || 0}千卡</Text>
                        </div>
                      </Space>
                    </Card>
                  );
                })}
              </Space>
            </div>

            <Space size={8} wrap>
              {selectedCombo.tags.map((tag) => (
                <Tag key={tag} color={selectedCombo.target === 'muscle' ? 'orange' : 'green'}>{tag}</Tag>
              ))}
            </Space>

            <Button
              type="primary"
              block
              size="large"
              style={{
                background: selectedCombo.target === 'muscle' ? 'linear-gradient(90deg, #FA8C16, #FAAD14)' : undefined,
              }}
              onClick={() => {
                selectedCombo.items.forEach((itemId) => {
                  const allMenus = Object.values(RESTAURANT_MENUS).flat();
                  const item = allMenus.find((m) => m.id === itemId);
                  if (item) handleAddRecipe(item);
                });
              }}
            >
              一键添加全部菜品
            </Button>
          </Space>
        )}
      </Modal>

      {/* Restaurant Detail Modal */}
      <Modal
        open={!!selectedRestaurant}
        onCancel={() => setSelectedRestaurant(null)}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '16px' } }}
      >
        {selectedRestaurant && (
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>{selectedRestaurant.name}</Title>

            <Card style={{ borderRadius: '8px', background: '#FFF7E6', border: 'none' }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Space>
                  <span style={{ fontSize: '32px' }}>{selectedRestaurant.emoji}</span>
                  <div>
                    <Text strong style={{ fontSize: '14px', display: 'block' }}>{selectedRestaurant.name}</Text>
                    <Text style={{ color: '#666', fontSize: '12px' }}>
                      <EnvironmentOutlined style={{ marginRight: '4px' }} />{selectedRestaurant.address}
                    </Text>
                  </div>
                </Space>
                <Space size={8}>
                  <Tag color="orange"><StarOutlined /> {selectedRestaurant.rating}</Tag>
                  <Tag color="blue"><EnvironmentOutlined /> {selectedRestaurant.distance}km</Tag>
                  <Tag color="green"><ClockCircleOutlined /> {selectedRestaurant.deliveryTime}</Tag>
                </Space>
              </Space>
            </Card>

            <div>
              <Text strong style={{ display: 'block', marginBottom: '12px' }}>推荐菜品</Text>
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                {(RESTAURANT_MENUS[selectedRestaurant.id] || []).map((item) => (
                  <Card
                    key={item.id}
                    hoverable
                    styles={{ body: { padding: '12px' } }}
                    onClick={() => { setSelectedRecipe(item); setSelectedRestaurant(null); }}
                    style={{ borderRadius: '8px', background: '#FAFAFA', border: 'none' }}
                  >
                    <Space style={{ width: '100%' }}>
                      <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <Text style={{ fontSize: '14px', display: 'block' }}>{item.name}</Text>
                        <Text style={{ color: '#666', fontSize: '12px' }}>{item.category}</Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text type="warning" strong style={{ fontSize: '14px', display: 'block' }}>{item.calorie}千卡</Text>
                        <Text style={{ color: '#666', fontSize: '12px' }}>¥{item.price}</Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}
