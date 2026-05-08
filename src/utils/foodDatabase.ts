export interface Food {
  id: string;
  name: string;
  calorie: number;
  unit: string;
  category: string;
}

export const FOOD_DATABASE: Food[] = [
  { id: '1', name: '米饭', calorie: 116, unit: '100g', category: '主食' },
  { id: '2', name: '面条', calorie: 284, unit: '100g', category: '主食' },
  { id: '3', name: '馒头', calorie: 223, unit: '100g', category: '主食' },
  { id: '4', name: '面包', calorie: 265, unit: '100g', category: '主食' },
  { id: '5', name: '饺子', calorie: 242, unit: '100g', category: '主食' },
  { id: '6', name: '白粥', calorie: 46, unit: '100g', category: '主食' },
  { id: '7', name: '鸡胸肉', calorie: 133, unit: '100g', category: '肉蛋' },
  { id: '8', name: '鸡腿', calorie: 181, unit: '100g', category: '肉蛋' },
  { id: '9', name: '猪肉', calorie: 143, unit: '100g', category: '肉蛋' },
  { id: '10', name: '牛肉', calorie: 125, unit: '100g', category: '肉蛋' },
  { id: '11', name: '鱼肉', calorie: 90, unit: '100g', category: '肉蛋' },
  { id: '12', name: '虾', calorie: 93, unit: '100g', category: '肉蛋' },
  { id: '13', name: '鸡蛋', calorie: 144, unit: '100g', category: '肉蛋' },
  { id: '14', name: '豆腐', calorie: 81, unit: '100g', category: '肉蛋' },
  { id: '15', name: '西兰花', calorie: 27, unit: '100g', category: '蔬菜' },
  { id: '16', name: '菠菜', calorie: 20, unit: '100g', category: '蔬菜' },
  { id: '17', name: '白菜', calorie: 17, unit: '100g', category: '蔬菜' },
  { id: '18', name: '西红柿', calorie: 15, unit: '100g', category: '蔬菜' },
  { id: '19', name: '黄瓜', calorie: 15, unit: '100g', category: '蔬菜' },
  { id: '20', name: '苹果', calorie: 52, unit: '100g', category: '水果' },
  { id: '21', name: '香蕉', calorie: 93, unit: '100g', category: '水果' },
  { id: '22', name: '橙子', calorie: 47, unit: '100g', category: '水果' },
  { id: '23', name: '葡萄', calorie: 67, unit: '100g', category: '水果' },
  { id: '24', name: '西瓜', calorie: 30, unit: '100g', category: '水果' },
  { id: '25', name: '牛奶', calorie: 54, unit: '100g', category: '奶制品' },
  { id: '26', name: '酸奶', calorie: 72, unit: '100g', category: '奶制品' },
  { id: '27', name: '奶酪', calorie: 328, unit: '100g', category: '奶制品' },
  { id: '28', name: '薯片', calorie: 548, unit: '100g', category: '零食' },
  { id: '29', name: '巧克力', calorie: 546, unit: '100g', category: '零食' },
  { id: '30', name: '冰淇淋', calorie: 207, unit: '100g', category: '零食' },
];

export const FOOD_CATEGORIES = ['主食', '肉蛋', '蔬菜', '水果', '奶制品', '零食'];

export const searchFood = (keyword: string): Food[] => {
  if (!keyword.trim()) return [];
  const lowerKeyword = keyword.toLowerCase();
  return FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowerKeyword)
  );
};
