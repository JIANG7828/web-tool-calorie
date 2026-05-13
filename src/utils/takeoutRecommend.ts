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
  emoji?: string;
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
  emoji?: string;
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
  suitableTarget: ('fat' | 'muscle' | 'keep')[];
  emoji?: string;
}

export interface LowCalRecipe {
  id: string;
  name: string;
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
  method: string;
  category: string;
  emoji?: string;
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1', name: '轻食沙拉屋', rating: 4.8, deliveryTime: '25-35分钟', deliveryFee: 3, minOrder: 20,
    tags: ['轻食', '健康', '低卡'], image: '', address: '朝阳区建国路88号', distance: 0.5, emoji: '🥗',
  },
  {
    id: 'r2', name: '元气便当', rating: 4.6, deliveryTime: '20-30分钟', deliveryFee: 5, minOrder: 25,
    tags: ['便当', '减脂餐', '营养均衡'], image: '', address: '朝阳区望京SOHO', distance: 0.8, emoji: '🍱',
  },
  {
    id: 'r3', name: '粤港茶餐厅', rating: 4.5, deliveryTime: '30-45分钟', deliveryFee: 6, minOrder: 30,
    tags: ['粤菜', '茶餐厅', '点心'], image: '', address: '东城区王府井大街', distance: 1.2, emoji: '🍵',
  },
  {
    id: 'r4', name: '和风寿司', rating: 4.7, deliveryTime: '25-35分钟', deliveryFee: 4, minOrder: 35,
    tags: ['寿司', '日料', '低卡'], image: '', address: '海淀区中关村大街', distance: 1.5, emoji: '🍣',
  },
  {
    id: 'r5', name: '西北牛肉面', rating: 4.4, deliveryTime: '15-25分钟', deliveryFee: 3, minOrder: 15,
    tags: ['面食', '清真', '实惠'], image: '', address: '西城区西单北大街', distance: 2.0, emoji: '🍜',
  },
  {
    id: 'r6', name: '湘米乐', rating: 4.6, deliveryTime: '25-35分钟', deliveryFee: 4, minOrder: 20,
    tags: ['湘菜', '家常菜', '米饭'], image: '', address: '丰台区方庄', distance: 2.5, emoji: '🍚',
  },
  {
    id: 'r7', name: '鲜榨果汁吧', rating: 4.9, deliveryTime: '15-25分钟', deliveryFee: 2, minOrder: 18,
    tags: ['饮品', '果汁', '健康'], image: '', address: '朝阳区三里屯', distance: 0.6, emoji: '🧃',
  },
  {
    id: 'r8', name: '地中海餐厅', rating: 4.8, deliveryTime: '30-45分钟', deliveryFee: 8, minOrder: 50,
    tags: ['西餐', '健康', '地中海'], image: '', address: '朝阳区国贸中心', distance: 0.3, emoji: '🏖️',
  },
  {
    id: 'r9', name: '健身餐工坊', rating: 4.9, deliveryTime: '20-30分钟', deliveryFee: 3, minOrder: 25,
    tags: ['健身餐', '高蛋白', '增肌'], image: '', address: '朝阳区工体北路', distance: 0.4, emoji: '💪',
  },
  {
    id: 'r10', name: '素食主义', rating: 4.7, deliveryTime: '25-35分钟', deliveryFee: 4, minOrder: 20,
    tags: ['素食', '有机', '低卡'], image: '', address: '海淀区五道口', distance: 1.8, emoji: '🥬',
  },
  {
    id: 'r11', name: '川味轩', rating: 4.5, deliveryTime: '25-40分钟', deliveryFee: 5, minOrder: 25,
    tags: ['川菜', '麻辣', '下饭'], image: '', address: '通州区新华大街', distance: 3.0, emoji: '🌶️',
  },
  {
    id: 'r12', name: '江南小厨', rating: 4.6, deliveryTime: '30-40分钟', deliveryFee: 4, minOrder: 20,
    tags: ['江浙菜', '清淡', '精致'], image: '', address: '昌平区回龙观', distance: 3.5, emoji: '🥢',
  },
  {
    id: 'r13', name: '东北饺子馆', rating: 4.4, deliveryTime: '20-35分钟', deliveryFee: 3, minOrder: 15,
    tags: ['东北菜', '饺子', '面食'], image: '', address: '大兴区黄村', distance: 4.0, emoji: '🥟',
  },
  {
    id: 'r14', name: '韩式烤肉', rating: 4.7, deliveryTime: '35-50分钟', deliveryFee: 6, minOrder: 40,
    tags: ['韩餐', '烤肉', '聚餐'], image: '', address: '顺义区后沙峪', distance: 5.0, emoji: '🥩',
  },
  {
    id: 'r15', name: '泰式料理', rating: 4.8, deliveryTime: '30-45分钟', deliveryFee: 5, minOrder: 30,
    tags: ['泰餐', '酸辣', '异国'], image: '', address: '朝阳区大望路', distance: 1.0, emoji: '🍲',
  },
  {
    id: 'r16', name: '沙县小吃', rating: 4.2, deliveryTime: '15-20分钟', deliveryFee: 2, minOrder: 10,
    tags: ['小吃', '快餐', '实惠'], image: '', address: '海淀区学院路', distance: 0.8, emoji: '🏪',
  },
  {
    id: 'r17', name: '真功夫', rating: 4.3, deliveryTime: '20-30分钟', deliveryFee: 3, minOrder: 15,
    tags: ['中式快餐', '蒸品', '健康'], image: '', address: '朝阳区双井', distance: 1.2, emoji: '🍳',
  },
  {
    id: 'r18', name: '吉野家', rating: 4.4, deliveryTime: '20-30分钟', deliveryFee: 4, minOrder: 20,
    tags: ['日式快餐', '牛肉饭', '快捷'], image: '', address: '西城区金融街', distance: 1.5, emoji: '🐮',
  },
  {
    id: 'r19', name: '麻辣烫', rating: 4.3, deliveryTime: '20-30分钟', deliveryFee: 3, minOrder: 15,
    tags: ['麻辣烫', '自选', '实惠'], image: '', address: '朝阳区管庄', distance: 3.5, emoji: '🔥',
  },
  {
    id: 'r20', name: '黄焖鸡米饭', rating: 4.2, deliveryTime: '20-30分钟', deliveryFee: 3, minOrder: 15,
    tags: ['家常菜', '米饭', '下饭'], image: '', address: '丰台区宋家庄', distance: 3.0, emoji: '🍗',
  },
];

