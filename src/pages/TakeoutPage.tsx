import { useState, useEffect, useRef, useMemo } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import {
  RECIPES,
  getRecipesByCategoryAndMeal,
  getRecipesByTarget,
  searchRecipes,
  Recipe,
} from '../utils/recipeData';
import { generateRecipeRecommendations, AIRecipeRecommendation, UserProfile } from '../utils/aiSuggestion';
import { Card, Tabs, Tag, Space, Button, Modal, Descriptions, Typography, Input, Empty, Spin, Divider, Calendar, Badge, Segmented, DatePicker, App } from 'antd';
import type { BadgeProps } from 'antd';
import {
  RobotOutlined,
  FireOutlined,
  BulbOutlined,
  CloseOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  StarOutlined,
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface SavedDayPlan {
  date: string;
  recipes: Recipe[];
}

export default function TakeoutPage() {
  const { message } = App.useApp();
  const {
    userSettings,
    allFoodRecords,
    getTodayTotalCalories,
    getTodayExerciseCalories,
    getTodayMacros,
    addFoodRecord,
  } = useCalorieStore();

  const [selectedCategory, setSelectedCategory] = useState<'chinese' | 'light'>('chinese');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<AIRecipeRecommendation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [customMealPlan, setCustomMealPlan] = useState<Recipe[]>([]);
  const [selectedPlanDate, setSelectedPlanDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [pendingAddRecipe, setPendingAddRecipe] = useState<Recipe | null>(null);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState<Dayjs>(dayjs());
  const [savedPlans, setSavedPlans] = useState<SavedDayPlan[]>(() => {
    try {
      const data = localStorage.getItem('saved_meal_plans');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [viewMode, setViewMode] = useState<'plan' | 'calendar'>('plan');

  // Refs to avoid stale closure in Modal onOk
  const pendingAddRecipeRef = useRef<Recipe | null>(null);
  const selectedDateForAddRef = useRef<Dayjs>(dayjs());
  const savedPlansRef = useRef(savedPlans);
  const selectedPlanDateRef = useRef(selectedPlanDate);
  const customMealPlanRef = useRef(customMealPlan);
  pendingAddRecipeRef.current = pendingAddRecipe;
  selectedDateForAddRef.current = selectedDateForAdd;
  savedPlansRef.current = savedPlans;
  selectedPlanDateRef.current = selectedPlanDate;
  customMealPlanRef.current = customMealPlan;

  // 清理超过7天的旧餐单
  useEffect(() => {
    const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.date >= sevenDaysAgo);
      if (filtered.length !== prev.length) {
        localStorage.setItem('saved_meal_plans', JSON.stringify(filtered));
      }
      return filtered;
    });
  }, []);

  // 保存餐单到 localStorage
  useEffect(() => {
    localStorage.setItem('saved_meal_plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const todayRecords = allFoodRecords.filter(
    (r) => r.date === new Date().toISOString().split('T')[0]
  );
  const totalCal = getTodayTotalCalories();
  const exerciseCal = getTodayExerciseCalories();
  const todayMacros = getTodayMacros();

  const userTarget: 'fat' | 'muscle' | 'keep' = userSettings.target || 'fat';
  const weight = userSettings.weight || 55;
  const activityLevel = userSettings.activityLevel || 1.2;
  const bmr = weight * 22;
  const tdee = bmr * activityLevel;
  let targetCal = Math.round(tdee);
  if (userTarget === 'fat') targetCal = Math.round(tdee - 400);
  else if (userTarget === 'muscle') targetCal = Math.round(tdee + 300);
  const remaining = Math.max(0, targetCal - totalCal + exerciseCal);

  const filteredRecipes = useMemo(() => {
    if (searchTerm.trim()) {
      return searchRecipes(searchTerm);
    }
    return getRecipesByCategoryAndMeal(selectedCategory, selectedMealType);
  }, [selectedCategory, selectedMealType, searchTerm]);

  const targetRecipes = useMemo(() => {
    return getRecipesByTarget(userTarget);
  }, [userTarget]);

  // Load saved plan for selected date
  const todayStr = dayjs().format('YYYY-MM-DD');
  useEffect(() => {
    const selectedPlan = savedPlans.find((p) => p.date === selectedPlanDate);
    if (selectedPlan) {
      setCustomMealPlan(selectedPlan.recipes);
    } else {
      setCustomMealPlan([]);
    }
  }, [showMealPlan, selectedPlanDate]);

  // AI推荐 - 只在有新记录时更新
  const hasEvaluatedRef = useRef(false);
  const prevRecordCountRef = useRef(todayRecords.length);

  useEffect(() => {
    if (todayRecords.length > prevRecordCountRef.current) {
      hasEvaluatedRef.current = false;
      prevRecordCountRef.current = todayRecords.length;
    }
  }, [todayRecords.length]);

  const loadAiRecommendations = async () => {
    if (hasEvaluatedRef.current) return;
    if (todayRecords.length === 0) return;

    setAiLoading(true);
    try {
      const profile: UserProfile = {
        target: userTarget,
        targetCal,
        currentCal: totalCal,
        todayExerciseCal: exerciseCal,
        weight,
        height: userSettings.height,
        age: userSettings.age,
        gender: userSettings.gender,
      };

      const result = await generateRecipeRecommendations(todayRecords, profile, RECIPES);
      setAiRecommendations(result);
      hasEvaluatedRef.current = true;
    } catch (error) {
      // 静默失败，不影响主流程
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    loadAiRecommendations();
  }, [todayRecords.length]);

  const getTargetLabel = () => {
    const labels: Record<string, string> = { fat: '减脂', keep: '维持', muscle: '增肌' };
    return labels[userTarget] || '推荐';
  };

  const handleAddToMealPlan = (recipe: Recipe) => {
    setPendingAddRecipe(recipe);
    setShowDateSelector(true);
  };

  const handleConfirmAddToMealPlan = () => {
    if (!pendingAddRecipeRef.current || !selectedDateForAddRef.current) {
      return;
    }
    
    const recipe = pendingAddRecipeRef.current;
    const dateStr = selectedDateForAddRef.current.format('YYYY-MM-DD');
    const dayPlan = savedPlansRef.current.find((p) => p.date === dateStr);
    const existingRecipes = dayPlan ? dayPlan.recipes : [];
    
    if (existingRecipes.find((r) => r.id === recipe.id)) {
      message.info('该菜谱已在所选日期的餐单中');
      return;
    }

    const newRecipes = [...existingRecipes, recipe];
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.date !== dateStr);
      return [...filtered, { date: dateStr, recipes: newRecipes }];
    });
    
    if (dateStr === selectedPlanDateRef.current) {
      setCustomMealPlan(newRecipes);
    }
    
    message.success(`已添加到 ${dateStr} 的餐单`);
    setShowDateSelector(false);
    setPendingAddRecipe(null);
    setSelectedDateForAdd(dayjs());
  };

  const handleRemoveFromMealPlan = (recipeId: string) => {
    const dayPlan = savedPlans.find((p) => p.date === selectedPlanDate);
    if (!dayPlan) return;
    
    const newRecipes = dayPlan.recipes.filter((r) => r.id !== recipeId);
    handleSaveDayPlan(selectedPlanDate, newRecipes);
    setCustomMealPlan(newRecipes);
  };

  const handleSaveMealPlan = () => {
    handleSaveDayPlan(selectedPlanDate, customMealPlan);
    message.success(`已保存 ${selectedPlanDate} 的餐单`);
  };

  const handleSaveDayPlan = (date: string, recipes: Recipe[]) => {
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.date !== date);
      return [...filtered, { date, recipes }];
    });
  };

  const handleDeleteDayPlan = (date: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.date !== date));
  };

  const handleAddToRecords = (recipe: Recipe) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const mealTypeMap: Record<string, 'breakfast' | 'lunch' | 'dinner'> = {
      breakfast: 'breakfast',
      lunch: 'lunch',
      dinner: 'dinner',
    };

    addFoodRecord({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      date: now.toISOString().split('T')[0],
      name: recipe.name,
      calorie: recipe.calorie,
      time: timeStr,
      mealType: mealTypeMap[recipe.mealType] || 'lunch',
      macro: {
        protein: recipe.protein,
        fat: recipe.fat,
        carbs: recipe.carbs,
      },
      timestamp: now.getTime(),
    });
  };

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const plan = savedPlans.find((p) => p.date === dateStr);
    if (plan && plan.recipes.length > 0) {
      const totalCal = plan.recipes.reduce((sum, r) => sum + r.calorie, 0);
      return [{ type: 'success', content: `${plan.recipes.length}道菜 ${totalCal}千卡` }];
    }
    return [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} style={{ fontSize: '10px' }} />
          </li>
        ))}
      </ul>
    );
  };

  const renderCalendarView = () => {
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    const selectedPlan = savedPlans.find((p) => p.date === selectedDateStr);

    return (
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0, color: '#333' }}>餐单日历</Title>
          <Button type="text" icon={<CloseOutlined />} onClick={() => setShowMealPlan(false)} />
        </div>

        <Segmented
          options={[
            { label: '月视图', value: 'month' },
            { label: '周视图', value: 'week' },
          ]}
          defaultValue="month"
          style={{ marginBottom: '16px' }}
          onChange={(val) => {
            if (val === 'week') {
              setSelectedDate(dayjs().startOf('week'));
            }
          }}
        />

        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          cellRender={dateCellRender}
          fullscreen={false}
        />

        {selectedPlan && selectedPlan.recipes.length > 0 ? (
          <div style={{ marginTop: '16px' }}>
            <Divider>{selectedDate.format('YYYY-MM-DD')} 的餐单</Divider>
            <Card style={{ borderRadius: '8px', marginBottom: '12px', background: '#FFF7E6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <Text strong style={{ fontSize: '18px', color: '#FA8C16' }}>
                    {selectedPlan.recipes.reduce((s, r) => s + r.calorie, 0)}
                  </Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>千卡</Text>
                </div>
                <div>
                  <Text strong style={{ fontSize: '18px', color: '#1677FF' }}>
                    {selectedPlan.recipes.reduce((s, r) => s + r.protein, 0)}g
                  </Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>蛋白质</Text>
                </div>
                <div>
                  <Text strong style={{ fontSize: '18px', color: '#FAAD14' }}>
                    {selectedPlan.recipes.reduce((s, r) => s + r.fat, 0)}g
                  </Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>脂肪</Text>
                </div>
              </div>
            </Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedPlan.recipes.map((recipe) => (
                <div key={recipe.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{recipe.name}</Text>
                      <Tag style={{ fontSize: '10px' }}>{recipe.category === 'chinese' ? '中餐' : '轻食'}</Tag>
                      <Tag style={{ fontSize: '10px' }}>
                        {recipe.mealType === 'breakfast' ? '早餐' : recipe.mealType === 'lunch' ? '午餐' : '晚餐'}
                      </Tag>
                    </div>
                    <Text style={{ fontSize: '12px', color: '#666' }}>{recipe.calorie}千卡 | 蛋白质{recipe.protein}g 脂肪{recipe.fat}g 碳水{recipe.carbs}g</Text>
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddToRecords(recipe)}
                  >
                    添加到记录
                  </Button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteDayPlan(selectedDateStr)}
                style={{ flex: 1 }}
              >
                删除该日餐单
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedPlanDate(selectedDateStr);
                  setViewMode('plan');
                }}
                style={{ flex: 1 }}
              >
                编辑餐单
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '16px', textAlign: 'center', padding: '24px 0' }}>
            <Empty description={`${selectedDate.format('YYYY-MM-DD')} 暂无餐单`} />
          </div>
        )}
      </div>
    );
  };

  const renderCustomMealPlan = () => {
    const totalPlanCal = customMealPlan.reduce((sum, r) => sum + r.calorie, 0);
    const totalPlanProtein = customMealPlan.reduce((sum, r) => sum + r.protein, 0);
    const totalPlanFat = customMealPlan.reduce((sum, r) => sum + r.fat, 0);
    const totalPlanCarbs = customMealPlan.reduce((sum, r) => sum + r.carbs, 0);

    return (
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0, color: '#333' }}>定制餐单</Title>
          <Space>
            <Button
              type="default"
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => setViewMode('calendar')}
            >
              查看日历
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={handleSaveMealPlan}
              disabled={customMealPlan.length === 0}
            >
              保存餐单
            </Button>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setShowMealPlan(false)}
            />
          </Space>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text style={{ color: '#666' }}>选择日期：</Text>
          <DatePicker
            value={dayjs(selectedPlanDate)}
            onChange={(date) => {
              if (date) {
                const dateStr = date.format('YYYY-MM-DD');
                setSelectedPlanDate(dateStr);
              }
            }}
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              return current && (current.isBefore(dayjs().subtract(7, 'day'), 'day') || current.isAfter(dayjs().add(7, 'day'), 'day'));
            }}
          />
        </div>

        {customMealPlan.length === 0 ? (
          <Card style={{ borderRadius: '8px', textAlign: 'center', padding: '48px 0' }}>
            <Empty description={`${selectedPlanDate} 餐单为空`} />
            <Text style={{ color: '#999', fontSize: '12px' }}>浏览菜谱，点击"加入餐单"开始定制</Text>
          </Card>
        ) : (
          <>
            <Card style={{ borderRadius: '8px', marginBottom: '16px', background: '#FFF7E6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <Text strong style={{ fontSize: '20px', color: '#FA8C16' }}>{totalPlanCal}</Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>总热量(千卡)</Text>
                </div>
                <div>
                  <Text strong style={{ fontSize: '20px', color: '#1677FF' }}>{totalPlanProtein}g</Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>蛋白质</Text>
                </div>
                <div>
                  <Text strong style={{ fontSize: '20px', color: '#FAAD14' }}>{totalPlanFat}g</Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>脂肪</Text>
                </div>
                <div>
                  <Text strong style={{ fontSize: '20px', color: '#52C41A' }}>{totalPlanCarbs}g</Text>
                  <Text style={{ display: 'block', fontSize: '11px', color: '#666' }}>碳水</Text>
                </div>
              </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {customMealPlan.map((recipe) => (
                <div key={recipe.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{recipe.name}</Text>
                      <Tag style={{ fontSize: '10px' }}>
                        {recipe.category === 'chinese' ? '中餐' : '轻食'}
                      </Tag>
                      <Tag style={{ fontSize: '10px' }}>
                        {recipe.mealType === 'breakfast' ? '早餐' : recipe.mealType === 'lunch' ? '午餐' : '晚餐'}
                      </Tag>
                    </div>
                    <Text style={{ fontSize: '12px', color: '#666' }}>{recipe.calorie}千卡 | 蛋白质{recipe.protein}g 脂肪{recipe.fat}g 碳水{recipe.carbs}g</Text>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFromMealPlan(recipe.id)}
                  >
                    移除
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderRecipeCard = (recipe: Recipe, showAddButton: boolean = true) => {
    const dayPlan = savedPlans.find((p) => p.date === selectedPlanDate);
    const planRecipes = dayPlan ? dayPlan.recipes : [];
    const isInPlan = planRecipes.some((r) => r.id === recipe.id);

    return (
      <Card
        key={recipe.id}
        hoverable
        style={{ borderRadius: '8px' }}
        onClick={() => setSelectedRecipe(recipe)}
      >
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: '15px' }}>{recipe.name}</Text>
            <Tag color={recipe.category === 'chinese' ? 'orange' : 'blue'} style={{ fontSize: '10px' }}>
              {recipe.category === 'chinese' ? '中餐' : '轻食'}
            </Tag>
          </Space>
          <Text style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
            {recipe.description}
          </Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={8}>
              <Tag style={{ fontSize: '10px' }}>
                {recipe.mealType === 'breakfast' ? '早餐' : recipe.mealType === 'lunch' ? '午餐' : '晚餐'}
              </Tag>
              <Tag style={{ fontSize: '10px' }}>
                <ClockCircleOutlined /> {recipe.cookTime}分钟
              </Tag>
              <Tag style={{ fontSize: '10px' }}>
                <FireOutlined /> {recipe.calorie}千卡
              </Tag>
            </Space>
            {showAddButton && (
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToMealPlan(recipe);
                }}
                style={{ background: '#FA8C16', borderColor: '#FA8C16' }}
              >
                加入餐单
              </Button>
            )}
          </div>
        </Space>
      </Card>
    );
  };

  if (showMealPlan) {
    if (viewMode === 'calendar') {
      return renderCalendarView();
    }
    return renderCustomMealPlan();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <div style={{ padding: '16px 20px', background: '#FFF', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0, color: '#333' }}>推荐菜谱</Title>
          <Space>
            <Button
              type="default"
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => { setViewMode('calendar'); setShowMealPlan(true); }}
            >
              餐单日历
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<StarOutlined />}
              onClick={() => { setViewMode('plan'); setShowMealPlan(true); }}
              style={{ background: '#FA8C16', borderColor: '#FA8C16' }}
            >
              定制餐单
            </Button>
          </Space>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <Tag color="orange" style={{ fontSize: '12px' }}>
            <FireOutlined /> 目标 {targetCal} 千卡
          </Tag>
          <Tag color="blue" style={{ fontSize: '12px' }}>
            已摄入 {totalCal} 千卡
          </Tag>
          <Tag color="green" style={{ fontSize: '12px' }}>
            剩余 {remaining} 千卡
          </Tag>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Tabs
            activeKey={selectedCategory}
            onChange={(key) => setSelectedCategory(key as 'chinese' | 'light')}
            size="small"
            items={[
              { key: 'chinese', label: '中餐' },
              { key: 'light', label: '轻食' },
            ]}
          />
          <Tabs
            activeKey={selectedMealType}
            onChange={(key) => setSelectedMealType(key as 'breakfast' | 'lunch' | 'dinner')}
            size="small"
            type="card"
            items={[
              { key: 'breakfast', label: '早餐' },
              { key: 'lunch', label: '午餐' },
              { key: 'dinner', label: '晚餐' },
            ]}
          />
        </div>

        <Input
          placeholder="搜索菜谱..."
          prefix={<SearchOutlined style={{ color: '#CCC' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{
            marginBottom: '16px',
            borderRadius: '24px',
            background: '#FFF',
            border: '1px solid #E0E0E0',
          }}
        />

        {aiRecommendations && aiRecommendations.recipes.length > 0 && (
          <Card
            style={{
              borderRadius: '8px',
              background: '#F6FFED',
              border: '1px solid #B7EB8F',
              marginBottom: '16px',
            }}
          >
            <Space orientation="vertical" size={8} style={{ width: '100%' }}>
              <Space>
                <RobotOutlined style={{ fontSize: '18px', color: '#52C41A' }} />
                <Text strong>AI 智能推荐</Text>
              </Space>
              <Text style={{ fontSize: '13px', color: '#389E0D', lineHeight: '1.6' }}>
                {aiRecommendations.analysis}
              </Text>
              <Space size={8} wrap>
                {aiRecommendations.recipes.slice(0, 3).map((recipe) => (
                  <Tag
                    key={recipe.id}
                    color="green"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const found = RECIPES.find((r) => r.id === recipe.id);
                      if (found) setSelectedRecipe(found);
                    }}
                  >
                    {recipe.name}
                  </Tag>
                ))}
              </Space>
            </Space>
          </Card>
        )}

        {aiLoading && (
          <Card style={{ borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
            <Spin size="small" />
            <Text style={{ marginLeft: '8px', color: '#666', fontSize: '12px' }}>AI 分析中...</Text>
          </Card>
        )}

        {filteredRecipes.length === 0 ? (
          <Card style={{ borderRadius: '8px', textAlign: 'center', padding: '48px 0' }}>
            <Empty description="暂无相关菜谱" />
          </Card>
        ) : (
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            {filteredRecipes.map((recipe) => renderRecipeCard(recipe, true))}
          </Space>
        )}

        {!searchTerm && targetRecipes.length > 0 && (
          <>
            <Divider>
              <Space>
                <BulbOutlined style={{ color: '#FAAD14' }} />
                <Text style={{ color: '#666', fontSize: '12px' }}>适合你的{getTargetLabel()}菜谱</Text>
              </Space>
            </Divider>
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              {targetRecipes.slice(0, 3).map((recipe) => renderRecipeCard(recipe, true))}
            </Space>
          </>
        )}
      </div>

      <Modal
        open={!!selectedRecipe}
        onCancel={() => setSelectedRecipe(null)}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '0' } }}
      >
        {selectedRecipe && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #FFF7E6 0%, #FFE7BA 100%)',
              padding: '24px 20px',
            }}>
              <Title level={3} style={{ margin: 0, color: '#333' }}>{selectedRecipe.name}</Title>
              <Paragraph style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
                {selectedRecipe.description}
              </Paragraph>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <Tag color="orange">{selectedRecipe.calorie} 千卡</Tag>
                <Tag>{selectedRecipe.category === 'chinese' ? '中餐' : '轻食'}</Tag>
                <Tag>
                  {selectedRecipe.mealType === 'breakfast' ? '早餐' : selectedRecipe.mealType === 'lunch' ? '午餐' : '晚餐'}
                </Tag>
                <Tag>
                  <ClockCircleOutlined /> {selectedRecipe.cookTime}分钟
                </Tag>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="营养成分">
                  <Space size={16}>
                    <span>蛋白质 <Text strong>{selectedRecipe.protein}g</Text></span>
                    <span>脂肪 <Text strong>{selectedRecipe.fat}g</Text></span>
                    <span>碳水 <Text strong>{selectedRecipe.carbs}g</Text></span>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="制作方法">
                  <div style={{
                    background: '#FFF7E6',
                    padding: '12px',
                    borderRadius: '8px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-line',
                    fontSize: '13px',
                  }}>
                    {selectedRecipe.method}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              <Button
                type="primary"
                block
                size="large"
                icon={<PlusOutlined />}
                onClick={() => { handleAddToMealPlan(selectedRecipe); setSelectedRecipe(null); }}
                style={{ marginTop: '16px', borderRadius: '12px' }}
              >
                加入定制餐单
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="选择日期"
        open={showDateSelector}
        onCancel={() => { setShowDateSelector(false); setPendingAddRecipe(null); setSelectedDateForAdd(dayjs()); }}
        okText="确认添加"
        cancelText="取消"
        okButtonProps={{ style: { background: '#FA8C16', borderColor: '#FA8C16' } }}
        onOk={() => {
          const recipe = pendingAddRecipeRef.current;
          const selectedDate = selectedDateForAddRef.current;
          if (!recipe || !selectedDate) return;
          const dateStr = selectedDate.format('YYYY-MM-DD');
          const dayPlan = savedPlansRef.current.find((p) => p.date === dateStr);
          const existingRecipes = dayPlan ? dayPlan.recipes : [];
          if (existingRecipes.find((r) => r.id === recipe.id)) {
            message.info('该菜谱已在所选日期的餐单中');
            return;
          }
          const newRecipes = [...existingRecipes, recipe];
          setSavedPlans((prev) => {
            const filtered = prev.filter((p) => p.date !== dateStr);
            return [...filtered, { date: dateStr, recipes: newRecipes }];
          });
          if (dateStr === selectedPlanDateRef.current) {
            setCustomMealPlan(newRecipes);
          }
          message.success(`已添加到 ${dateStr} 的餐单`);
          setShowDateSelector(false);
          setPendingAddRecipe(null);
          setSelectedDateForAdd(dayjs());
        }}
        closeIcon={<CloseOutlined />}
        afterClose={() => {
          setSelectedDateForAdd(dayjs());
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Text style={{ marginBottom: '16px', display: 'block', color: '#666' }}>
            {pendingAddRecipe && `将 "${pendingAddRecipe.name}" 添加到哪天的餐单？`}
          </Text>
          <DatePicker
            value={selectedDateForAdd}
            onChange={(date) => {
              if (date) {
                setSelectedDateForAdd(date);
              }
            }}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            disabledDate={(current) => {
              return current && (current.isBefore(dayjs().subtract(7, 'day'), 'day') || current.isAfter(dayjs().add(7, 'day'), 'day'));
            }}
          />
          <Text style={{ marginTop: '8px', display: 'block', fontSize: '12px', color: '#999' }}>
            可选择前后7天内的日期，选择后点击确认添加
          </Text>
        </div>
      </Modal>
    </div>
  );
}
