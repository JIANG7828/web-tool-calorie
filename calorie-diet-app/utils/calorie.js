function calculateBMR(gender, weight, height, age) {
  if (!weight || !height || !age) return 1200;
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return Math.round(bmr);
}

function calculateTDEE(bmr, activityLevel) {
  const level = activityLevel || 1.2;
  return Math.round(bmr * level);
}

function calculateTargetCalories(tdee, goal) {
  switch (goal) {
    case 'fat':
      return Math.round(tdee - 400);
    case 'muscle':
      return Math.round(tdee + 300);
    default:
      return tdee;
  }
}

function getUserTargetCalories(settings) {
  const { gender = 'female', weight = 55, height = 160, age = 25, activityLevel = 1.2, weightGoal = 'fat' } = settings;
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  return calculateTargetCalories(tdee, weightGoal);
}

function calculateExerciseCalories(met, weight, minutes) {
  if (!met || !weight || !minutes) return 0;
  const hours = minutes / 60;
  return Math.round(met * weight * hours);
}

function getSuggestion(targetCal, todayIntake) {
  const remaining = targetCal - todayIntake;
  if (remaining > 500) {
    return '热量余量充足，建议正常饮食';
  } else if (remaining > 200) {
    return '热量余量适中，注意控制晚餐份量';
  } else if (remaining >= 0) {
    return '热量余量较少，晚餐建议清淡低卡';
  } else {
    return '热量已超标，建议减少进食并增加运动';
  }
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  getUserTargetCalories,
  calculateExerciseCalories,
  getSuggestion
};