export const RESTAURANT_MENUS: Record<string, MenuItem[]> = {
  'r1': [
    { id: 'm1-1', name: '凯撒沙拉', price: 32, calorie: 280, protein: 18, fat: 18, carbs: 8, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm1-2', name: '鸡胸肉沙拉', price: 38, calorie: 320, protein: 32, fat: 12, carbs: 10, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm1-3', name: '三文鱼沙拉', price: 45, calorie: 380, protein: 28, fat: 22, carbs: 8, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm1-4', name: '牛油果沙拉', price: 36, calorie: 350, protein: 12, fat: 28, carbs: 15, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm1-5', name: '烤蔬菜沙拉', price: 28, calorie: 220, protein: 6, fat: 12, carbs: 20, image: '', category: '沙拉', emoji: '🥗' },
    { id: 'm1-6', name: '全麦三明治', price: 26, calorie: 310, protein: 18, fat: 12, carbs: 32, image: '', category: '主食', emoji: '🥪' },
    { id: 'm1-7', name: '藜麦碗', price: 42, calorie: 380, protein: 20, fat: 14, carbs: 42, image: '', category: '主食', emoji: '🥣' },
    { id: 'm1-8', name: '无糖酸奶杯', price: 18, calorie: 120, protein: 8, fat: 3, carbs: 12, image: '', category: '甜点', emoji: '🍰' },
    { id: 'm1-9', name: '鸡肉卷', price: 28, calorie: 340, protein: 22, fat: 14, carbs: 28, image: '', category: '主食', emoji: '🌯' },
    { id: 'm1-10', name: '鲜榨蔬果汁', price: 22, calorie: 90, protein: 2, fat: 0.5, carbs: 20, image: '', category: '饮品', emoji: '🥤' },
    { id: 'm1-11', name: '坚果能量棒', price: 15, calorie: 180, protein: 8, fat: 10, carbs: 16, image: '', category: '加餐', emoji: '🥜' },
    { id: 'm1-12', name: '紫薯泥', price: 20, calorie: 160, protein: 3, fat: 0.5, carbs: 38, image: '', category: '主食', emoji: '🍠' },
  ],
  'r2': [
    { id: 'm2-1', name: '减脂鸡腿饭', price: 28, calorie: 420, protein: 28, fat: 12, carbs: 48, image: '', category: '便当', emoji: '🍱' },
    { id: 'm2-2', name: '清蒸鱼便当', price: 32, calorie: 380, protein: 30, fat: 8, carbs: 45, image: '', category: '便当', emoji: '🍱' },
    { id: 'm2-3', name: '牛肉蔬菜饭', price: 35, calorie: 450, protein: 26, fat: 15, carbs: 52, image: '', category: '便当', emoji: '🍱' },
    { id: 'm2-4', name: '豆腐蔬菜便当', price: 22, calorie: 320, protein: 18, fat: 8, carbs: 42, image: '', category: '便当', emoji: '🍱' },
    { id: 'm2-5', name: '杂粮鸡胸饭', price: 30, calorie: 400, protein: 25, fat: 10, carbs: 45, image: '', category: '便当', emoji: '🍱' },
    { id: 'm2-6', name: '凉拌鸡丝面', price: 26, calorie: 360, protein: 22, fat: 8, carbs: 52, image: '', category: '面食', emoji: '🍜' },
    { id: 'm2-7', name: '番茄鸡蛋汤', price: 8, calorie: 60, protein: 4, fat: 2, carbs: 8, image: '', category: '汤品', emoji: '🍲' },
    { id: 'm2-8', name: '苹果', price: 6, calorie: 52, protein: 0.3, fat: 0.2, carbs: 13.5, image: '', category: '水果', emoji: '🍎' },
    { id: 'm2-9', name: '糙米饭', price: 4, calorie: 130, protein: 3, fat: 1, carbs: 28, image: '', category: '主食', emoji: '🍚' },
    { id: 'm2-10', name: '凉拌海带丝', price: 8, calorie: 40, protein: 2, fat: 1, carbs: 6, image: '', category: '凉菜', emoji: '🥬' },
  ],
  'r3': [
    { id: 'm3-1', name: '白灼菜心', price: 18, calorie: 80, protein: 4, fat: 3, carbs: 10, image: '', category: '时蔬', emoji: '🥬' },
    { id: 'm3-2', name: '清蒸排骨', price: 38, calorie: 280, protein: 25, fat: 18, carbs: 5, image: '', category: '肉类', emoji: '🥩' },
    { id: 'm3-3', name: '蒜蓉西兰花', price: 22, calorie: 100, protein: 5, fat: 5, carbs: 12, image: '', category: '时蔬', emoji: '🥦' },
    { id: 'm3-4', name: '蚝油生菜', price: 16, calorie: 90, protein: 4, fat: 4, carbs: 10, image: '', category: '时蔬', emoji: '🥬' },
    { id: 'm3-5', name: '虾饺', price: 28, calorie: 320, protein: 12, fat: 10, carbs: 38, image: '', category: '点心', emoji: '🥟' },
    { id: 'm3-6', name: '叉烧饭', price: 32, calorie: 420, protein: 20, fat: 15, carbs: 50, image: '', category: '主食', emoji: '🍚' },
    { id: 'm3-7', name: '皮蛋瘦肉粥', price: 20, calorie: 180, protein: 10, fat: 4, carbs: 28, image: '', category: '粥品', emoji: '🥣' },
    { id: 'm3-8', name: '干炒牛河', price: 30, calorie: 400, protein: 15, fat: 18, carbs: 45, image: '', category: '主食', emoji: '🍜' },
    { id: 'm3-9', name: '流沙包', price: 16, calorie: 280, protein: 6, fat: 15, carbs: 32, image: '', category: '点心', emoji: '🥟' },
    { id: 'm3-10', name: '肠粉', price: 12, calorie: 220, protein: 8, fat: 6, carbs: 35, image: '', category: '点心', emoji: '🥟' },
  ],
  'r4': [
    { id: 'm4-1', name: '三文鱼寿司', price: 38, calorie: 280, protein: 18, fat: 12, carbs: 22, image: '', category: '寿司', emoji: '🍣' },
    { id: 'm4-2', name: '金枪鱼寿司', price: 35, calorie: 260, protein: 22, fat: 8, carbs: 20, image: '', category: '寿司', emoji: '🍣' },
    { id: 'm4-3', name: '鳗鱼饭', price: 48, calorie: 450, protein: 25, fat: 18, carbs: 42, image: '', category: '主食', emoji: '🍚' },
    { id: 'm4-4', name: '刺身拼盘', price: 88, calorie: 320, protein: 35, fat: 15, carbs: 5, image: '', category: '刺身', emoji: '🐟' },
    { id: 'm4-5', name: '味增汤', price: 12, calorie: 60, protein: 4, fat: 2, carbs: 6, image: '', category: '汤品', emoji: '🍲' },
    { id: 'm4-6', name: '乌冬面', price: 32, calorie: 380, protein: 12, fat: 6, carbs: 68, image: '', category: '面食', emoji: '🍜' },
    { id: 'm4-7', name: '天妇罗', price: 42, calorie: 380, protein: 15, fat: 25, carbs: 20, image: '', category: '炸物', emoji: '🍤' },
    { id: 'm4-8', name: '玉子烧', price: 18, calorie: 180, protein: 10, fat: 10, carbs: 12, image: '', category: '蛋类', emoji: '🥚' },
    { id: 'm4-9', name: '茶碗蒸', price: 22, calorie: 100, protein: 8, fat: 5, carbs: 4, image: '', category: '蛋类', emoji: '🥚' },
    { id: 'm4-10', name: '日式炸豆腐', price: 16, calorie: 150, protein: 8, fat: 8, carbs: 12, image: '', category: '前菜', emoji: '🥬' },
  ],
  'r5': [
    { id: 'm5-1', name: '清汤牛肉面', price: 26, calorie: 420, protein: 22, fat: 15, carbs: 50, image: '', category: '面食' },
    { id: 'm5-2', name: '红烧牛肉面', price: 28, calorie: 480, protein: 20, fat: 20, carbs: 52, image: '', category: '面食' },
    { id: 'm5-3', name: '葱油拌面', price: 18, calorie: 360, protein: 8, fat: 12, carbs: 55, image: '', category: '面食' },
    { id: 'm5-4', name: '牛肉炒饭', price: 22, calorie: 400, protein: 15, fat: 12, carbs: 55, image: '', category: '主食' },
    { id: 'm5-5', name: '凉拌牛肉', price: 32, calorie: 280, protein: 28, fat: 15, carbs: 5, image: '', category: '凉菜' },
    { id: 'm5-6', name: '酸辣土豆丝', price: 12, calorie: 100, protein: 2, fat: 4, carbs: 16, image: '', category: '凉菜' },
    { id: 'm5-7', name: '酸梅汤', price: 8, calorie: 80, protein: 0, fat: 0, carbs: 20, image: '', category: '饮品' },
    { id: 'm5-8', name: '卤蛋', price: 3, calorie: 80, protein: 6, fat: 5, carbs: 1, image: '', category: '配菜' },
    { id: 'm5-9', name: '凉拌黄瓜', price: 8, calorie: 40, protein: 1, fat: 2, carbs: 5, image: '', category: '凉菜' },
    { id: 'm5-10', name: '烤馕', price: 10, calorie: 280, protein: 6, fat: 8, carbs: 45, image: '', category: '主食' },
  ],
  'r6': [
    { id: 'm6-1', name: '辣椒炒肉', price: 28, calorie: 280, protein: 18, fat: 18, carbs: 8, image: '', category: '湘菜' },
    { id: 'm6-2', name: '剁椒鱼头', price: 58, calorie: 420, protein: 35, fat: 18, carbs: 15, image: '', category: '湘菜' },
    { id: 'm6-3', name: '小炒黄牛肉', price: 42, calorie: 320, protein: 28, fat: 15, carbs: 8, image: '', category: '湘菜' },
    { id: 'm6-4', name: '酸豆角肉末', price: 22, calorie: 200, protein: 12, fat: 12, carbs: 10, image: '', category: '湘菜' },
    { id: 'm6-5', name: '农家一碗香', price: 32, calorie: 350, protein: 20, fat: 20, carbs: 15, image: '', category: '湘菜' },
    { id: 'm6-6', name: '米饭', price: 3, calorie: 116, protein: 2.7, fat: 0.3, carbs: 25.6, image: '', category: '主食' },
    { id: 'm6-7', name: '冬瓜排骨汤', price: 28, calorie: 180, protein: 12, fat: 10, carbs: 8, image: '', category: '汤品' },
    { id: 'm6-8', name: '蒜蓉空心菜', price: 16, calorie: 80, protein: 3, fat: 4, carbs: 10, image: '', category: '时蔬' },
    { id: 'm6-9', name: '酸辣土豆丝', price: 14, calorie: 120, protein: 2, fat: 6, carbs: 16, image: '', category: '凉菜' },
    { id: 'm6-10', name: '擂辣椒皮蛋', price: 22, calorie: 160, protein: 6, fat: 12, carbs: 8, image: '', category: '凉菜' },
  ],
  'r7': [
    { id: 'm7-1', name: '鲜榨橙汁', price: 22, calorie: 120, protein: 2, fat: 0.5, carbs: 28, image: '', category: '果汁' },
    { id: 'm7-2', name: '苹果汁', price: 20, calorie: 100, protein: 0.5, fat: 0.3, carbs: 25, image: '', category: '果汁' },
    { id: 'm7-3', name: '草莓奶昔', price: 28, calorie: 220, protein: 6, fat: 8, carbs: 30, image: '', category: '奶昔' },
    { id: 'm7-4', name: '芒果冰沙', price: 26, calorie: 180, protein: 1, fat: 0.5, carbs: 45, image: '', category: '冰沙' },
    { id: 'm7-5', name: '香蕉奶昔', price: 24, calorie: 200, protein: 5, fat: 6, carbs: 32, image: '', category: '奶昔' },
    { id: 'm7-6', name: '柠檬水', price: 12, calorie: 30, protein: 0.3, fat: 0.1, carbs: 8, image: '', category: '饮品' },
    { id: 'm7-7', name: '西瓜汁', price: 18, calorie: 80, protein: 1, fat: 0.2, carbs: 18, image: '', category: '果汁' },
    { id: 'm7-8', name: '牛油果奶昔', price: 32, calorie: 280, protein: 6, fat: 18, carbs: 18, image: '', category: '奶昔' },
    { id: 'm7-9', name: '葡萄汁', price: 24, calorie: 140, protein: 1, fat: 0.2, carbs: 35, image: '', category: '果汁' },
    { id: 'm7-10', name: '蓝莓酸奶昔', price: 30, calorie: 240, protein: 8, fat: 6, carbs: 38, image: '', category: '奶昔' },
  ],
  'r8': [
    { id: 'm8-1', name: '希腊沙拉', price: 42, calorie: 280, protein: 12, fat: 20, carbs: 8, image: '', category: '沙拉' },
    { id: 'm8-2', name: '烤鸡胸肉', price: 48, calorie: 280, protein: 35, fat: 10, carbs: 2, image: '', category: '主菜' },
    { id: 'm8-3', name: '烤三文鱼', price: 58, calorie: 320, protein: 30, fat: 18, carbs: 2, image: '', category: '主菜' },
    { id: 'm8-4', name: '蔬菜汤', price: 22, calorie: 80, protein: 4, fat: 2, carbs: 12, image: '', category: '汤品' },
    { id: 'm8-5', name: '地中海烤鱼', price: 52, calorie: 300, protein: 32, fat: 12, carbs: 5, image: '', category: '主菜' },
    { id: 'm8-6', name: '鹰嘴豆沙拉', price: 32, calorie: 220, protein: 10, fat: 8, carbs: 25, image: '', category: '沙拉' },
    { id: 'm8-7', name: '全麦意面', price: 38, calorie: 380, protein: 14, fat: 6, carbs: 65, image: '', category: '主食' },
    { id: 'm8-8', name: '水果拼盘', price: 28, calorie: 150, protein: 2, fat: 0.5, carbs: 35, image: '', category: '甜点' },
    { id: 'm8-9', name: '橄榄油面包', price: 18, calorie: 200, protein: 4, fat: 8, carbs: 28, image: '', category: '主食' },
    { id: 'm8-10', name: '烤蔬菜拼盘', price: 35, calorie: 160, protein: 5, fat: 8, carbs: 18, image: '', category: '前菜' },
  ],
  'r9': [
    { id: 'm9-1', name: '增肌鸡胸饭', price: 35, calorie: 520, protein: 40, fat: 12, carbs: 55, image: '', category: '健身餐' },
    { id: 'm9-2', name: '牛肉蛋白碗', price: 42, calorie: 480, protein: 35, fat: 15, carbs: 45, image: '', category: '健身餐' },
    { id: 'm9-3', name: '三文鱼能量碗', price: 48, calorie: 450, protein: 32, fat: 18, carbs: 38, image: '', category: '健身餐' },
    { id: 'm9-4', name: '减脂鸡胸沙拉', price: 32, calorie: 280, protein: 30, fat: 8, carbs: 12, image: '', category: '减脂餐' },
    { id: 'm9-5', name: '低卡蔬菜汤', price: 18, calorie: 120, protein: 8, fat: 2, carbs: 15, image: '', category: '减脂餐' },
    { id: 'm9-6', name: '蛋白奶昔', price: 28, calorie: 200, protein: 25, fat: 3, carbs: 15, image: '', category: '饮品' },
    { id: 'm9-7', name: '燕麦能量棒', price: 15, calorie: 180, protein: 8, fat: 6, carbs: 25, image: '', category: '加餐' },
    { id: 'm9-8', name: '希腊酸奶碗', price: 22, calorie: 220, protein: 15, fat: 8, carbs: 22, image: '', category: '加餐' },
    { id: 'm9-9', name: '鸡胸肉蛋白卷', price: 30, calorie: 320, protein: 28, fat: 8, carbs: 32, image: '', category: '健身餐' },
    { id: 'm9-10', name: 'BCAA运动饮料', price: 20, calorie: 30, protein: 0, fat: 0, carbs: 7, image: '', category: '饮品' },
  ],
  'r10': [
    { id: 'm10-1', name: '有机蔬菜沙拉', price: 35, calorie: 180, protein: 8, fat: 10, carbs: 15, image: '', category: '沙拉' },
    { id: 'm10-2', name: '豆腐糙米饭', price: 28, calorie: 320, protein: 15, fat: 8, carbs: 45, image: '', category: '主食' },
    { id: 'm10-3', name: '素炒时蔬', price: 22, calorie: 120, protein: 5, fat: 6, carbs: 15, image: '', category: '时蔬' },
    { id: 'm10-4', name: '菌菇汤', price: 18, calorie: 80, protein: 6, fat: 2, carbs: 10, image: '', category: '汤品' },
    { id: 'm10-5', name: '紫薯泥', price: 15, calorie: 150, protein: 3, fat: 0.5, carbs: 35, image: '', category: '主食' },
    { id: 'm10-6', name: '凉拌海带', price: 12, calorie: 60, protein: 2, fat: 2, carbs: 10, image: '', category: '凉菜' },
    { id: 'm10-7', name: '豆浆', price: 8, calorie: 80, protein: 6, fat: 3, carbs: 8, image: '', category: '饮品' },
    { id: 'm10-8', name: '水果燕麦碗', price: 25, calorie: 250, protein: 8, fat: 6, carbs: 42, image: '', category: '加餐' },
    { id: 'm10-9', name: '素春卷', price: 18, calorie: 160, protein: 4, fat: 6, carbs: 24, image: '', category: '前菜' },
    { id: 'm10-10', name: '南瓜粥', price: 12, calorie: 100, protein: 3, fat: 0.5, carbs: 22, image: '', category: '粥品' },
  ],
  'r11': [
    { id: 'm11-1', name: '麻婆豆腐', price: 22, calorie: 220, protein: 12, fat: 14, carbs: 12, image: '', category: '川菜' },
    { id: 'm11-2', name: '宫保鸡丁', price: 32, calorie: 320, protein: 22, fat: 18, carbs: 15, image: '', category: '川菜' },
    { id: 'm11-3', name: '水煮鱼', price: 58, calorie: 420, protein: 30, fat: 25, carbs: 12, image: '', category: '川菜' },
    { id: 'm11-4', name: '回锅肉', price: 36, calorie: 380, protein: 18, fat: 28, carbs: 10, image: '', category: '川菜' },
    { id: 'm11-5', name: '鱼香肉丝', price: 30, calorie: 280, protein: 15, fat: 14, carbs: 20, image: '', category: '川菜' },
    { id: 'm11-6', name: '米饭', price: 3, calorie: 116, protein: 2.7, fat: 0.3, carbs: 25.6, image: '', category: '主食' },
    { id: 'm11-7', name: '凉拌黄瓜', price: 12, calorie: 40, protein: 1, fat: 2, carbs: 5, image: '', category: '凉菜' },
    { id: 'm11-8', name: '酸辣粉', price: 18, calorie: 380, protein: 6, fat: 12, carbs: 62, image: '', category: '面食' },
    { id: 'm11-9', name: '口水鸡', price: 38, calorie: 300, protein: 22, fat: 20, carbs: 5, image: '', category: '凉菜' },
    { id: 'm11-10', name: '担担面', price: 22, calorie: 400, protein: 12, fat: 16, carbs: 52, image: '', category: '面食' },
  ],
  'r12': [
    { id: 'm12-1', name: '西湖醋鱼', price: 58, calorie: 280, protein: 25, fat: 12, carbs: 15, image: '', category: '主菜' },
    { id: 'm12-2', name: '东坡肉', price: 48, calorie: 420, protein: 22, fat: 30, carbs: 12, image: '', category: '主菜' },
    { id: 'm12-3', name: '清炒虾仁', price: 52, calorie: 200, protein: 25, fat: 8, carbs: 6, image: '', category: '主菜' },
    { id: 'm12-4', name: '龙井虾仁', price: 68, calorie: 220, protein: 28, fat: 10, carbs: 5, image: '', category: '主菜' },
    { id: 'm12-5', name: '腌笃鲜', price: 42, calorie: 320, protein: 20, fat: 18, carbs: 12, image: '', category: '汤品' },
    { id: 'm12-6', name: '清炒时蔬', price: 18, calorie: 80, protein: 3, fat: 4, carbs: 10, image: '', category: '时蔬' },
    { id: 'm12-7', name: '米饭', price: 3, calorie: 116, protein: 2.7, fat: 0.3, carbs: 25.6, image: '', category: '主食' },
    { id: 'm12-8', name: '小笼包', price: 24, calorie: 280, protein: 10, fat: 12, carbs: 32, image: '', category: '点心' },
    { id: 'm12-9', name: '桂花糯米藕', price: 22, calorie: 200, protein: 3, fat: 2, carbs: 42, image: '', category: '甜点' },
    { id: 'm12-10', name: '葱油蚕豆', price: 16, calorie: 120, protein: 6, fat: 6, carbs: 12, image: '', category: '凉菜' },
  ],
  'r13': [
    { id: 'm13-1', name: '猪肉白菜饺子', price: 18, calorie: 380, protein: 15, fat: 12, carbs: 52, image: '', category: '饺子' },
    { id: 'm13-2', name: '韭菜鸡蛋饺子', price: 16, calorie: 340, protein: 12, fat: 10, carbs: 50, image: '', category: '饺子' },
    { id: 'm13-3', name: '三鲜饺子', price: 22, calorie: 360, protein: 18, fat: 10, carbs: 48, image: '', category: '饺子' },
    { id: 'm13-4', name: '酸菜猪肉饺子', price: 20, calorie: 370, protein: 14, fat: 14, carbs: 48, image: '', category: '饺子' },
    { id: 'm13-5', name: '锅包肉', price: 36, calorie: 380, protein: 18, fat: 22, carbs: 28, image: '', category: '东北菜' },
    { id: 'm13-6', name: '地三鲜', price: 22, calorie: 280, protein: 5, fat: 16, carbs: 28, image: '', category: '东北菜' },
    { id: 'm13-7', name: '小鸡炖蘑菇', price: 38, calorie: 320, protein: 22, fat: 18, carbs: 12, image: '', category: '东北菜' },
    { id: 'm13-8', name: '拔丝地瓜', price: 20, calorie: 350, protein: 3, fat: 8, carbs: 68, image: '', category: '甜点' },
    { id: 'm13-9', name: '大拌菜', price: 16, calorie: 120, protein: 3, fat: 8, carbs: 12, image: '', category: '凉菜' },
    { id: 'm13-10', name: '小米粥', price: 6, calorie: 80, protein: 3, fat: 1, carbs: 16, image: '', category: '粥品' },
  ],
  'r14': [
    { id: 'm14-1', name: '烤五花肉', price: 68, calorie: 480, protein: 25, fat: 35, carbs: 5, image: '', category: '烤肉' },
    { id: 'm14-2', name: '烤牛排', price: 88, calorie: 420, protein: 35, fat: 28, carbs: 2, image: '', category: '烤肉' },
    { id: 'm14-3', name: '烤鸡排', price: 48, calorie: 320, protein: 28, fat: 20, carbs: 5, image: '', category: '烤肉' },
    { id: 'm14-4', name: '海鲜饼', price: 38, calorie: 380, protein: 18, fat: 18, carbs: 35, image: '', category: '煎饼' },
    { id: 'm14-5', name: '部队锅', price: 78, calorie: 520, protein: 25, fat: 28, carbs: 40, image: '', category: '锅类' },
    { id: 'm14-6', name: '石锅拌饭', price: 38, calorie: 420, protein: 18, fat: 15, carbs: 55, image: '', category: '主食' },
    { id: 'm14-7', name: '泡菜汤', price: 22, calorie: 120, protein: 8, fat: 6, carbs: 10, image: '', category: '汤品' },
    { id: 'm14-8', name: '紫菜包饭', price: 28, calorie: 350, protein: 12, fat: 10, carbs: 52, image: '', category: '主食' },
    { id: 'm14-9', name: '韩式凉拌菜', price: 16, calorie: 80, protein: 3, fat: 4, carbs: 8, image: '', category: '凉菜' },
    { id: 'm14-10', name: '米酒', price: 18, calorie: 150, protein: 1, fat: 0, carbs: 35, image: '', category: '饮品' },
  ],
  'r15': [
    { id: 'm15-1', name: '冬阴功汤', price: 42, calorie: 180, protein: 15, fat: 8, carbs: 12, image: '', category: '汤品' },
    { id: 'm15-2', name: '绿咖喱鸡', price: 48, calorie: 380, protein: 22, fat: 22, carbs: 25, image: '', category: '主菜' },
    { id: 'm15-3', name: '泰式炒河粉', price: 36, calorie: 420, protein: 15, fat: 16, carbs: 55, image: '', category: '主食' },
    { id: 'm15-4', name: '芒果糯米饭', price: 32, calorie: 320, protein: 5, fat: 8, carbs: 58, image: '', category: '甜点' },
    { id: 'm15-5', name: '青木瓜沙拉', price: 28, calorie: 120, protein: 6, fat: 4, carbs: 18, image: '', category: '沙拉' },
    { id: 'm15-6', name: '泰式烤串', price: 38, calorie: 280, protein: 22, fat: 16, carbs: 12, image: '', category: '主菜' },
    { id: 'm15-7', name: '椰子鸡汤', price: 52, calorie: 220, protein: 18, fat: 10, carbs: 12, image: '', category: '汤品' },
    { id: 'm15-8', name: '泰式奶茶', price: 22, calorie: 180, protein: 3, fat: 6, carbs: 28, image: '', category: '饮品' },
    { id: 'm15-9', name: '春卷', price: 24, calorie: 200, protein: 8, fat: 8, carbs: 24, image: '', category: '前菜' },
    { id: 'm15-10', name: '菠萝炒饭', price: 32, calorie: 380, protein: 12, fat: 12, carbs: 55, image: '', category: '主食' },
  ],
  'r16': [
    { id: 'm16-1', name: '蒸饺', price: 10, calorie: 280, protein: 10, fat: 8, carbs: 40, image: '', category: '小吃' },
    { id: 'm16-2', name: '拌面', price: 12, calorie: 380, protein: 10, fat: 12, carbs: 58, image: '', category: '面食' },
    { id: 'm16-3', name: '扁肉', price: 8, calorie: 200, protein: 12, fat: 6, carbs: 24, image: '', category: '小吃' },
    { id: 'm16-4', name: '炖罐', price: 12, calorie: 150, protein: 15, fat: 5, carbs: 8, image: '', category: '汤品' },
    { id: 'm16-5', name: '花生汤', price: 8, calorie: 180, protein: 8, fat: 6, carbs: 24, image: '', category: '甜品' },
    { id: 'm16-6', name: '卤鸡腿', price: 8, calorie: 220, protein: 18, fat: 14, carbs: 2, image: '', category: '肉类' },
    { id: 'm16-7', name: '凉拌菜', price: 6, calorie: 60, protein: 2, fat: 3, carbs: 6, image: '', category: '凉菜' },
    { id: 'm16-8', name: '豆浆', price: 3, calorie: 60, protein: 4, fat: 2, carbs: 6, image: '', category: '饮品' },
  ],
  'r17': [
    { id: 'm17-1', name: '香菇滑鸡饭', price: 26, calorie: 420, protein: 22, fat: 12, carbs: 55, image: '', category: '套餐' },
    { id: 'm17-2', name: '排骨饭', price: 28, calorie: 450, protein: 20, fat: 16, carbs: 52, image: '', category: '套餐' },
    { id: 'm17-3', name: '鱼香肉丝饭', price: 26, calorie: 400, protein: 18, fat: 14, carbs: 50, image: '', category: '套餐' },
    { id: 'm17-4', name: '蒸蛋', price: 6, calorie: 80, protein: 6, fat: 4, carbs: 4, image: '', category: '配菜' },
    { id: 'm17-5', name: '时蔬', price: 8, calorie: 60, protein: 2, fat: 2, carbs: 8, image: '', category: '配菜' },
    { id: 'm17-6', name: '紫菜蛋花汤', price: 4, calorie: 50, protein: 3, fat: 2, carbs: 5, image: '', category: '汤品' },
    { id: 'm17-7', name: '豆浆', price: 3, calorie: 60, protein: 4, fat: 2, carbs: 6, image: '', category: '饮品' },
    { id: 'm17-8', name: '米饭', price: 3, calorie: 116, protein: 2.7, fat: 0.3, carbs: 25.6, image: '', category: '主食' },
  ],
  'r18': [
    { id: 'm18-1', name: '牛肉饭', price: 28, calorie: 480, protein: 22, fat: 16, carbs: 58, image: '', category: '套餐' },
    { id: 'm18-2', name: '鸡肉饭', price: 26, calorie: 420, protein: 20, fat: 12, carbs: 55, image: '', category: '套餐' },
    { id: 'm18-3', name: '猪肉饭', price: 26, calorie: 440, protein: 18, fat: 16, carbs: 52, image: '', category: '套餐' },
    { id: 'm18-4', name: '味噌汤', price: 8, calorie: 60, protein: 3, fat: 2, carbs: 6, image: '', category: '汤品' },
    { id: 'm18-5', name: '温泉蛋', price: 4, calorie: 80, protein: 6, fat: 5, carbs: 1, image: '', category: '配菜' },
    { id: 'm18-6', name: '沙拉', price: 12, calorie: 80, protein: 2, fat: 4, carbs: 10, image: '', category: '配菜' },
    { id: 'm18-7', name: '咖喱饭', price: 30, calorie: 520, protein: 16, fat: 18, carbs: 68, image: '', category: '套餐' },
    { id: 'm18-8', name: '绿茶', price: 3, calorie: 5, protein: 0, fat: 0, carbs: 1, image: '', category: '饮品' },
  ],
  'r19': [
    { id: 'm19-1', name: '麻辣烫（素）', price: 18, calorie: 280, protein: 10, fat: 12, carbs: 32, image: '', category: '麻辣烫' },
    { id: 'm19-2', name: '麻辣烫（荤素）', price: 28, calorie: 380, protein: 18, fat: 18, carbs: 32, image: '', category: '麻辣烫' },
    { id: 'm19-3', name: '麻辣烫（全荤）', price: 35, calorie: 420, protein: 25, fat: 28, carbs: 15, image: '', category: '麻辣烫' },
    { id: 'm19-4', name: '肥牛卷', price: 12, calorie: 200, protein: 15, fat: 14, carbs: 2, image: '', category: '荤菜' },
    { id: 'm19-5', name: '午餐肉', price: 6, calorie: 150, protein: 8, fat: 12, carbs: 4, image: '', category: '荤菜' },
    { id: 'm19-6', name: '金针菇', price: 4, calorie: 40, protein: 3, fat: 0.5, carbs: 6, image: '', category: '素菜' },
    { id: 'm19-7', name: '豆腐', price: 4, calorie: 60, protein: 6, fat: 3, carbs: 2, image: '', category: '素菜' },
    { id: 'm19-8', name: '宽粉', price: 4, calorie: 120, protein: 1, fat: 0.5, carbs: 28, image: '', category: '主食' },
  ],
  'r20': [
    { id: 'm20-1', name: '黄焖鸡米饭', price: 22, calorie: 480, protein: 22, fat: 18, carbs: 52, image: '', category: '套餐' },
    { id: 'm20-2', name: '黄焖排骨饭', price: 26, calorie: 520, protein: 20, fat: 22, carbs: 55, image: '', category: '套餐' },
    { id: 'm20-3', name: '黄焖牛肉饭', price: 28, calorie: 500, protein: 24, fat: 20, carbs: 50, image: '', category: '套餐' },
    { id: 'm20-4', name: '米饭', price: 3, calorie: 116, protein: 2.7, fat: 0.3, carbs: 25.6, image: '', category: '主食' },
    { id: 'm20-5', name: '凉拌黄瓜', price: 6, calorie: 40, protein: 1, fat: 2, carbs: 5, image: '', category: '凉菜' },
    { id: 'm20-6', name: '酸梅汤', price: 5, calorie: 80, protein: 0, fat: 0, carbs: 20, image: '', category: '饮品' },
    { id: 'm20-7', name: '卤蛋', price: 3, calorie: 80, protein: 6, fat: 5, carbs: 1, image: '', category: '配菜' },
    { id: 'm20-8', name: '青菜', price: 4, calorie: 40, protein: 2, fat: 1, carbs: 6, image: '', category: '配菜' },
  ],
};

