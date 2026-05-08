export type MemberLevel = 'free' | 'pro' | 'premium';

export interface MemberFeatures {
  foodRecord: boolean;
  basicFoods: boolean;
  advancedFoods: boolean;
  exerciseRecord: boolean;
  smartAnalysis: boolean;
  dataExport: boolean;
  customFood: boolean;
  historyView: boolean;
  aiRecognition: boolean;
  nutritionConsult: boolean;
  adFree: boolean;
  monthlyAdLimit: number;
}

export interface MemberPlan {
  level: MemberLevel;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: MemberFeatures;
}

export const MEMBER_PLANS: Record<MemberLevel, MemberPlan> = {
  free: {
    level: 'free',
    name: '免费版',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: {
      foodRecord: true,
      basicFoods: true,
      advancedFoods: false,
      exerciseRecord: false,
      smartAnalysis: false,
      dataExport: false,
      customFood: false,
      historyView: false,
      aiRecognition: false,
      nutritionConsult: false,
      adFree: false,
      monthlyAdLimit: 1,
    },
  },
  pro: {
    level: 'pro',
    name: 'Pro会员',
    price: {
      monthly: 9.9,
      yearly: 89,
    },
    features: {
      foodRecord: true,
      basicFoods: true,
      advancedFoods: true,
      exerciseRecord: true,
      smartAnalysis: true,
      dataExport: true,
      customFood: true,
      historyView: true,
      aiRecognition: false,
      nutritionConsult: false,
      adFree: true,
      monthlyAdLimit: 0,
    },
  },
  premium: {
    level: 'premium',
    name: '高级版',
    price: {
      monthly: 19.9,
      yearly: 169,
    },
    features: {
      foodRecord: true,
      basicFoods: true,
      advancedFoods: true,
      exerciseRecord: true,
      smartAnalysis: true,
      dataExport: true,
      customFood: true,
      historyView: true,
      aiRecognition: true,
      nutritionConsult: true,
      adFree: true,
      monthlyAdLimit: 0,
    },
  },
};

export const getPlanFeatures = (level: MemberLevel): MemberFeatures => {
  return MEMBER_PLANS[level].features;
};

export const canAccessFeature = (
  userLevel: MemberLevel,
  feature: keyof MemberFeatures
): boolean => {
  const features = getPlanFeatures(userLevel);
  return features[feature] as boolean;
};
