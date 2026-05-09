import { useState } from 'react';
import { FOOD_DATABASE, Food, FOOD_CATEGORIES } from '../utils/foodDatabase';
import FoodIcons from '../components/FoodIcons';
import { Input, Space, Typography, Card, Tag, Button, List, Avatar } from 'antd';
import { SearchOutlined, FireOutlined, ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Map food name to icon key
function getFoodIconKey(name: string): string {
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
  // Fallback to rice for main foods, vegetable for others
  return 'rice';
}

export default function FoodDatabasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const filteredFoods = FOOD_DATABASE.filter((food) => {
    const matchesSearch = food.name.includes(searchTerm) || 
                          food.category?.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || 
                            food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)',
        padding: '48px 20px 24px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: '#FFF', fontSize: '18px' }} />
          <Title level={4} style={{ margin: 0, color: '#FFF' }}>食物数据库</Title>
          <Button type="text" icon={<PlusCircleOutlined />} style={{ color: '#FFF', fontSize: '18px' }} />
        </Space>

        <Input
          placeholder="海量食物库搜索"
          prefix={<SearchOutlined style={{ color: '#A0D468' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            borderRadius: '24px',
            height: '44px',
            fontSize: '14px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
          }}
        />
      </div>

      {/* Category Tags */}
      <div style={{ padding: '12px 20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Space wrap size={8}>
          {['全部', ...FOOD_CATEGORIES].map((category) => (
            <Button
              key={category}
              size="small"
              type={selectedCategory === category ? 'primary' : 'default'}
              style={{
                borderRadius: '16px',
                padding: '4px 12px',
                fontWeight: selectedCategory === category ? 600 : 400,
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </Space>
      </div>

      {/* Food List */}
      <div style={{ padding: '0 20px 32px' }}>
        {filteredFoods.length === 0 ? (
          <Card style={{ borderRadius: '8px', textAlign: 'center', padding: '32px 0' }}>
            <Text type="secondary">没有找到匹配的食物</Text>
          </Card>
        ) : (
          <List
            dataSource={filteredFoods}
            renderItem={(food) => {
              const iconKey = getFoodIconKey(food.name);
              const iconSvg = FoodIcons[iconKey as keyof typeof FoodIcons] || FoodIcons.rice;
              const isLowCal = food.calorie <= 100;

              return (
                <Card
                  style={{
                    borderRadius: '12px',
                    marginBottom: '8px',
                    background: '#FFF',
                    border: '1px solid #F0F0F0',
                  }}
                  styles={{ body: { padding: '12px 16px' } }}
                >
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    {/* Left: Icon + Name */}
                    <Space>
                      <Avatar
                        shape="square"
                        size={48}
                        style={{
                          background: '#F5F7FA',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {iconSvg}
                      </Avatar>
                      <div>
                        <Space size={4}>
                          {isLowCal && (
                            <Tag color="green" style={{ fontSize: '10px', margin: 0 }}>低Gi</Tag>
                          )}
                          <Text strong style={{ fontSize: '14px' }}>{food.name}</Text>
                        </Space>
                        <Text style={{ color: '#8BC34A', fontSize: '12px' }}>
                          {food.calorie} 千卡/{food.unit}
                        </Text>
                      </div>
                    </Space>

                    {/* Right: Add Button */}
                    <Button
                      type="text"
                      shape="circle"
                      icon={<PlusCircleOutlined style={{ fontSize: '20px', color: '#C8E6C9' }} />}
                      style={{ padding: 0 }}
                    />
                  </Space>
                </Card>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
