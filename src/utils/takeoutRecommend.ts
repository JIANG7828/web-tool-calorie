export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  tags: string[];
  image: string;
  address: string;
  distance: number;
  emoji: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  calorie: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  image: string;
  category: string;
  description?: string;
  emoji: string;
}

export interface Combo {
  id: string;
  name: string;
  items: string[];
  totalPrice: number;
  totalCalorie: number;
  originalPrice: number;
  tags: string[];
  target: 'fat' | 'muscle' | 'keep';
  emoji: string;
}

export interface SmartRecipe {
  id: string;
  name: string;
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
  description: string;
  method: string;
  category: string;
  emoji: string;
  suitableTarget: ('fat' | 'muscle' | 'keep')[];
}

export interface LowCalRecipe {
  id: string;
  name: string;
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
  method: string;
  emoji: string;
  category: string;
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: '轻食沙拉屋',
    rating: 4.8,
    deliveryTime: '25-35分钟',
    deliveryFee: 3,
    minOrder: 20,
    tags: ['轻食', '健康', '低卡'],
    image: '',
    address: '朝阳区建国路88号',
    distance: 0.5,
    emoji: '🥗',
  },
  {
    id: 'r2',
    name: '元气便当',
    rating: 4.6,
    deliveryTime: '20-30分钟',
    deliveryFee: 5,
    minOrder: 25,
    tags: ['便当', '减脂餐', '营养均衡'],
    image: '',
    address: '朝阳区望京SOHO',
    distance: 0.8,
    emoji: '🍱',
  },
  {
    id: 'r3',
    name: '粤港茶餐厅',
    rating: 4.5,
    deliveryTime: '30-45分钟',
    deliveryFee: 6,
    minOrder: 30,
    tags: ['粤菜', '茶餐厅', '点心'],
    image: '',
    address: '东城区王府井大街',
    distance: 1.2,
    emoji: '🥟',
  },
  {
    id: 'r4',
    name: '和风寿司',
    rating: 4.7,
    deliveryTime: '25-35分钟',
    deliveryFee: 4,
    minOrder: 35,
    tags: ['寿司', '日料', '低卡'],
    image: '',
    address: '海淀区中关村大街',
    distance: 1.5,
    emoji: '🍣',
  },
  {
    id: 'r5',
    name: '西北牛肉面',
    rating: 4.4,
    deliveryTime: '15-25分钟',
    deliveryFee: 3,
    minOrder: 15,
    tags: ['面食', '清真', '实惠'],
    image: '',
    address: '西城区西单北大街',
    distance: 2.0,
    emoji: '🍜',
  },
  {
    id: 'r6',
    name: '湘米乐',
    rating: 4.6,
    deliveryTime: '25-35分钟',
    deliveryFee: 4,
    minOrder: 20,
    tags: ['湘菜', '家常菜', '米饭'],
    image: '',
    address: '丰台区方庄',
    distance: 2.5,
    emoji: '🌶️',
  },
  {
    id: 'r7',
    name: '鲜榨果汁吧',
    rating: 4.9,
    deliveryTime: '15-25分钟',
    deliveryFee: 2,
    minOrder: 18,
    tags: ['饮品', '果汁', '健康'],
    image: '',
    address: '朝阳区三里屯',
    distance: 0.6,
    emoji: '🧃',
  },
  {
    id: 'r8',
    name: '地中海餐厅',
    rating: 4.8,
    deliveryTime: '30-45分钟',
    deliveryFee: 8,
    minOrder: 50,
    tags: ['西餐', '健康', '地中海'],
    image: '',
    address: '朝阳区国贸中心',
    distance: 0.3,
    emoji: '🫒',
  },
  {
    id: 'r9',
    name: '健身餐工坊',
    rating: 4.9,
    deliveryTime: '20-30分钟',
    deliveryFee: 3,
    minOrder: 25,
    tags: ['健身餐', '高蛋白', '增肌'],
    image: '',
    address: '朝阳区工体北路',
    distance: 0.4,
    emoji: '💪',
  },
  {
    id: 'r10',
    name: '素食主义',
    rating: 4.7,
    deliveryTime: '25-35分钟',
    deliveryFee: 4,
    minOrder: 20,
    tags: ['素食', '有机', '低卡'],
    image: '',
    address: '海淀区五道口',
    distance: 1.8,
    emoji: '🥬',
  },
];

