const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (timestamp) => {
  const d = new Date(timestamp);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatDateTime = (timestamp) => {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
};

const formatNumber = (num, decimals = 0) => {
  return Number(num).toFixed(decimals);
};

const formatCalories = (calories) => {
  return Math.round(calories);
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
};

const getDayName = (dateStr) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

const getWeekdayName = (date) => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `周${days[date.getDay()]}`;
};

const getDateDiff = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const isToday = (dateStr) => {
  return dateStr === formatDate(new Date());
};

const isYesterday = (dateStr) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === formatDate(yesterday);
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

const subtractDays = (dateStr, days) => {
  return addDays(dateStr, -days);
};

const getMonthDates = (dateStr) => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];
  for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
    dates.push(formatDate(day));
  }
  return dates;
};

const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightM = height / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: '偏瘦', color: '#1890ff' };
  if (bmi < 24) return { label: '正常', color: '#52c41a' };
  if (bmi < 28) return { label: '偏胖', color: '#faad14' };
  return { label: '肥胖', color: '#ff4d4f' };
};

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatCalories,
  getWeekStart,
  getWeekDates,
  getMonthDates,
  getDayName,
  getWeekdayName,
  getDateDiff,
  isToday,
  isYesterday,
  generateId,
  addDays,
  subtractDays,
  calculateBMI,
  getBMICategory
};
