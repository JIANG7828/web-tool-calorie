const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');

var RECIPES = [
  { id: 'c_b_1', name: '小米南瓜粥', category: 'chinese', mealType: 'breakfast', calorie: 95, protein: 3, fat: 0.5, carbs: 20, description: '养胃健脾，早餐暖胃首选', method: '1.小米100g洗净备用\n2.南瓜200g去皮切块\n3.锅中加水800ml烧开\n4.放入小米煮10分钟\n5.加入南瓜块再煮15分钟\n6.南瓜软烂即可出锅', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 25, image: '' },
  { id: 'c_b_2', name: '鲜肉小馄饨', category: 'chinese', mealType: 'breakfast', calorie: 280, protein: 12, fat: 8, carbs: 38, description: '皮薄馅嫩，汤鲜味美', method: '1.猪肉馅200g加姜末、葱花、盐调味\n2.馄饨皮包馅捏合\n3.锅中烧水，下馄饨煮3分钟\n4.碗底放紫菜、虾皮、香油、盐\n5.连汤盛入碗中即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },
  { id: 'c_b_3', name: '韭菜鸡蛋饺子', category: 'chinese', mealType: 'breakfast', calorie: 320, protein: 14, fat: 10, carbs: 42, description: '家常经典，鲜香可口', method: '1.韭菜300g洗净切碎\n2.鸡蛋3个炒熟切碎\n3.韭菜加鸡蛋、盐、香油拌匀\n4.饺子皮包馅捏紧\n5.水开后下饺子煮3-5分钟\n6.饺子浮起即可捞出', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'medium', cookTime: 20, image: '' },
  { id: 'c_b_4', name: '鸡蛋灌饼', category: 'chinese', mealType: 'breakfast', calorie: 350, protein: 12, fat: 15, carbs: 40, description: '酥脆可口，早餐人气王', method: '1.手抓饼1张平底锅煎至半熟\n2.打入鸡蛋1个在饼上摊开\n3.饼鼓起后戳小洞让蛋液流入\n4.翻面煎至金黄\n5.刷上甜面酱或辣酱\n6.加生菜叶卷起即可', suitableTarget: ['muscle', 'keep'], difficulty: 'easy', cookTime: 8, image: '' },
  { id: 'c_b_5', name: '肠粉', category: 'chinese', mealType: 'breakfast', calorie: 200, protein: 8, fat: 5, carbs: 32, description: '广式早茶，嫩滑爽弹', method: '1.粘米粉200g加水调成米浆\n2.蒸盘刷油，倒入薄薄一层米浆\n3.可加蛋液、肉末、虾仁\n4.大火蒸2-3分钟至透明\n5.刮下卷起装盘\n6.淋上酱油、熟油即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'medium', cookTime: 15, image: '' },

  { id: 'c_l_1', name: '红烧鸡块', category: 'chinese', mealType: 'lunch', calorie: 280, protein: 28, fat: 14, carbs: 8, description: '酱香浓郁，下饭神器', method: '1.鸡腿肉500g切块焯水\n2.锅中少油炒糖色至枣红色\n3.下鸡块翻炒上色\n4.加料酒2勺、生抽3勺、老抽1勺\n5.加开水没过鸡块，小火炖20分钟\n6.大火收汁，撒葱花出锅', suitableTarget: ['muscle', 'keep'], difficulty: 'medium', cookTime: 35, image: '' },
  { id: 'c_l_2', name: '番茄炒蛋', category: 'chinese', mealType: 'lunch', calorie: 160, protein: 12, fat: 10, carbs: 8, description: '经典家常菜，酸甜可口', method: '1.番茄2个切块，鸡蛋3个打散\n2.锅中少油炒蛋至凝固盛出\n3.锅中加油炒番茄至出汁\n4.加盐、糖调味\n5.倒入炒蛋翻炒均匀\n6.撒葱花出锅', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },
  { id: 'c_l_3', name: '宫保鸡丁', category: 'chinese', mealType: 'lunch', calorie: 250, protein: 26, fat: 14, carbs: 8, description: '川菜经典，麻辣鲜香', method: '1.鸡胸肉300g切丁，加料酒、淀粉腌制\n2.调宫保汁：生抽2勺、醋1勺、糖1勺、淀粉适量\n3.热锅凉油，下鸡丁炒至变色盛出\n4.锅留底油，炒香花椒、干辣椒\n5.加黄瓜丁、胡萝卜丁翻炒\n6.倒回鸡丁和宫保汁翻炒均匀\n7.加入花生米出锅', suitableTarget: ['muscle', 'keep'], difficulty: 'medium', cookTime: 15, image: '' },
  { id: 'c_l_4', name: '青椒肉丝', category: 'chinese', mealType: 'lunch', calorie: 200, protein: 22, fat: 10, carbs: 6, description: '家常快手菜，清爽下饭', method: '1.猪肉200g切丝，加淀粉、生抽腌制\n2.青椒2个切丝\n3.热锅凉油，下肉丝炒至变色盛出\n4.锅中加油炒青椒丝至断生\n5.倒回肉丝翻炒均匀\n6.加盐、鸡精调味出锅', suitableTarget: ['muscle', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },
  { id: 'c_l_5', name: '麻婆豆腐', category: 'chinese', mealType: 'lunch', calorie: 180, protein: 12, fat: 12, carbs: 8, description: '川菜经典，麻辣嫩滑', method: '1.嫩豆腐切块焯水\n2.锅中少油炒香豆瓣酱和花椒粉\n3.加肉末50g炒散\n4.倒入豆腐块轻轻翻炒\n5.加适量水，中小火煮3分钟\n6.勾薄芡，撒葱花、花椒粉出锅', suitableTarget: ['fat', 'keep'], difficulty: 'medium', cookTime: 15, image: '' },
  { id: 'c_l_6', name: '清蒸鲈鱼', category: 'chinese', mealType: 'lunch', calorie: 120, protein: 20, fat: 4, carbs: 0, description: '鲜嫩清淡，营养保留最佳', method: '1.鲈鱼1条处理干净，鱼身划几刀\n2.盘底铺姜片、葱段，放鲈鱼\n3.鱼身上放姜片、葱段\n4.水开后大火蒸8-10分钟\n5.倒掉蒸出的汤汁，去掉姜葱\n6.淋蒸鱼豉油，撒葱丝\n7.烧热油淋在葱丝上激发出香味', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'c_l_7', name: '红烧排骨', category: 'chinese', mealType: 'lunch', calorie: 320, protein: 24, fat: 22, carbs: 6, description: '酱香入味，肉质酥烂', method: '1.排骨500g切段焯水\n2.锅中少油炒糖色\n3.下排骨翻炒上色\n4.加料酒、生抽、老抽、八角\n5.加开水没过排骨，大火烧开\n6.转小火炖30分钟\n7.大火收汁至浓稠', suitableTarget: ['muscle', 'keep'], difficulty: 'medium', cookTime: 45, image: '' },

  { id: 'c_d_1', name: '清炒时蔬', category: 'chinese', mealType: 'dinner', calorie: 80, protein: 4, fat: 3, carbs: 8, description: '清爽健康，晚餐好搭档', method: '1.时令蔬菜300g洗净切段\n2.锅中少油，下蒜末爆香\n3.放入蔬菜大火翻炒\n4.加盐、鸡精调味\n5.翻炒至断生即可出锅', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 5, image: '' },
  { id: 'c_d_2', name: '蒸水蛋', category: 'chinese', mealType: 'dinner', calorie: 90, protein: 8, fat: 6, carbs: 2, description: '嫩滑细腻，易消化', method: '1.鸡蛋3个打散，加温水1.5倍\n2.加少许盐搅拌均匀\n3.过滤蛋液去除泡沫\n4.盖上保鲜膜扎几个小孔\n5.水开后中火蒸8分钟\n6.淋少许香油和生抽', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },
  { id: 'c_d_3', name: '紫菜蛋花汤', category: 'chinese', mealType: 'dinner', calorie: 60, protein: 6, fat: 3, carbs: 4, description: '暖胃简单，快手汤品', method: '1.干紫菜一小块温水泡发\n2.锅中加水500ml烧开\n3.放入紫菜煮2分钟\n4.鸡蛋1个打散缓缓倒入锅中\n5.蛋花浮起后加盐、香油调味\n6.撒葱花出锅', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 5, image: '' },
  { id: 'c_d_4', name: '凉拌黄瓜', category: 'chinese', mealType: 'dinner', calorie: 45, protein: 1, fat: 2, carbs: 5, description: '爽口开胃，减脂首选', method: '1.黄瓜2根拍碎切段\n2.蒜末、小米椒切圈\n3.调汁：生抽2勺、醋1勺、香油、糖少许\n4.将汁倒入黄瓜中拌匀\n5.冷藏10分钟更爽口', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 5, image: '' },
  { id: 'c_d_5', name: '小米粥', category: 'chinese', mealType: 'dinner', calorie: 70, protein: 2, fat: 0.5, carbs: 15, description: '养胃安神，助眠佳品', method: '1.小米100g洗净\n2.锅中加水800ml烧开\n3.放入小米大火煮开\n4.转小火熬20分钟\n5.煮至粘稠即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 25, image: '' },

  { id: 'l_b_1', name: '牛油果吐司', category: 'light', mealType: 'breakfast', calorie: 250, protein: 8, fat: 14, carbs: 24, description: '健康脂肪，早餐新选择', method: '1.全麦吐司2片烤至微脆\n2.牛油果1个去核，果肉捣成泥\n3.加柠檬汁、黑胡椒、盐调味\n4.涂抹在吐司上\n5.可加水煮蛋切片装饰', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 5, image: '' },
  { id: 'l_b_2', name: '希腊酸奶碗', category: 'light', mealType: 'breakfast', calorie: 180, protein: 15, fat: 6, carbs: 18, description: '高蛋白，清爽开启一天', method: '1.希腊酸奶200g放入碗中\n2.加入燕麦片30g\n3.撒蓝莓、草莓等新鲜水果\n4.淋少许蜂蜜\n5.可加奇亚籽增加纤维', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 3, image: '' },
  { id: 'l_b_3', name: '蔬菜鸡蛋卷', category: 'light', mealType: 'breakfast', calorie: 200, protein: 14, fat: 12, carbs: 8, description: '低卡高蛋白，营养均衡', method: '1.鸡蛋3个打散，加盐和黑胡椒\n2.平底锅刷薄油，倒入蛋液摊平\n3.铺上菠菜碎、胡萝卜丝\n4.蛋液凝固后卷起\n5.切段装盘即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 8, image: '' },
  { id: 'l_b_4', name: '全麦三明治', category: 'light', mealType: 'breakfast', calorie: 280, protein: 16, fat: 10, carbs: 30, description: '营养均衡，便携早餐', method: '1.全麦面包2片\n2.煎鸡蛋1个，火腿片2片\n3.生菜叶2片，番茄2片\n4.涂抹低脂蛋黄酱\n5.层层叠放，对角切开\n6.可加芝士片增加风味', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 5, image: '' },
  { id: 'l_b_5', name: '燕麦香蕉饼', category: 'light', mealType: 'breakfast', calorie: 220, protein: 8, fat: 6, carbs: 34, description: '天然甜味，健康饱腹', method: '1.燕麦片60g用牛奶泡10分钟\n2.香蕉1根捣成泥\n3.鸡蛋1个打散加入\n4.平底锅刷薄油，舀入面糊摊成小饼\n5.小火每面煎2分钟\n6.可淋少许蜂蜜或枫糖浆', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },

  { id: 'l_l_1', name: '香煎鸡胸肉沙拉', category: 'light', mealType: 'lunch', calorie: 220, protein: 32, fat: 8, carbs: 6, description: '增肌减脂经典搭配', method: '1.鸡胸肉150g切片，用盐、黑胡椒、橄榄油腌制\n2.平底锅煎鸡胸至两面金黄\n3.混合生菜、小番茄、黄瓜\n4.将鸡胸切片放于蔬菜上\n5.淋柠檬汁和橄榄油\n6.撒黑胡椒即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'l_l_2', name: '藜麦蔬菜碗', category: 'light', mealType: 'lunch', calorie: 250, protein: 12, fat: 8, carbs: 32, description: '超级食物，全面营养', method: '1.藜麦100g洗净，加水煮15分钟\n2.烤南瓜块、西兰花焯水\n3.碗中铺藜麦\n4.放南瓜、西兰花、牛油果片\n5.撒芝麻、坚果碎\n6.淋柠檬汁和橄榄油', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 20, image: '' },
  { id: 'l_l_3', name: '金枪鱼沙拉', category: 'light', mealType: 'lunch', calorie: 200, protein: 28, fat: 8, carbs: 6, description: '高蛋白低脂，清爽美味', method: '1.水浸金枪鱼罐头1罐沥干\n2.混合生菜、紫甘蓝、玉米粒\n3.金枪鱼撕碎放入\n4.加小番茄、黄瓜丁\n5.调汁：柠檬汁、橄榄油、盐、黑胡椒\n6.拌匀即可食用', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 5, image: '' },
  { id: 'l_l_4', name: '牛油果鸡肉卷', category: 'light', mealType: 'lunch', calorie: 280, protein: 24, fat: 16, carbs: 12, description: '丰富口感，饱腹感强', method: '1.全麦饼皮1张\n2.鸡胸肉煮熟撕成丝\n3.牛油果切片\n4.饼皮上放生菜、鸡肉丝、牛油果\n5.挤少许低脂沙拉酱\n6.卷紧切段即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'l_l_5', name: '豆腐蔬菜锅', category: 'light', mealType: 'lunch', calorie: 180, protein: 14, fat: 8, carbs: 12, description: '暖身饱腹，低卡高纤', method: '1.嫩豆腐切块\n2.白菜、蘑菇、金针菇切好\n3.锅中加水或高汤烧开\n4.先放入豆腐煮3分钟\n5.加入蔬菜煮至断生\n6.加盐、白胡椒调味\n7.可加少许芝麻油提香', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'l_l_6', name: '鲜虾藜麦沙拉', category: 'light', mealType: 'lunch', calorie: 230, protein: 26, fat: 8, carbs: 16, description: '鲜甜清爽，营养满分', method: '1.藜麦80g煮熟放凉\n2.虾仁100g煮熟或煎熟\n3.混合苦苣、樱桃番茄、黄瓜\n4.加入藜麦和虾仁\n5.淋柠檬油醋汁\n6.撒少许芝士碎', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'l_l_7', name: '鲜虾牛油果手卷', category: 'light', mealType: 'lunch', calorie: 280, protein: 20, fat: 16, carbs: 18, description: '清新爽脆，日式轻食', method: '1.寿司海苔1张铺平\n2.醋饭60g铺在海苔上\n3.虾仁5个、牛油果片、黄瓜条\n4.挤少许是拉差辣酱\n5.从一端卷成锥形\n6.即刻享用', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },

  { id: 'l_d_1', name: '凯撒沙拉', category: 'light', mealType: 'dinner', calorie: 180, protein: 10, fat: 12, carbs: 10, description: '经典西式沙拉，清爽低卡', method: '1.罗马生菜洗净撕成小块\n2.烤面包丁：吐司切块，烤箱180度烤5分钟\n3.调凯撒酱：蛋黄+柠檬汁+蒜末+橄榄油+帕玛森芝士\n4.生菜拌上酱汁\n5.放上面包丁和芝士碎', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },
  { id: 'l_d_2', name: '蒸蛋配蔬菜', category: 'light', mealType: 'dinner', calorie: 100, protein: 10, fat: 6, carbs: 4, description: '嫩滑如布丁，轻盈晚餐', method: '1.鸡蛋2个加温水1:1.5\n2.加少许盐搅匀过滤\n3.碗底铺一层蔬菜丁\n4.倒入蛋液\n5.盖上保鲜膜蒸8分钟\n6.淋几滴香油', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 12, image: '' },
  { id: 'l_d_3', name: '凉拌鸡丝荞麦面', category: 'light', mealType: 'dinner', calorie: 220, protein: 22, fat: 6, carbs: 24, description: '清爽低脂，饱腹感强', method: '1.荞麦面80g煮熟过凉水\n2.鸡胸肉煮熟撕成丝\n3.黄瓜切丝，蒜末备好\n4.调汁：生抽、醋、香油、蒜末、辣椒油少许\n5.面条、鸡丝、黄瓜丝拌匀\n6.淋上调味汁即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'l_d_4', name: '烤三文鱼配芦笋', category: 'light', mealType: 'dinner', calorie: 260, protein: 28, fat: 16, carbs: 4, description: 'Omega-3丰富，晚餐佳品', method: '1.三文鱼150g用盐、柠檬汁腌制\n2.芦笋200g去老根\n3.烤盘铺锡纸，放三文鱼和芦笋\n4.刷橄榄油，撒黑胡椒\n5.烤箱200度烤12-15分钟\n6.挤柠檬汁即可', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 20, image: '' },
  { id: 'l_d_5', name: '鸡丝沙拉', category: 'light', mealType: 'dinner', calorie: 180, protein: 24, fat: 8, carbs: 6, description: '高蛋白低脂，增肌必备', method: '1.鸡胸肉150g煮熟撕成丝\n2.混合生菜、芝麻菜、苦菊\n3.加小番茄、黄瓜片、紫甘蓝丝\n4.调柠檬蜂蜜汁：柠檬汁+蜂蜜+橄榄油\n5.所有食材拌匀\n6.撒少许帕玛森芝士碎', suitableTarget: ['fat', 'muscle', 'keep'], difficulty: 'easy', cookTime: 15, image: '' },
  { id: 'l_d_6', name: '豆腐海带味噌汤', category: 'light', mealType: 'dinner', calorie: 70, protein: 6, fat: 3, carbs: 5, description: '日式经典，暖身轻食', method: '1.嫩豆腐切小块\n2.干海带芽泡发\n3.味增1大勺用少许温水化开\n4.锅中水500ml烧开，下豆腐煮2分钟\n5.关火，倒入味增汤搅匀\n6.撒葱花和海带芽', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 10, image: '' },
  { id: 'l_d_7', name: '越南春卷', category: 'light', mealType: 'dinner', calorie: 150, protein: 12, fat: 4, carbs: 18, description: '清爽透明，越式风情', method: '1.越南米纸用温水泡软\n2.虾仁煮熟对半切开\n3.米粉煮熟沥干\n4.薄荷叶、生菜、黄瓜丝备好\n5.米纸上放食材，两边折起后卷紧\n6.配鱼露或花生酱蘸食', suitableTarget: ['fat', 'keep'], difficulty: 'medium', cookTime: 20, image: '' },
  { id: 'l_d_8', name: '烤南瓜藜麦沙拉', category: 'light', mealType: 'dinner', calorie: 210, protein: 10, fat: 8, carbs: 28, description: '甜糯南瓜搭配藜麦，饱腹又美味', method: '1.南瓜300g切块，刷橄榄油\n2.烤箱200度烤25分钟至软糯\n3.藜麦80g煮熟放凉\n4.混合生菜、烤南瓜、藜麦\n5.撒核桃碎、南瓜籽\n6.淋枫糖芥末汁调味', suitableTarget: ['fat', 'keep'], difficulty: 'easy', cookTime: 30, image: '' }
];

var DIFFICULTY_MAP = { easy: '简单', medium: '中等', hard: '困难' };
var CATEGORY_MAP = { chinese: '中餐', light: '轻食' };
var MEAL_TYPE_MAP = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };

Page({
  data: {
    recipes: [],
    filteredRecipes: [],
    searchKeyword: '',
    selectedCategory: 'all',
    selectedMealType: 'all',
    showDetail: false,
    selectedRecipe: null,
    showMealPlan: false,
    mealPlan: [],
    mealPlanName: '',
    savedMealPlans: [],
    showCreatePlan: false,
    aiRecommendation: null,
    aiLoading: false,
    userTarget: 'keep',
    categoryTabs: [
      { value: 'all', label: '全部' },
      { value: 'chinese', label: '中餐' },
      { value: 'light', label: '轻食' }
    ],
    mealTypeTabs: [
      { value: 'all', label: '全部' },
      { value: 'breakfast', label: '早餐' },
      { value: 'lunch', label: '午餐' },
      { value: 'dinner', label: '晚餐' }
    ],
    showToast: false,
    toastMessage: '',
    showSearchBar: false,
    favorites: [],
    // 餐单日历相关
    showCalendar: false,
    calendarYear: 0,
    calendarMonth: 0,
    calendarDays: [],
    selectedCalendarDate: '',
    calendarMealPlan: null,
    savedDayPlans: []
  },

  onLoad: function() {
    this.setData({ recipes: RECIPES, filteredRecipes: RECIPES });
    this.loadMealPlans();
    this.loadFavorites();
    this.loadUserTarget();
  },

  loadUserTarget: function() {
    var settings = dataStore.getUserSettings();
    this.setData({ userTarget: settings.target || 'keep' });
  },

  loadMealPlans: function() {
    var plans = wx.getStorageSync('recipe_meal_plans') || [];
    var dayPlans = wx.getStorageSync('saved_meal_plans') || [];
    this.setData({ savedMealPlans: plans, savedDayPlans: dayPlans });
  },

  loadFavorites: function() {
    var favs = wx.getStorageSync('recipe_favorites') || [];
    this.setData({ favorites: favs });
  },

  filterRecipes: function() {
    var category = this.data.selectedCategory;
    var mealType = this.data.selectedMealType;
    var keyword = this.data.searchKeyword;
    var filtered = this.data.recipes.filter(function(r) {
      var matchCategory = category === 'all' || r.category === category;
      var matchMealType = mealType === 'all' || r.mealType === mealType;
      var matchKeyword = !keyword || r.name.indexOf(keyword) !== -1 || r.description.indexOf(keyword) !== -1;
      return matchCategory && matchMealType && matchKeyword;
    });
    this.setData({ filteredRecipes: filtered });
  },

  onCategoryChange: function(e) {
    var category = e.currentTarget.dataset.value;
    this.setData({ selectedCategory: category }, function() {
      this.filterRecipes();
    });
  },

  onMealTypeChange: function(e) {
    var mealType = e.currentTarget.dataset.value;
    this.setData({ selectedMealType: mealType }, function() {
      this.filterRecipes();
    });
  },

  onSearch: function(e) {
    this.setData({ searchKeyword: e.detail.value }, function() {
      this.filterRecipes();
    });
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm: function() {
    this.filterRecipes();
  },

  onClearSearch: function() {
    this.setData({ searchKeyword: '', showSearchBar: false }, function() {
      this.filterRecipes();
    });
  },

  toggleSearchBar: function() {
    this.setData({ showSearchBar: !this.data.showSearchBar });
  },

  showRecipeDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var recipe = this.data.recipes.find(function(r) { return r.id === id; });
    if (recipe) {
      var methodSteps = recipe.method.split('\n').filter(function(s) { return s.trim(); });
      this.setData({
        selectedRecipe: {
          id: recipe.id,
          name: recipe.name,
          category: recipe.category,
          mealType: recipe.mealType,
          calorie: recipe.calorie,
          protein: recipe.protein,
          fat: recipe.fat,
          carbs: recipe.carbs,
          description: recipe.description,
          method: recipe.method,
          methodSteps: methodSteps,
          suitableTarget: recipe.suitableTarget,
          difficulty: recipe.difficulty,
          cookTime: recipe.cookTime
        },
        showDetail: true
      });
    }
  },

  closeDetail: function() {
    this.setData({ showDetail: false, selectedRecipe: null });
  },

  toggleFavorite: function(e) {
    var id = e.currentTarget.dataset.id;
    var favorites = this.data.favorites;
    var index = favorites.indexOf(id);
    if (index > -1) {
      favorites.splice(index, 1);
      this.showToast('已取消收藏');
    } else {
      favorites.push(id);
      this.showToast('已收藏');
    }
    wx.setStorageSync('recipe_favorites', favorites);
    this.setData({ favorites: favorites });
  },

  isFavorite: function(id) {
    return this.data.favorites.indexOf(id) !== -1;
  },

  addToMealPlan: function(e) {
    var id = e.currentTarget.dataset.id;
    var recipe = this.data.selectedRecipe;
    if (!recipe) return;

    var plan = this.data.mealPlan;
    var exists = plan.some(function(p) { return p.id === id; });
    if (exists) {
      this.showToast('已添加到餐单');
      return;
    }

    plan.push({
      id: recipe.id,
      name: recipe.name,
      calorie: recipe.calorie,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
      category: recipe.category,
      mealType: recipe.mealType
    });

    this.setData({ mealPlan: plan });
    this.showToast('已添加到餐单');
  },

  removeFromMealPlan: function(e) {
    var index = e.currentTarget.dataset.index;
    var plan = this.data.mealPlan;
    plan.splice(index, 1);
    this.setData({ mealPlan: plan });
  },

  getMealPlanTotal: function(type) {
    var plan = this.data.mealPlan;
    return plan.reduce(function(sum, p) { return sum + (p[type] || 0); }, 0);
  },

  openMealPlan: function() {
    this.setData({ showMealPlan: true });
  },

  closeMealPlan: function() {
    this.setData({ showMealPlan: false });
  },

  openCreatePlan: function() {
    this.setData({ showCreatePlan: true });
  },

  closeCreatePlan: function() {
    this.setData({ showCreatePlan: false });
  },

  onPlanNameInput: function(e) {
    this.setData({ mealPlanName: e.detail.value });
  },

  saveMealPlan: function() {
    var name = this.data.mealPlanName.trim();
    if (!name) {
      this.showToast('请输入餐单名称');
      return;
    }
    if (this.data.mealPlan.length === 0) {
      this.showToast('请先添加菜品到餐单');
      return;
    }

    var totalCalorie = this.getMealPlanTotal('calorie');
    var totalProtein = this.getMealPlanTotal('protein');
    var totalFat = this.getMealPlanTotal('fat');
    var totalCarbs = this.getMealPlanTotal('carbs');

    var plan = {
      id: 'plan_' + Date.now(),
      name: name,
      recipes: this.data.mealPlan,
      totalCalorie: totalCalorie,
      totalProtein: totalProtein,
      totalFat: totalFat,
      totalCarbs: totalCarbs,
      createdAt: format.formatDate(new Date())
    };

    var savedPlans = this.data.savedMealPlans;
    savedPlans.push(plan);
    wx.setStorageSync('recipe_meal_plans', savedPlans);

    this.setData({
      savedMealPlans: savedPlans,
      mealPlan: [],
      mealPlanName: '',
      showCreatePlan: false,
      showMealPlan: false
    });

    this.showToast('餐单保存成功');
  },

  deleteMealPlan: function(e) {
    var page = this;
    var planId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除餐单',
      content: '确定要删除这个餐单吗？',
      success: function(res) {
        if (res.confirm) {
          var plans = page.data.savedMealPlans.filter(function(p) { return p.id !== planId; });
          wx.setStorageSync('recipe_meal_plans', plans);
          page.setData({ savedMealPlans: plans });
          page.showToast('已删除');
        }
      }
    });
  },

  viewMealPlan: function(e) {
    var planId = e.currentTarget.dataset.id;
    var plan = this.data.savedMealPlans.find(function(p) { return p.id === planId; });
    if (plan) {
      this.setData({
        mealPlan: plan.recipes,
        mealPlanName: plan.name,
        showMealPlan: true
      });
    }
  },

  aiRecommend: function() {
    var page = this;
    page.setData({ aiLoading: true });

    var allRecipes = this.data.recipes;
    var target = this.data.userTarget;
    var recommendations = allRecipes.filter(function(r) {
      return r.suitableTarget.indexOf(target) !== -1;
    });

    if (recommendations.length === 0) {
      recommendations = allRecipes.slice(0, 3);
    }

    var breakfast = recommendations.filter(function(r) { return r.mealType === 'breakfast'; });
    var lunch = recommendations.filter(function(r) { return r.mealType === 'lunch'; });
    var dinner = recommendations.filter(function(r) { return r.mealType === 'dinner'; });

    var pickOne = function(arr) {
      if (arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    };

    var rec = {
      breakfast: pickOne(breakfast),
      lunch: pickOne(lunch),
      dinner: pickOne(dinner),
      totalCalorie: 0,
      totalProtein: 0,
      totalFat: 0,
      totalCarbs: 0,
      tips: ''
    };

    var recipes = [rec.breakfast, rec.lunch, rec.dinner].filter(function(r) { return r !== null; });
    recipes.forEach(function(r) {
      rec.totalCalorie += r.calorie;
      rec.totalProtein += r.protein;
      rec.totalFat += r.fat;
      rec.totalCarbs += r.carbs;
    });

    if (target === 'fat') {
      rec.tips = '今日推荐低卡搭配，总热量控制在合理范围内，高蛋白帮助保持饱腹感';
    } else if (target === 'muscle') {
      rec.tips = '今日推荐高蛋白搭配，充足的蛋白质支持肌肉生长和修复';
    } else {
      rec.tips = '今日推荐均衡搭配，三大营养素比例合理，适合日常维持';
    }

    setTimeout(function() {
      page.setData({ aiRecommendation: rec, aiLoading: false });
    }, 800);
  },

  addRecommendToPlan: function() {
    var rec = this.data.aiRecommendation;
    if (!rec) return;

    var plan = [];
    [rec.breakfast, rec.lunch, rec.dinner].forEach(function(r) {
      if (r) {
        plan.push({
          id: r.id,
          name: r.name,
          calorie: r.calorie,
          protein: r.protein,
          fat: r.fat,
          carbs: r.carbs,
          category: r.category,
          mealType: r.mealType
        });
      }
    });

    this.setData({ mealPlan: plan, showMealPlan: true });
    this.showToast('已添加到餐单');
  },

  clearMealPlan: function() {
    this.setData({ mealPlan: [], mealPlanName: '' });
  },

  showToast: function(message) {
    var page = this;
    page.setData({ showToast: true, toastMessage: message });
    setTimeout(function() {
      page.setData({ showToast: false, toastMessage: '' });
    }, 1500);
  },

  // 餐单日历功能
  openCalendar: function() {
    var now = new Date();
    this.setData({
      showCalendar: true,
      calendarYear: now.getFullYear(),
      calendarMonth: now.getMonth() + 1,
      selectedCalendarDate: format.formatDate(now)
    });
    this.generateCalendarDays(now.getFullYear(), now.getMonth() + 1);
  },

  closeCalendar: function() {
    this.setData({ showCalendar: false });
  },

  generateCalendarDays: function(year, month) {
    var firstDay = new Date(year, month - 1, 1);
    var lastDay = new Date(year, month, 0);
    var daysInMonth = lastDay.getDate();
    var startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    var today = format.formatDate(new Date());
    var days = [];

    for (var i = 0; i < startDayOfWeek; i++) {
      days.push({ date: '', day: '', isPadding: true });
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var dayPlan = this.data.savedDayPlans.find(function(p) { return p.date === dateStr; });
      var hasPlan = dayPlan && dayPlan.recipes && dayPlan.recipes.length > 0;
      var totalCal = hasPlan ? dayPlan.recipes.reduce(function(sum, r) { return sum + r.calorie; }, 0) : 0;
      var recipeCount = hasPlan ? dayPlan.recipes.length : 0;

      days.push({
        date: dateStr,
        day: d,
        isPadding: false,
        isToday: dateStr === today,
        hasPlan: hasPlan,
        recipeCount: recipeCount,
        totalCal: totalCal
      });
    }

    this.setData({ calendarDays: days });
  },

  onCalendarDateTap: function(e) {
    var dateStr = e.currentTarget.dataset.date;
    if (!dateStr) return;

    var dayPlan = this.data.savedDayPlans.find(function(p) { return p.date === dateStr; });
    this.setData({
      selectedCalendarDate: dateStr,
      calendarMealPlan: dayPlan || null
    });
  },

  onPrevMonth: function() {
    var year = this.data.calendarYear;
    var month = this.data.calendarMonth;
    if (month === 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
    this.setData({ calendarYear: year, calendarMonth: month });
    this.generateCalendarDays(year, month);
  },

  onNextMonth: function() {
    var year = this.data.calendarYear;
    var month = this.data.calendarMonth;
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    this.setData({ calendarYear: year, calendarMonth: month });
    this.generateCalendarDays(year, month);
  },

  deleteCalendarDayPlan: function() {
    var page = this;
    var dateStr = this.data.selectedCalendarDate;
    if (!dateStr) return;

    wx.showModal({
      title: '删除餐单',
      content: '确定要删除 ' + dateStr + ' 的餐单吗？',
      success: function(res) {
        if (res.confirm) {
          var plans = page.data.savedDayPlans.filter(function(p) { return p.date !== dateStr; });
          wx.setStorageSync('saved_meal_plans', plans);
          page.setData({ savedDayPlans: plans, calendarMealPlan: null });
          page.generateCalendarDays(page.data.calendarYear, page.data.calendarMonth);
          page.showToast('已删除');
        }
      }
    });
  },

  addCalendarDayToRecords: function() {
    var plan = this.data.calendarMealPlan;
    if (!plan || !plan.recipes) return;

    var dataStore = require('../../utils/data-store');
    var now = new Date();
    var dateStr = format.formatDate(now);
    var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    var mealTypeMap = { breakfast: 'breakfast', lunch: 'lunch', dinner: 'dinner' };

    plan.recipes.forEach(function(recipe) {
      dataStore.addRecord({
        id: 'cal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        date: dateStr,
        mealType: mealTypeMap[recipe.mealType] || 'lunch',
        foodName: recipe.name,
        calorie: recipe.calorie,
        portion: 100,
        portionUnit: 'g',
        macro: { protein: recipe.protein, fat: recipe.fat, carbs: recipe.carbs },
        foodId: recipe.id,
        source: 'meal_plan',
        time: timeStr,
        timestamp: Date.now()
      });
    });

    this.showToast('已添加到今日记录');
  }
});