export const RESTAURANT_MENUS: Record<string, MenuItem[]> = {
  'r1': [
    { id: 'm1-1', name: '凯撒沙拉', price: 32, calorie: 280, protein: 18, fat: 18, carbs: 8, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm1-2', name: '鸡胸肉沙拉', price: 38, calorie: 320, protein: 32, fat: 12, carbs: 10, image: '', category: '沙拉', emoji: '🐔' },
    { id: 'm1-3', name: '三文鱼沙拉', price: 45, calorie: 380, protein: 28, fat: 22, carbs: 8, image: '', category: '沙拉', emoji: '🐟' },
    { id: 'm1-4', name: '牛油果沙拉', price: 36, calorie: 350, protein: 12, fat: 28, carbs: 15, image: '', category: '沙拉', emoji: '🥑' },
    { id: 'm1-5', name: '烤蔬菜沙拉', price: 28, calorie: 220, protein: 6, fat: 12, carbs: 20, image: '', category: '沙拉', emoji: '🥦' },
    { id: 'm1-6', name: '全麦三明治', price: 26, calorie: 310, protein: 18, fat: 12, carbs: 32, image: '', category: '主食', emoji: '🥪' },
    { id: 'm1-7', name: '藜麦碗', price: 42, calorie: 380, protein: 20, fat: 14, carbs: 42, image: '', category: '主食', emoji: '🥣' },
    { id: 'm1-8', name: '无糖酸奶杯', price: 18, calorie: 120, protein: 8, fat: 3, carbs: 12, image: '', category: '甜点', emoji: '🫐' },
  ],
  'r2': [
    { id: 'm2-1', name: '减脂鸡腿饭', price: 28, calorie: 420, protein: 28, fat: 12, carbs: 48, image: '', category: '便当', emoji: '🍗' },
    { id: 'm2-2', name: '清蒸鱼便当', price: 32, calorie: 380, protein: 30, fat: 8, carbs: 45, image: '', category: '便当', emoji: '🐟' },
    { id: 'm2-3', name: '牛肉蔬菜饭', price: 35, calorie: 450, protein: 26, fat: 15, carbs: 52, image: '', category: '便当', emoji: '🥩' },
    { id: 'm2-4', name: '豆腐蔬菜便当', price: 22, calorie: 320, protein: 18, fat: 8, carbs: 42, image: '', category: '便当', emoji: '' },
    { id: 'm2-5', name: '杂粮鸡胸饭', price: 30, calorie: 400, protein: 25, fat: 10, carbs: 45, image: '', category: '便当', emoji: '🍚' },
    { id: 'm2-6', name: '凉拌鸡丝面', price: 26, calorie: 360, protein: 22, fat: 8, carbs: 52, image: '', category: '面食', emoji: '🍝' },
    { id: 'm2-7', name: '番茄鸡蛋汤', price: 8, calorie: 60, protein: 4, fat: 2, carbs: 8, image: '', category: '汤品', emoji: '🍅' },
    { id: 'm2-8', name: '苹果', price: 6, calorie: 52, protein: 0.3, fat: 0.2, carbs: 13.5, image: '', category: '水果', emoji: '🍎' },
  ],
  'r3': [
    { id: 'm3-1', name: '白灼菜心', price: 18, calorie: 80, protein: 4, fat: 3, carbs: 10, image: '', category: '时蔬', emoji: '🥬' },
    { id: 'm3-2', name: '清蒸排骨', price: 38, calorie: 280, protein: 25, fat: 18, carbs: 5, image: '', category: '肉类', emoji: '🍖' },
    { id: 'm3-3', name: '蒜蓉西兰花', price: 22, calorie: 100, protein: 5, fat: 5, carbs: 12, image: '', category: '时蔬', emoji: '🥦' },
    { id: 'm3-4', name: '蚝油生菜', price: 16, calorie: 90, protein: 4, fat: 4, carbs: 10, image: '', category: '时蔬', emoji: '🥬' },
    { id: 'm3-5', name: '虾饺', price: 28, calorie: 320, protein: 12, fat: 10, carbs: 38, image: '', category: '点心', emoji: '🦐' },
    { id: 'm3-6', name: '叉烧饭', price: 32, calorie: 420, protein: 20, fat: 15, carbs: 50, image: '', category: '主食', emoji: '🍖' },
    { id: 'm3-7', name: '皮蛋瘦肉粥', price: 20, calorie: 180, protein: 10, fat: 4, carbs: 28, image: '', category: '粥品', emoji: '🥣' },
    { id: 'm3-8', name: '干炒牛河', price: 30, calorie: 400, protein: 15, fat: 18, carbs: 45, image: '', category: '主食', emoji: '🍜' },
  ],
  'r4': [
    { id: 'm4-1', name: '三文鱼寿司', price: 38, calorie: 280, protein: 18, fat: 12, carbs: 22, image: '', category: '寿司', emoji: '🍣' },
    { id: 'm4-2', name: '金枪鱼寿司', price: 35, calorie: 260, protein: 22, fat: 8, carbs: 20, image: '', category: '寿司', emoji: '🐟' },
    { id: 'm4-3', name: '鳗鱼饭', price: 48, calorie: 450, protein: 25, fat: 18, carbs: 42, image: '', category: '主食', emoji: '🍱' },
    { id: 'm4-4', name: '刺身拼盘', price: 88, calorie: 320, protein: 35, fat: 15, carbs: 5, image: '', category: '刺身', emoji: '' },
    { id: 'm4-5', name: '味增汤', price: 12, calorie: 60, protein: 4, fat: 2, carbs: 6, image: '', category: '汤品', emoji: '🥣' },
    { id: 'm4-6', name: '乌冬面', price: 32, calorie: 380, protein: 12, fat: 6, carbs: 68, image: '', category: '面食', emoji: '🍜' },
    { id: 'm4-7', name: '天妇罗', price: 42, calorie: 380, protein: 15, fat: 25, carbs: 20, image: '', category: '炸物', emoji: '🍤' },
    { id: 'm4-8', name: '玉子烧', price: 18, calorie: 180, protein: 10, fat: 10, carbs: 12, image: '', category: '蛋类', emoji: '🥚' },
  ],
  'r5': [
    { id: 'm5-1', name: '清汤牛肉面', price: 26, calorie: 420, protein: 22, fat: 15, carbs: 50, image: '', category: '面食', emoji: '🍜' },
    { id: 'm5-2', name: '红烧牛肉面', price: 28, calorie: 480, protein: 20, fat: 20, carbs: 52, image: '', category: '面食', emoji: '🍜' },
    { id: 'm5-3', name: '葱油拌面', price: 18, calorie: 360, protein: 8, fat: 12, carbs: 55, image: '', category: '面食', emoji: '🍝' },
    { id: 'm5-4', name: '牛肉炒饭', price: 22, calorie: 400, protein: 15, fat: 12, carbs: 55, image: '', category: '主食', emoji: '🍚' },
    { id: 'm5-5', name: '凉拌牛肉', price: 32, calorie: 280, protein: 28, fat: 15, carbs: 5, image: '', category: '凉菜', emoji: '🥩' },
    { id: 'm5-6', name: '酸辣土豆丝', price: 12, calorie: 100, protein: 2, fat: 4, carbs: 16, image: '', category: '凉菜', emoji: '🥔' },
    { id: 'm5-7', name: '酸梅汤', price: 8, calorie: 80, protein: 0, fat: 0, carbs: 20, image: '', category: '饮品', emoji: '🥤' },
    { id: 'm5-8', name: '卤蛋', price: 3, calorie: 80, protein: 6, fat: 5, carbs: 1, image: '', category: '配菜', emoji: '🥚' },
  ],
  'r6': [
    { id: 'm6-1', name: '辣椒炒肉', price: 28, calorie: 280, protein: 18, fat: 18, carbs: 8, image: '', category: '湘菜', emoji: '🌶️' },
    { id: 'm6-2', name: '剁椒鱼头', price: 58, calorie: 420, protein: 35, fat: 18, carbs: 15, image: '', category: '湘菜', emoji: '🐟' },
    { id: 'm6-3', name: '小炒黄牛肉', price: 42, calorie: 320, protein: 28, fat: 15, carbs: 8, image: '', category: '湘菜', emoji: '🥩' },
    { id: 'm6-4', name: '酸豆角肉末', price: 22, calorie: 200, protein: 12, fat: 12, carbs: 10, image: '', category: '湘菜', emoji: '🫘' },
    { id: 'm6-5', name: '农家一碗香', price: 32, calorie: 350, protein: 20, fat: 20, carbs: 15, image: '', category: '湘菜', emoji: '🥘' },
    { id: 'm6-6', name: '米饭', price: 3, calorie: 116, protein: 2.7, fat: 0.3, carbs: 25.6, image: '', category: '主食', emoji: '🍚' },
    { id: 'm6-7', name: '冬瓜排骨汤', price: 28, calorie: 180, protein: 12, fat: 10, carbs: 8, image: '', category: '汤品', emoji: '🥣' },
    { id: 'm6-8', name: '蒜蓉空心菜', price: 16, calorie: 80, protein: 3, fat: 4, carbs: 10, image: '', category: '时蔬', emoji: '🥬' },
  ],
  'r7': [
    { id: 'm7-1', name: '鲜榨橙汁', price: 22, calorie: 120, protein: 2, fat: 0.5, carbs: 28, image: '', category: '果汁', emoji: '🍊' },
    { id: 'm7-2', name: '苹果汁', price: 20, calorie: 100, protein: 0.5, fat: 0.3, carbs: 25, image: '', category: '果汁', emoji: '🍎' },
    { id: 'm7-3', name: '草莓奶昔', price: 28, calorie: 220, protein: 6, fat: 8, carbs: 30, image: '', category: '奶昔', emoji: '🍓' },
    { id: 'm7-4', name: '芒果冰沙', price: 26, calorie: 180, protein: 1, fat: 0.5, carbs: 45, image: '', category: '冰沙', emoji: '🥭' },
    { id: 'm7-5', name: '香蕉奶昔', price: 24, calorie: 200, protein: 5, fat: 6, carbs: 32, image: '', category: '奶昔', emoji: '🍌' },
    { id: 'm7-6', name: '柠檬水', price: 12, calorie: 30, protein: 0.3, fat: 0.1, carbs: 8, image: '', category: '饮品', emoji: '🍋' },
    { id: 'm7-7', name: '西瓜汁', price: 18, calorie: 80, protein: 1, fat: 0.2, carbs: 18, image: '', category: '果汁', emoji: '🍉' },
    { id: 'm7-8', name: '牛油果奶昔', price: 32, calorie: 280, protein: 6, fat: 18, carbs: 18, image: '', category: '奶昔', emoji: '🥑' },
  ],
  'r8': [
    { id: 'm8-1', name: '希腊沙拉', price: 42, calorie: 280, protein: 12, fat: 20, carbs: 8, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm8-2', name: '烤鸡胸肉', price: 48, calorie: 280, protein: 35, fat: 10, carbs: 2, image: '', category: '主菜', emoji: '🐔' },
    { id: 'm8-3', name: '烤三文鱼', price: 58, calorie: 320, protein: 30, fat: 18, carbs: 2, image: '', category: '主菜', emoji: '🐟' },
    { id: 'm8-4', name: '蔬菜汤', price: 22, calorie: 80, protein: 4, fat: 2, carbs: 12, image: '', category: '汤品', emoji: '🥣' },
    { id: 'm8-5', name: '地中海烤鱼', price: 52, calorie: 300, protein: 32, fat: 12, carbs: 5, image: '', category: '主菜', emoji: '🐟' },
    { id: 'm8-6', name: '鹰嘴豆沙拉', price: 32, calorie: 220, protein: 10, fat: 8, carbs: 25, image: '', category: '沙拉', emoji: '🫘' },
    { id: 'm8-7', name: '全麦意面', price: 38, calorie: 380, protein: 14, fat: 6, carbs: 65, image: '', category: '主食', emoji: '🍝' },
    { id: 'm8-8', name: '水果拼盘', price: 28, calorie: 150, protein: 2, fat: 0.5, carbs: 35, image: '', category: '甜点', emoji: '🍇' },
  ],
  'r9': [
    { id: 'm9-1', name: '增肌鸡胸饭', price: 35, calorie: 520, protein: 40, fat: 12, carbs: 55, image: '', category: '健身餐', emoji: '💪' },
    { id: 'm9-2', name: '牛肉蛋白碗', price: 42, calorie: 480, protein: 35, fat: 15, carbs: 45, image: '', category: '健身餐', emoji: '🥩' },
    { id: 'm9-3', name: '三文鱼能量碗', price: 48, calorie: 450, protein: 32, fat: 18, carbs: 38, image: '', category: '健身餐', emoji: '🐟' },
    { id: 'm9-4', name: '减脂鸡胸沙拉', price: 32, calorie: 280, protein: 30, fat: 8, carbs: 12, image: '', category: '减脂餐', emoji: '🥗' },
    { id: 'm9-5', name: '低卡蔬菜汤', price: 18, calorie: 120, protein: 8, fat: 2, carbs: 15, image: '', category: '减脂餐', emoji: '🥣' },
    { id: 'm9-6', name: '蛋白奶昔', price: 28, calorie: 200, protein: 25, fat: 3, carbs: 15, image: '', category: '饮品', emoji: '🥤' },
    { id: 'm9-7', name: '燕麦能量棒', price: 15, calorie: 180, protein: 8, fat: 6, carbs: 25, image: '', category: '加餐', emoji: '🥜' },
    { id: 'm9-8', name: '希腊酸奶碗', price: 22, calorie: 220, protein: 15, fat: 8, carbs: 22, image: '', category: '加餐', emoji: '🫐' },
  ],
  'r10': [
    { id: 'm10-1', name: '有机蔬菜沙拉', price: 35, calorie: 180, protein: 8, fat: 10, carbs: 15, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm10-2', name: '豆腐糙米饭', price: 28, calorie: 320, protein: 15, fat: 8, carbs: 45, image: '', category: '主食', emoji: '🍚' },
    { id: 'm10-3', name: '素炒时蔬', price: 22, calorie: 120, protein: 5, fat: 6, carbs: 15, image: '', category: '时蔬', emoji: '🥬' },
    { id: 'm10-4', name: '菌菇汤', price: 18, calorie: 80, protein: 6, fat: 2, carbs: 10, image: '', category: '汤品', emoji: '🍄' },
    { id: 'm10-5', name: '紫薯泥', price: 15, calorie: 150, protein: 3, fat: 0.5, carbs: 35, image: '', category: '主食', emoji: '🍠' },
    { id: 'm10-6', name: '凉拌海带', price: 12, calorie: 60, protein: 2, fat: 2, carbs: 10, image: '', category: '凉菜', emoji: '🌿' },
    { id: 'm10-7', name: '豆浆', price: 8, calorie: 80, protein: 6, fat: 3, carbs: 8, image: '', category: '饮品', emoji: '🥛' },
    { id: 'm10-8', name: '水果燕麦碗', price: 25, calorie: 250, protein: 8, fat: 6, carbs: 42, image: '', category: '加餐', emoji: '🥣' },
  ],
};

export const RESTAURANT_COMBOS: Record<string, Combo[]> = {
  'r1': [
    { id: 'c1-1', name: '减脂套餐A', items: ['m1-2', 'm1-5'], totalPrice: 58, totalCalorie: 440, originalPrice: 66, tags: ['减脂', '高蛋白'], target: 'fat', emoji: '🥗' },
    { id: 'c1-2', name: '轻食午餐', items: ['m1-6', 'm1-8'], totalPrice: 38, totalCalorie: 380, originalPrice: 44, tags: ['低卡', '均衡'], target: 'keep', emoji: '🥪' },
  ],
  'r2': [
    { id: 'c2-1', name: '增肌套餐', items: ['m2-1', 'm2-7'], totalPrice: 32, totalCalorie: 480, originalPrice: 36, tags: ['增肌', '高蛋白'], target: 'muscle', emoji: '💪' },
    { id: 'c2-2', name: '减脂便当', items: ['m2-4', 'm2-8'], totalPrice: 24, totalCalorie: 372, originalPrice: 28, tags: ['减脂', '低卡'], target: 'fat', emoji: '🥬' },
  ],
  'r3': [
    { id: 'c3-1', name: '健康午餐', items: ['m3-1', 'm3-6'], totalPrice: 46, totalCalorie: 480, originalPrice: 50, tags: ['健康', '均衡'], target: 'keep', emoji: '🥬' },
    { id: 'c3-2', name: '点心套餐', items: ['m3-5', 'm3-7'], totalPrice: 44, totalCalorie: 460, originalPrice: 48, tags: ['点心', '下午茶'], target: 'keep', emoji: '🥟' },
  ],
  'r4': [
    { id: 'c4-1', name: '寿司套餐', items: ['m4-1', 'm4-5'], totalPrice: 46, totalCalorie: 320, originalPrice: 50, tags: ['低卡', '日料'], target: 'fat', emoji: '🍣' },
    { id: 'c4-2', name: '增肌鳗鱼饭', items: ['m4-3', 'm4-5'], totalPrice: 56, totalCalorie: 490, originalPrice: 60, tags: ['增肌', '高蛋白'], target: 'muscle', emoji: '🍱' },
  ],
  'r5': [
    { id: 'c5-1', name: '经典套餐', items: ['m5-1', 'm5-6'], totalPrice: 34, totalCalorie: 480, originalPrice: 38, tags: ['经典', '实惠'], target: 'keep', emoji: '🍜' },
    { id: 'c5-2', name: '增肌牛肉面', items: ['m5-2', 'm5-8'], totalPrice: 29, totalCalorie: 560, originalPrice: 31, tags: ['增肌', '高蛋白'], target: 'muscle', emoji: '🍜' },
  ],
  'r6': [
    { id: 'c6-1', name: '辣爽套餐', items: ['m6-1', 'm6-6'], totalPrice: 29, totalCalorie: 366, originalPrice: 31, tags: ['湘菜', '下饭'], target: 'keep', emoji: '🌶️' },
    { id: 'c6-2', name: '营养套餐', items: ['m6-7', 'm6-8', 'm6-6'], totalPrice: 41, totalCalorie: 336, originalPrice: 47, tags: ['营养', '清淡'], target: 'fat', emoji: '🥣' },
  ],
  'r8': [
    { id: 'c8-1', name: '地中海套餐', items: ['m8-1', 'm8-2'], totalPrice: 82, totalCalorie: 480, originalPrice: 90, tags: ['健康', '地中海'], target: 'keep', emoji: '🫒' },
    { id: 'c8-2', name: '减脂烤鱼', items: ['m8-5', 'm8-4'], totalPrice: 70, totalCalorie: 360, originalPrice: 80, tags: ['减脂', '高蛋白'], target: 'fat', emoji: '🐟' },
  ],
  'r9': [
    { id: 'c9-1', name: '增肌力量套餐', items: ['m9-1', 'm9-6'], totalPrice: 58, totalCalorie: 720, originalPrice: 63, tags: ['增肌', '超高蛋白'], target: 'muscle', emoji: '💪' },
    { id: 'c9-2', name: '增肌牛肉套餐', items: ['m9-2', 'm9-7'], totalPrice: 52, totalCalorie: 660, originalPrice: 57, tags: ['增肌', '高蛋白'], target: 'muscle', emoji: '🥩' },
    { id: 'c9-3', name: '增肌三文鱼套餐', items: ['m9-3', 'm9-8'], totalPrice: 62, totalCalorie: 670, originalPrice: 70, tags: ['增肌', '优质脂肪'], target: 'muscle', emoji: '🐟' },
    { id: 'c9-4', name: '减脂鸡胸套餐', items: ['m9-4', 'm9-5'], totalPrice: 45, totalCalorie: 400, originalPrice: 50, tags: ['减脂', '低卡'], target: 'fat', emoji: '🥗' },
  ],
  'r10': [
    { id: 'c10-1', name: '素食减脂套餐', items: ['m10-1', 'm10-7'], totalPrice: 38, totalCalorie: 260, originalPrice: 43, tags: ['减脂', '素食'], target: 'fat', emoji: '🥗' },
    { id: 'c10-2', name: '有机健康餐', items: ['m10-2', 'm10-4'], totalPrice: 40, totalCalorie: 400, originalPrice: 46, tags: ['有机', '均衡'], target: 'keep', emoji: '🌿' },
  ],
};

export const SMART_RECIPES: SmartRecipe[] = [
  {
    id: 'sr1', name: '香煎鸡胸肉', calorie: 180, protein: 35, fat: 4, carbs: 0,
    description: '高蛋白低脂，增肌减脂皆宜',
    method: '1.鸡胸肉切片，用盐、黑胡椒、料酒腌制15分钟\n2.平底锅少油，中火煎至两面金黄\n3.出锅前撒少许柠檬汁提味',
    category: '蛋白质', emoji: '🐔', suitableTarget: ['fat', 'muscle', 'keep'],
  },
  {
    id: 'sr2', name: '清蒸鲈鱼', calorie: 120, protein: 22, fat: 3, carbs: 0,
    description: '清淡鲜美，优质蛋白来源',
    method: '1.鲈鱼洗净，表面划刀，放姜片葱段\n2.水开后上锅蒸8-10分钟\n3.倒掉蒸鱼水，淋少许蒸鱼豉油',
    category: '蛋白质', emoji: '🐟', suitableTarget: ['fat', 'muscle', 'keep'],
  },
  {
    id: 'sr3', name: '水煮西兰花', calorie: 55, protein: 4, fat: 0.5, carbs: 11,
    description: '低卡高纤，减脂必备蔬菜',
    method: '1.西兰花掰成小朵，盐水浸泡10分钟\n2.水开后放入西兰花煮2-3分钟\n3.捞出沥干，可蘸少许酱油食用',
    category: '蔬菜', emoji: '🥦', suitableTarget: ['fat', 'muscle', 'keep'],
  },
  {
    id: 'sr4', name: '杂粮饭', calorie: 220, protein: 6, fat: 2, carbs: 45,
    description: '低GI主食，饱腹感强',
    method: '1.糙米、燕麦、黑米混合洗净\n2.提前浸泡2小时\n3.电饭煲正常煮饭模式',
    category: '主食', emoji: '🍚', suitableTarget: ['fat', 'keep'],
  },
  {
    id: 'sr5', name: '蛋白炒饭', calorie: 350, protein: 22, fat: 12, carbs: 38,
    description: '增肌期优质碳水+蛋白组合',
    method: '1.米饭提前冷藏隔夜\n2.鸡蛋打散，锅中炒熟盛出\n3.少油炒饭，加入鸡蛋和少许蔬菜丁',
    category: '主食', emoji: '🍳', suitableTarget: ['muscle', 'keep'],
  },
  {
    id: 'sr6', name: '牛油果鸡蛋吐司', calorie: 280, protein: 14, fat: 18, carbs: 18,
    description: '优质脂肪+蛋白，营养均衡',
    method: '1.全麦吐司烤至微脆\n2.牛油果捣碎涂抹在吐司上\n3.放一个水煮蛋切片，撒黑胡椒',
    category: '早餐', emoji: '🥑', suitableTarget: ['muscle', 'keep'],
  },
  {
    id: 'sr7', name: '番茄豆腐汤', calorie: 90, protein: 8, fat: 3, carbs: 8,
    description: '低卡暖胃，适合加餐',
    method: '1.番茄切块炒出汁\n2.加入适量水和嫩豆腐\n3.煮开后加少许盐和葱花',
    category: '汤品', emoji: '🍅', suitableTarget: ['fat', 'keep'],
  },
  {
    id: 'sr8', name: '凉拌鸡丝荞麦面', calorie: 320, protein: 25, fat: 6, carbs: 45,
    description: '低脂高蛋白，减脂期推荐',
    method: '1.荞麦面煮熟过凉水\n2.鸡胸肉煮熟撕成丝\n3.用醋、酱油、少许芝麻油拌匀',
    category: '主食', emoji: '🍜', suitableTarget: ['fat', 'keep'],
  },
  {
    id: 'sr9', name: '烤三文鱼', calorie: 280, protein: 30, fat: 16, carbs: 0,
    description: '富含Omega-3，增肌减脂都适合',
    method: '1.三文鱼用盐、黑胡椒、柠檬腌制\n2.烤箱200度烤12-15分钟\n3.可搭配芦笋或西兰花',
    category: '蛋白质', emoji: '🐟', suitableTarget: ['muscle', 'keep'],
  },
  {
    id: 'sr10', name: '希腊酸奶水果碗', calorie: 200, protein: 15, fat: 5, carbs: 25,
    description: '高蛋白低脂，适合加餐或早餐',
    method: '1.无糖希腊酸奶倒入碗中\n2.加入蓝莓、草莓等低糖水果\n3.撒少许坚果碎增加口感',
    category: '加餐', emoji: '🫐', suitableTarget: ['fat', 'muscle', 'keep'],
  },
  {
    id: 'sr11', name: '牛肉蔬菜炒', calorie: 250, protein: 25, fat: 12, carbs: 10,
    description: '高蛋白补铁，增肌期推荐',
    method: '1.牛肉切薄片用淀粉腌制\n2.热锅快炒牛肉至变色盛出\n3.炒蔬菜后回锅牛肉，加少许蚝油',
    category: '蛋白质', emoji: '🥩', suitableTarget: ['muscle', 'keep'],
  },
  {
    id: 'sr12', name: '燕麦粥', calorie: 180, protein: 6, fat: 3, carbs: 32,
    description: '低GI早餐，持久饱腹',
    method: '1.燕麦片加水或牛奶煮开\n2.小火煮3-5分钟至粘稠\n3.可加少许蜂蜜或水果调味',
    category: '早餐', emoji: '🥣', suitableTarget: ['fat', 'keep'],
  },
];

export const LOW_CAL_RECIPES: LowCalRecipe[] = [
  {
    id: 'lc1', name: '水煮蛋', calorie: 70, protein: 6, fat: 5, carbs: 0.5,
    method: '1.鸡蛋冷水下锅\n2.水开后煮8分钟\n3.过凉水剥壳即可',
    emoji: '🥚', category: '蛋白质',
  },
  {
    id: 'lc2', name: '黄瓜拌木耳', calorie: 45, protein: 2, fat: 1, carbs: 8,
    method: '1.木耳泡发焯水\n2.黄瓜拍碎切块\n3.加醋、蒜末、少许香油拌匀',
    emoji: '🥒', category: '凉菜',
  },
  {
    id: 'lc3', name: '番茄炒蛋', calorie: 120, protein: 8, fat: 6, carbs: 10,
    method: '1.鸡蛋打散炒熟盛出\n2.番茄切块炒出汁\n3.加入鸡蛋翻炒，加少许盐',
    emoji: '🍅', category: '家常菜',
  },
  {
    id: 'lc4', name: '蒸红薯', calorie: 100, protein: 2, fat: 0.2, carbs: 23,
    method: '1.红薯洗净不去皮\n2.蒸锅大火蒸20-25分钟\n3.用筷子能轻松插入即可',
    emoji: '🍠', category: '主食',
  },
  {
    id: 'lc5', name: '凉拌菠菜', calorie: 40, protein: 3, fat: 1, carbs: 5,
    method: '1.菠菜焯水30秒捞出\n2.过凉水挤干切段\n3.加蒜末、醋、少许酱油拌匀',
    emoji: '🥬', category: '凉菜',
  },
  {
    id: 'lc6', name: '紫菜蛋花汤', calorie: 50, protein: 4, fat: 2, carbs: 5,
    method: '1.水烧开放入紫菜\n2.淋入打散的蛋液\n3.加少许盐和香油',
    emoji: '🥣', category: '汤品',
  },
  {
    id: 'lc7', name: '蒸玉米', calorie: 110, protein: 3, fat: 1.5, carbs: 24,
    method: '1.玉米剥去外皮留一层\n2.蒸锅水开后放入\n3.大火蒸15-20分钟',
    emoji: '🌽', category: '主食',
  },
  {
    id: 'lc8', name: '凉拌豆腐', calorie: 60, protein: 6, fat: 3, carbs: 2,
    method: '1.嫩豆腐切块摆盘\n2.淋上酱油、醋、香油\n3.撒葱花和少许辣椒',
    emoji: '🧈', category: '凉菜',
  },
  {
    id: 'lc9', name: '清炒冬瓜', calorie: 35, protein: 1, fat: 1, carbs: 6,
    method: '1.冬瓜去皮切薄片\n2.少油大火快炒\n3.加少许盐和蒜末调味',
    emoji: '🥒', category: '蔬菜',
  },
  {
    id: 'lc10', name: '苹果', calorie: 52, protein: 0.3, fat: 0.2, carbs: 13.5,
    method: '洗净直接食用，建议带皮吃保留更多膳食纤维',
    emoji: '🍎', category: '水果',
  },
  {
    id: 'lc11', name: '无糖豆浆', calorie: 35, protein: 3, fat: 1.5, carbs: 1,
    method: '1.黄豆提前浸泡8小时\n2.加水放入豆浆机\n3.选择豆浆模式，滤渣后饮用',
    emoji: '🥛', category: '饮品',
  },
  {
    id: 'lc12', name: '凉拌海带丝', calorie: 30, protein: 1, fat: 0.5, carbs: 6,
    method: '1.干海带泡发切丝\n2.焯水2分钟捞出过凉\n3.加醋、蒜末、少许辣椒油拌匀',
    emoji: '🌿', category: '凉菜',
  },
  {
    id: 'lc13', name: '白灼菜心', calorie: 40, protein: 3, fat: 0.5, carbs: 7,
    method: '1.菜心洗净\n2.沸水中焯1分钟\n3.淋少许蒸鱼豉油即可',
    emoji: '🥬', category: '蔬菜',
  },
  {
    id: 'lc14', name: '蒸南瓜', calorie: 45, protein: 1, fat: 0.2, carbs: 10,
    method: '1.南瓜去皮切块\n2.蒸锅大火蒸15分钟\n3.软糯即可，天然甜味无需加糖',
    emoji: '🎃', category: '主食',
  },
  {
    id: 'lc15', name: '小番茄', calorie: 25, protein: 1, fat: 0.3, carbs: 5,
    method: '洗净直接食用，富含番茄红素和维生素C',
    emoji: '🍅', category: '水果',
  },
  {
    id: 'lc16', name: '茶叶蛋', calorie: 75, protein: 6, fat: 5, carbs: 1,
    method: '1.鸡蛋煮熟敲裂外壳\n2.放入茶叶、酱油、八角煮\n3.浸泡2小时以上更入味',
    emoji: '🥚', category: '加餐',
  },
  {
    id: 'lc17', name: '凉拌金针菇', calorie: 35, protein: 3, fat: 0.5, carbs: 6,
    method: '1.金针菇去根焯水2分钟\n2.过凉水挤干\n3.加蒜末、醋、少许辣椒油拌匀',
    emoji: '🍄', category: '凉菜',
  },
  {
    id: 'lc18', name: '芹菜炒香干', calorie: 80, protein: 6, fat: 4, carbs: 5,
    method: '1.芹菜切段，香干切片\n2.少油炒香干至微黄\n3.加入芹菜翻炒，加盐调味',
    emoji: '🥬', category: '家常菜',
  },
];

export const EXERCISE_RECOMMENDATIONS = [
  { name: '快走', emoji: '🚶', calorie: 200, duration: '30分钟', description: '适合所有人群，低冲击有氧' },
  { name: '慢跑', emoji: '🏃', calorie: 300, duration: '30分钟', description: '中等强度有氧，燃脂效果好' },
  { name: '跳绳', emoji: '🪢', calorie: 350, duration: '20分钟', description: '高效燃脂，全身运动' },
  { name: '瑜伽', emoji: '🧘', calorie: 150, duration: '45分钟', description: '放松身心，提高柔韧性' },
  { name: '游泳', emoji: '🏊', calorie: 400, duration: '30分钟', description: '全身运动，不伤关节' },
  { name: '骑行', emoji: '🚴', calorie: 280, duration: '30分钟', description: '有氧运动，锻炼下肢' },
  { name: '羽毛球', emoji: '🏸', calorie: 250, duration: '30分钟', description: '趣味运动，提高反应力' },
  { name: '力量训练', emoji: '🏋️', calorie: 200, duration: '40分钟', description: '增加肌肉量，提高基础代谢' },
];

export const getRecommendedRestaurants = (maxCalorie: number, sortBy: 'distance' | 'rating' | 'calorie' = 'distance'): Restaurant[] => {
  let filtered = [...RESTAURANTS];

  if (sortBy === 'distance') {
    filtered.sort((a, b) => a.distance - b.distance);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'calorie') {
    filtered.sort((a, b) => {
      const aCal = Math.min(...(RESTAURANT_MENUS[a.id]?.map(m => m.calorie) || [Infinity]));
      const bCal = Math.min(...(RESTAURANT_MENUS[b.id]?.map(m => m.calorie) || [Infinity]));
      return aCal - bCal;
    });
  }

  return filtered.slice(0, 6);
};

export const getLowCalorieMenuItems = (restaurantId: string, maxCalorie: number): MenuItem[] => {
  const menu = RESTAURANT_MENUS[restaurantId] || [];
  return menu.filter(item => item.calorie <= maxCalorie).sort((a, b) => a.calorie - b.calorie);
};

export const getRecommendedCombo = (restaurantId: string, targetCalorie: number): Combo | null => {
  const combos = RESTAURANT_COMBOS[restaurantId] || [];
  if (combos.length === 0) return null;

  return combos.reduce((best, combo) => {
    if (!best) return combo;
    const bestDiff = Math.abs(best.totalCalorie - targetCalorie);
    const comboDiff = Math.abs(combo.totalCalorie - targetCalorie);
    return comboDiff < bestDiff ? combo : best;
  }, null as Combo | null);
};

export const getCombosByTarget = (target: 'fat' | 'muscle' | 'keep'): Combo[] => {
  const allCombos = Object.values(RESTAURANT_COMBOS).flat();
  return allCombos.filter(c => c.target === target).slice(0, 4);
};

export const getSmartRecipes = (remainingCalorie: number, userTarget: 'fat' | 'muscle' | 'keep'): SmartRecipe[] => {
  return SMART_RECIPES
    .filter(r => r.calorie <= remainingCalorie + 50 && r.suitableTarget.includes(userTarget))
    .sort((a, b) => Math.abs(a.calorie - remainingCalorie) - Math.abs(b.calorie - remainingCalorie))
    .slice(0, 12);
};

export const getRecipesByCategory = (category: string, userTarget: 'fat' | 'muscle' | 'keep'): SmartRecipe[] => {
  return SMART_RECIPES.filter(r => r.category === category && r.suitableTarget.includes(userTarget));
};

export interface DietRecommendation {
  type: 'cook' | 'takeout';
  name: string;
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
  description: string;
  image: string;
}

export const getDietRecommendations = (remainingCalorie: number): DietRecommendation[] => {
  const recommendations: DietRecommendation[] = [];

  const cookOptions = [
    { name: '鸡胸肉沙拉', calorie: 320, protein: 32, fat: 12, carbs: 10, description: '水煮鸡胸肉配新鲜蔬菜，少油少盐，高蛋白低脂肪', image: '' },
    { name: '清蒸鱼+杂粮饭', calorie: 400, protein: 28, fat: 8, carbs: 50, description: '清蒸鲈鱼配杂粮饭，清淡营养，适合减脂期', image: '' },
    { name: '蔬菜豆腐汤', calorie: 150, protein: 12, fat: 4, carbs: 15, description: '清淡蔬菜豆腐汤，低热量高营养', image: '' },
    { name: '全麦三明治', calorie: 300, protein: 18, fat: 10, carbs: 35, description: '全麦面包+鸡胸肉+蔬菜，快捷又健康', image: '' },
    { name: '凉拌鸡丝荞麦面', calorie: 380, protein: 22, fat: 8, carbs: 55, description: '低脂高蛋白，饱腹感强', image: '' },
  ];

  cookOptions.forEach(option => {
    if (option.calorie <= remainingCalorie + 100) {
      recommendations.push({ ...option, type: 'cook' as const });
    }
  });

  RESTAURANTS.slice(0, 4).forEach(restaurant => {
    const menu = RESTAURANT_MENUS[restaurant.id] || [];
    const suitableItems = menu.filter(item => item.calorie <= remainingCalorie + 100);
    if (suitableItems.length > 0) {
      const item = suitableItems[0];
      recommendations.push({
        type: 'takeout',
        name: `${restaurant.name} - ${item.name}`,
        calorie: item.calorie,
        protein: item.protein || 0,
        fat: item.fat || 0,
        carbs: item.carbs || 0,
        description: `${restaurant.name} · 配送约${restaurant.deliveryTime}`,
        image: item.image,
      });
    }
  });

  return recommendations.slice(0, 6);
};