export const SMART_RECIPES: SmartRecipe[] = [
  { id: 'sr1', name: '香煎鸡胸肉', calorie: 180, protein: 35, fat: 4, carbs: 0, description: '高蛋白低脂，增肌减脂皆宜', method: '1.鸡胸肉切片，用盐、黑胡椒、料酒腌制15分钟\n2.平底锅少油，中火煎至两面金黄\n3.出锅前撒少许柠檬汁提味', category: '蛋白质', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr2', name: '清蒸鲈鱼', calorie: 120, protein: 22, fat: 3, carbs: 0, description: '清淡鲜美，优质蛋白来源', method: '1.鲈鱼洗净，表面划刀，放姜片葱段\n2.水开后上锅蒸8-10分钟\n3.倒掉蒸鱼水，淋少许蒸鱼豉油', category: '蛋白质', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr3', name: '水煮西兰花', calorie: 55, protein: 4, fat: 0.5, carbs: 11, description: '低卡高纤，减脂必备蔬菜', method: '1.西兰花掰成小朵，盐水浸泡10分钟\n2.水开后放入西兰花煮2-3分钟\n3.捞出沥干，可蘸少许酱油食用', category: '蔬菜', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr4', name: '杂粮饭', calorie: 220, protein: 6, fat: 2, carbs: 45, description: '低GI主食，饱腹感强', method: '1.糙米、燕麦、黑米混合洗净\n2.提前浸泡2小时\n3.电饭煲正常煮饭模式', category: '主食', suitableTarget: ['fat', 'keep'] },
  { id: 'sr5', name: '蛋白炒饭', calorie: 350, protein: 22, fat: 12, carbs: 38, description: '增肌期优质碳水+蛋白组合', method: '1.米饭提前冷藏隔夜\n2.鸡蛋打散，锅中炒熟盛出\n3.少油炒饭，加入鸡蛋和少许蔬菜丁', category: '主食', suitableTarget: ['muscle', 'keep'] },
  { id: 'sr6', name: '牛油果鸡蛋吐司', calorie: 280, protein: 14, fat: 18, carbs: 18, description: '优质脂肪+蛋白，营养均衡', method: '1.全麦吐司烤至微脆\n2.牛油果捣碎涂抹在吐司上\n3.放一个水煮蛋切片，撒黑胡椒', category: '早餐', suitableTarget: ['muscle', 'keep'] },
  { id: 'sr7', name: '番茄豆腐汤', calorie: 90, protein: 8, fat: 3, carbs: 8, description: '低卡暖胃，适合加餐', method: '1.番茄切块炒出汁\n2.加入适量水和嫩豆腐\n3.煮开后加少许盐和葱花', category: '汤品', suitableTarget: ['fat', 'keep'] },
  { id: 'sr8', name: '凉拌鸡丝荞麦面', calorie: 320, protein: 25, fat: 6, carbs: 45, description: '低脂高蛋白，减脂期推荐', method: '1.荞麦面煮熟过凉水\n2.鸡胸肉煮熟撕成丝\n3.用醋、酱油、少许芝麻油拌匀', category: '主食', suitableTarget: ['fat', 'keep'] },
  { id: 'sr9', name: '烤三文鱼', calorie: 280, protein: 30, fat: 16, carbs: 0, description: '富含Omega-3，增肌减脂都适合', method: '1.三文鱼用盐、黑胡椒、柠檬腌制\n2.烤箱200度烤12-15分钟\n3.可搭配芦笋或西兰花', category: '蛋白质', suitableTarget: ['muscle', 'keep'] },
  { id: 'sr10', name: '希腊酸奶水果碗', calorie: 200, protein: 15, fat: 5, carbs: 25, description: '高蛋白低脂，适合加餐或早餐', method: '1.无糖希腊酸奶倒入碗中\n2.加入蓝莓、草莓等低糖水果\n3.撒少许坚果碎增加口感', category: '加餐', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr11', name: '牛肉蔬菜炒', calorie: 250, protein: 25, fat: 12, carbs: 10, description: '高蛋白补铁，增肌期推荐', method: '1.牛肉切薄片用淀粉腌制\n2.热锅快炒牛肉至变色盛出\n3.炒蔬菜后回锅牛肉，加少许蚝油', category: '蛋白质', suitableTarget: ['muscle', 'keep'] },
  { id: 'sr12', name: '燕麦粥', calorie: 180, protein: 6, fat: 3, carbs: 32, description: '低GI早餐，持久饱腹', method: '1.燕麦片加水或牛奶煮开\n2.小火煮3-5分钟至粘稠\n3.可加少许蜂蜜或水果调味', category: '早餐', suitableTarget: ['fat', 'keep'] },
  { id: 'sr13', name: '白灼虾', calorie: 100, protein: 20, fat: 1, carbs: 1, description: '低卡高蛋白，鲜美可口', method: '1.鲜虾去虾线洗净\n2.水开后放入姜片料酒\n3.虾变红即可捞出，蘸酱油食用', category: '蛋白质', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr14', name: '紫菜蛋花汤', calorie: 50, protein: 4, fat: 2, carbs: 5, description: '低卡暖胃，简单快手', method: '1.水烧开放入紫菜\n2.淋入打散的蛋液\n3.加少许盐和香油', category: '汤品', suitableTarget: ['fat', 'keep'] },
  { id: 'sr15', name: '清炒菠菜', calorie: 60, protein: 3, fat: 3, carbs: 6, description: '补铁补维生素，低卡蔬菜', method: '1.菠菜洗净焯水30秒\n2.热锅少油，大火快炒\n3.加少许盐和蒜末调味', category: '蔬菜', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr16', name: '蒸鸡蛋羹', calorie: 80, protein: 7, fat: 5, carbs: 1, description: '嫩滑可口，老少皆宜', method: '1.鸡蛋打散加1.5倍温水\n2.过滤去泡沫\n3.盖上保鲜膜蒸10分钟', category: '蛋白质', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr17', name: '红薯粥', calorie: 150, protein: 3, fat: 0.5, carbs: 34, description: '低GI粗粮粥，养胃暖身', method: '1.红薯去皮切块\n2.大米洗净加适量水\n3.煮开后放入红薯块，小火熬30分钟', category: '主食', suitableTarget: ['fat', 'keep'] },
  { id: 'sr18', name: '凉拌木耳', calorie: 50, protein: 2, fat: 2, carbs: 8, description: '清肠刮油，低卡凉菜', method: '1.木耳泡发焯水2分钟\n2.加蒜末、醋、少许香油\n3.拌匀即可，清爽开胃', category: '凉菜', suitableTarget: ['fat', 'keep'] },
  { id: 'sr19', name: '鸡胸肉蔬菜卷', calorie: 200, protein: 22, fat: 6, carbs: 15, description: '便携高蛋白，适合带餐', method: '1.鸡胸肉煮熟撕成丝\n2.蔬菜切丝（黄瓜、胡萝卜）\n3.用春卷皮包好，蘸酱食用', category: '主食', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr20', name: '豆腐蔬菜炒', calorie: 120, protein: 10, fat: 6, carbs: 8, description: '植物蛋白+维生素，素食优选', method: '1.豆腐切块煎至微黄\n2.加入各种蔬菜翻炒\n3.加少许酱油和盐调味', category: '蛋白质', suitableTarget: ['fat', 'keep'] },
  { id: 'sr21', name: '香蕉蛋白松饼', calorie: 250, protein: 15, fat: 6, carbs: 35, description: '健身早餐，快速补充能量', method: '1.香蕉捣碎加鸡蛋燕麦\n2.平底锅小火煎成松饼\n3.可搭配少许蜂蜜或果酱', category: '早餐', suitableTarget: ['muscle', 'keep'] },
  { id: 'sr22', name: '冬瓜排骨汤', calorie: 180, protein: 15, fat: 8, carbs: 8, description: '清热利尿，营养滋补', method: '1.排骨焯水去血沫\n2.加入冬瓜块和姜片\n3.大火煮开转小火炖1小时', category: '汤品', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr23', name: '虾仁炒蛋', calorie: 160, protein: 22, fat: 6, carbs: 3, description: '高蛋白低脂，快手家常菜', method: '1.虾仁用料酒腌制\n2.鸡蛋打散炒至半熟\n3.加入虾仁翻炒至变色', category: '蛋白质', suitableTarget: ['fat', 'muscle', 'keep'] },
  { id: 'sr24', name: '糙米蔬菜饭', calorie: 280, protein: 8, fat: 4, carbs: 52, description: '高纤低GI，减脂期主食', method: '1.糙米提前浸泡2小时\n2.电饭煲中加入蔬菜丁\n3.正常煮饭即可', category: '主食', suitableTarget: ['fat', 'keep'] },
];

export const LOW_CAL_RECIPES: LowCalRecipe[] = [
  { id: 'lc1', name: '水煮蛋', calorie: 70, protein: 6, fat: 5, carbs: 0.5, method: '1.鸡蛋冷水下锅\n2.水开后煮8分钟\n3.过凉水剥壳即可', category: '蛋白质' },
  { id: 'lc2', name: '黄瓜拌木耳', calorie: 45, protein: 2, fat: 1, carbs: 8, method: '1.木耳泡发焯水\n2.黄瓜拍碎切块\n3.加醋、蒜末、少许香油拌匀', category: '凉菜' },
  { id: 'lc3', name: '番茄炒蛋', calorie: 120, protein: 8, fat: 6, carbs: 10, method: '1.鸡蛋打散炒熟盛出\n2.番茄切块炒出汁\n3.加入鸡蛋翻炒，加少许盐', category: '家常菜' },
  { id: 'lc4', name: '蒸红薯', calorie: 100, protein: 2, fat: 0.2, carbs: 23, method: '1.红薯洗净不去皮\n2.蒸锅大火蒸20-25分钟\n3.用筷子能轻松插入即可', category: '主食' },
  { id: 'lc5', name: '凉拌菠菜', calorie: 40, protein: 3, fat: 1, carbs: 5, method: '1.菠菜焯水30秒捞出\n2.过凉水挤干切段\n3.加蒜末、醋、少许酱油拌匀', category: '凉菜' },
  { id: 'lc6', name: '紫菜蛋花汤', calorie: 50, protein: 4, fat: 2, carbs: 5, method: '1.水烧开放入紫菜\n2.淋入打散的蛋液\n3.加少许盐和香油', category: '汤品' },
  { id: 'lc7', name: '蒸玉米', calorie: 110, protein: 3, fat: 1.5, carbs: 24, method: '1.玉米剥去外皮留一层\n2.蒸锅水开后放入\n3.大火蒸15-20分钟', category: '主食' },
  { id: 'lc8', name: '凉拌豆腐', calorie: 60, protein: 6, fat: 3, carbs: 2, method: '1.嫩豆腐切块摆盘\n2.淋上酱油、醋、香油\n3.撒葱花和少许辣椒', category: '凉菜' },
  { id: 'lc9', name: '清炒冬瓜', calorie: 35, protein: 1, fat: 1, carbs: 6, method: '1.冬瓜去皮切薄片\n2.少油大火快炒\n3.加少许盐和蒜末调味', category: '蔬菜' },
  { id: 'lc10', name: '苹果', calorie: 52, protein: 0.3, fat: 0.2, carbs: 13.5, method: '洗净直接食用，建议带皮吃保留更多膳食纤维', category: '水果' },
  { id: 'lc11', name: '无糖豆浆', calorie: 35, protein: 3, fat: 1.5, carbs: 1, method: '1.黄豆提前浸泡8小时\n2.加水放入豆浆机\n3.选择豆浆模式，滤渣后饮用', category: '饮品' },
  { id: 'lc12', name: '凉拌海带丝', calorie: 30, protein: 1, fat: 0.5, carbs: 6, method: '1.干海带泡发切丝\n2.焯水2分钟捞出过凉\n3.加醋、蒜末、少许辣椒油拌匀', category: '凉菜' },
  { id: 'lc13', name: '白灼菜心', calorie: 40, protein: 3, fat: 0.5, carbs: 7, method: '1.菜心洗净\n2.沸水中焯1分钟\n3.淋少许蒸鱼豉油即可', category: '蔬菜' },
  { id: 'lc14', name: '蒸南瓜', calorie: 45, protein: 1, fat: 0.2, carbs: 10, method: '1.南瓜去皮切块\n2.蒸锅大火蒸15分钟\n3.软糯即可，天然甜味无需加糖', category: '主食' },
  { id: 'lc15', name: '小番茄', calorie: 25, protein: 1, fat: 0.3, carbs: 5, method: '洗净直接食用，富含番茄红素和维生素C', category: '水果' },
  { id: 'lc16', name: '茶叶蛋', calorie: 75, protein: 6, fat: 5, carbs: 1, method: '1.鸡蛋煮熟敲裂外壳\n2.放入茶叶、酱油、八角煮\n3.浸泡2小时以上更入味', category: '加餐' },
  { id: 'lc17', name: '凉拌金针菇', calorie: 35, protein: 3, fat: 0.5, carbs: 6, method: '1.金针菇去根焯水2分钟\n2.过凉水挤干\n3.加蒜末、醋、少许辣椒油拌匀', category: '凉菜' },
  { id: 'lc18', name: '芹菜炒香干', calorie: 80, protein: 6, fat: 4, carbs: 5, method: '1.芹菜切段，香干切片\n2.少油炒香干至微黄\n3.加入芹菜翻炒，加盐调味', category: '家常菜' },
  { id: 'lc19', name: '白灼虾', calorie: 100, protein: 20, fat: 1, carbs: 1, method: '1.鲜虾去虾线洗净\n2.水开后放入姜片料酒\n3.虾变红即可捞出', category: '蛋白质' },
  { id: 'lc20', name: '蒸鸡蛋羹', calorie: 80, protein: 7, fat: 5, carbs: 1, method: '1.鸡蛋打散加温水\n2.过滤去泡沫\n3.蒸10分钟至凝固', category: '蛋白质' },
  { id: 'lc21', name: '凉拌黄瓜', calorie: 30, protein: 1, fat: 1, carbs: 5, method: '1.黄瓜拍碎切段\n2.加蒜末、醋、少许盐\n3.拌匀即可食用', category: '凉菜' },
  { id: 'lc22', name: '小米粥', calorie: 80, protein: 3, fat: 1, carbs: 16, method: '1.小米洗净\n2.加水大火煮开\n3.转小火熬20分钟', category: '主食' },
  { id: 'lc23', name: '清炒生菜', calorie: 35, protein: 2, fat: 1, carbs: 5, method: '1.生菜洗净\n2.热锅少油大火快炒\n3.加少许盐调味', category: '蔬菜' },
  { id: 'lc24', name: '香蕉', calorie: 90, protein: 1, fat: 0.3, carbs: 23, method: '剥皮直接食用，运动前后补充能量', category: '水果' },
  { id: 'lc25', name: '酸奶', calorie: 70, protein: 4, fat: 2, carbs: 9, method: '选择无糖或低糖酸奶，可加少许水果', category: '饮品' },
  { id: 'lc26', name: '豆腐脑', calorie: 60, protein: 5, fat: 3, carbs: 3, method: '1.内酯豆腐放入碗中\n2.淋上酱油、香油\n3.加榨菜末和葱花', category: '早餐' },
  { id: 'lc27', name: '凉拌西红柿', calorie: 40, protein: 1, fat: 0.5, carbs: 9, method: '1.西红柿切块\n2.加少许白糖\n3.冷藏后食用更佳', category: '凉菜' },
  { id: 'lc28', name: '煮花生', calorie: 90, protein: 5, fat: 5, carbs: 6, method: '1.花生洗净加盐\n2.水开后煮30分钟\n3.浸泡2小时更入味', category: '加餐' },
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
  return filtered.slice(0, 10);
};

export const getLowCalorieMenuItems = (restaurantId: string, maxCalorie: number): MenuItem[] => {
  const menu = RESTAURANT_MENUS[restaurantId] || [];
  return menu.filter(item => item.calorie <= maxCalorie).sort((a, b) => a.calorie - b.calorie);
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
    { name: '鸡胸肉沙拉', calorie: 320, protein: 32, fat: 12, carbs: 10, description: '水煮鸡胸肉配新鲜蔬菜，少油少盐', image: '' },
    { name: '清蒸鱼+杂粮饭', calorie: 400, protein: 28, fat: 8, carbs: 50, description: '清蒸鲈鱼配杂粮饭，清淡营养', image: '' },
    { name: '蔬菜豆腐汤', calorie: 150, protein: 12, fat: 4, carbs: 15, description: '清淡蔬菜豆腐汤，低热量高营养', image: '' },
    { name: '全麦三明治', calorie: 300, protein: 18, fat: 10, carbs: 35, description: '全麦面包+鸡胸肉+蔬菜，快捷健康', image: '' },
    { name: '凉拌鸡丝荞麦面', calorie: 380, protein: 22, fat: 8, carbs: 55, description: '低脂高蛋白，饱腹感强', image: '' },
    { name: '虾仁炒蛋', calorie: 160, protein: 22, fat: 6, carbs: 3, description: '高蛋白低脂，快手家常菜', image: '' },
    { name: '烤三文鱼', calorie: 280, protein: 30, fat: 16, carbs: 0, description: '富含Omega-3，增肌减脂都适合', image: '' },
    { name: '牛肉蔬菜炒', calorie: 250, protein: 25, fat: 12, carbs: 10, description: '高蛋白补铁，增肌期推荐', image: '' },
  ];
  cookOptions.forEach(option => {
    if (option.calorie <= remainingCalorie + 100) {
      recommendations.push({ ...option, type: 'cook' as const });
    }
  });
  RESTAURANTS.slice(0, 6).forEach(restaurant => {
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
  return recommendations.slice(0, 8);
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

export const getCategories = (): string[] => {
  return [...new Set(SMART_RECIPES.map(r => r.category))];
};
