export function getBMR(sex: string, weight: number, height: number, age: number): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function getTDEE(bmr: number, level: number = 1.2): number {
  return Math.round(bmr * level);
}

export function getTargetCal(tdee: number, target: string): number {
  if (target === 'fat') {
    return tdee - 400;
  } else if (target === 'muscle') {
    return tdee + 300;
  } else {
    return tdee;
  }
}

export function getSuggestion(targetCal: number, todayIntake: number): string {
  const diff = todayIntake - targetCal;
  if (diff > 200) {
    return `今日超标${diff}千卡，建议快走30分钟或跳绳15分钟抵消`;
  } else if (diff < -300) {
    return `今日摄入偏少，可加餐鸡蛋/牛奶，避免代谢下降`;
  } else {
    return `今日热量控制合理，继续保持清淡饮食~`;
  }
}

export function calcSportCal(met: number, weight: number, minute: number): number {
  const hour = minute / 60;
  return Math.round(met * weight * hour);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
