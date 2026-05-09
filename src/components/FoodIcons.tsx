import React from 'react';

// Food SVG icons - realistic style
const FoodIcons = {
  // 主食
  rice: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <circle cx="50" cy="50" r="35" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="3"/>
      <ellipse cx="38" cy="42" rx="6" ry="4" fill="#FAFAFA" transform="rotate(-15 38 42)"/>
      <ellipse cx="52" cy="38" rx="7" ry="4" fill="#FAFAFA" transform="rotate(10 52 38)"/>
      <ellipse cx="45" cy="52" rx="6" ry="4" fill="#FAFAFA" transform="rotate(-20 45 52)"/>
      <ellipse cx="58" cy="48" rx="5" ry="3" fill="#FAFAFA" transform="rotate(25 58 48)"/>
      <ellipse cx="40" cy="55" rx="5" ry="3" fill="#FAFAFA" transform="rotate(5 40 55)"/>
      <ellipse cx="55" cy="56" rx="6" ry="4" fill="#FAFAFA" transform="rotate(-10 55 56)"/>
      <circle cx="50" cy="45" r="4" fill="#FFF" opacity="0.6"/>
      <circle cx="42" cy="48" r="3" fill="#FFF" opacity="0.5"/>
    </svg>
  ),
  // 面条
  noodles: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 35 Q30 25 40 30 Q50 35 55 25 Q60 15 70 20 Q80 25 75 35" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
      <path d="M28 40 Q35 32 45 38 Q55 44 60 35 Q65 26 72 30 Q78 34 73 42" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 45 Q38 38 48 44 Q58 50 63 42 Q68 34 75 38 Q80 42 76 48" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="45" cy="55" r="2" fill="#4CAF50"/>
      <circle cx="55" cy="52" r="2" fill="#4CAF50"/>
    </svg>
  ),
  // 饺子
  dumpling: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M20 55 Q25 35 50 30 Q75 35 80 55 Q75 70 50 75 Q25 70 20 55Z" fill="#FFF8E1" stroke="#D4AF37" strokeWidth="2"/>
      <path d="M25 55 Q30 45 40 42 Q50 40 60 42 Q70 45 75 55" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3,3"/>
      <ellipse cx="35" cy="48" rx="3" ry="2" fill="#FFB74D" opacity="0.5"/>
      <ellipse cx="65" cy="50" rx="3" ry="2" fill="#FFB74D" opacity="0.5"/>
    </svg>
  ),
  // 馒头
  mantou: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="55" rx="25" ry="20" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFDF0"/>
      <path d="M35 50 Q40 40 50 38 Q60 40 65 50" fill="none" stroke="#F5DEB3" strokeWidth="1.5"/>
      <circle cx="40" cy="48" r="2" fill="#FFE4B5" opacity="0.6"/>
      <circle cx="60" cy="50" r="2" fill="#FFE4B5" opacity="0.6"/>
    </svg>
  ),
  // 包子
  baozi: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="58" rx="28" ry="22" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <path d="M35 45 Q40 35 50 32 Q60 35 65 45" fill="#FFFDF0" stroke="#F5DEB3" strokeWidth="1.5"/>
      <path d="M42 40 L50 35 L58 40" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
      <circle cx="45" cy="55" r="2" fill="#FFB74D" opacity="0.5"/>
      <circle cx="55" cy="58" r="2" fill="#FFB74D" opacity="0.5"/>
    </svg>
  ),
  // 面包
  bread: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="25" y="35" width="50" height="30" rx="5" fill="#F4A460" stroke="#D2691E" strokeWidth="2"/>
      <path d="M30 35 Q35 25 50 22 Q65 25 70 35" fill="#FFD700" stroke="#D2691E" strokeWidth="2"/>
      <line x1="35" y1="45" x2="65" y2="45" stroke="#D2691E" strokeWidth="1.5"/>
      <line x1="40" y1="55" x2="60" y2="55" stroke="#D2691E" strokeWidth="1.5"/>
    </svg>
  ),
  // 饺子/馄饨
  wonton: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 60 Q35 45 50 40 Q65 45 70 60 Q65 75 50 80 Q35 75 30 60Z" fill="#FFF8E1" stroke="#D4AF37" strokeWidth="2"/>
      <path d="M35 55 Q45 48 65 55" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
      <circle cx="40" cy="58" r="2" fill="#FFB74D" opacity="0.4"/>
      <circle cx="60" cy="62" r="2" fill="#FFB74D" opacity="0.4"/>
    </svg>
  ),
  // 玉米
  corn: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="50" rx="15" ry="25" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
      <circle cx="42" cy="38" r="4" fill="#FFA500"/>
      <circle cx="58" cy="38" r="4" fill="#FFA500"/>
      <circle cx="42" cy="50" r="4" fill="#FFA500"/>
      <circle cx="58" cy="50" r="4" fill="#FFA500"/>
      <circle cx="50" cy="62" r="4" fill="#FFA500"/>
      <line x1="50" y1="25" x2="50" y2="15" stroke="#228B22" strokeWidth="3"/>
    </svg>
  ),
  // 红薯
  sweetPotato: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 65 Q25 50 35 40 Q45 30 60 35 Q75 40 70 60 Q65 75 50 70 Q35 65 30 65Z" fill="#D2691E" stroke="#A0522D" strokeWidth="2"/>
      <ellipse cx="40" cy="50" rx="8" ry="5" fill="#FFB347" opacity="0.6"/>
      <ellipse cx="60" cy="55" rx="6" ry="4" fill="#FFB347" opacity="0.6"/>
    </svg>
  ),
  // 土豆
  potato: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#D2B48C" stroke="#B8860B" strokeWidth="2"/>
      <ellipse cx="35" cy="42" rx="3" ry="2" fill="#C4A66A"/>
      <ellipse cx="55" cy="48" rx="2" ry="2" fill="#C4A66A"/>
      <ellipse cx="45" cy="58" rx="3" ry="2" fill="#C4A66A"/>
      <ellipse cx="65" cy="52" rx="2" ry="2" fill="#C4A66A"/>
    </svg>
  ),
  // 粥
  porridge: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 40 Q25 70 50 75 Q75 70 75 40Z" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <path d="M30 45 Q40 50 50 48 Q60 46 70 50" fill="none" stroke="#F5DEB3" strokeWidth="2"/>
      <circle cx="40" cy="52" r="2" fill="#FFD700" opacity="0.6"/>
      <circle cx="55" cy="55" r="2" fill="#FFD700" opacity="0.6"/>
    </svg>
  ),
  // 鸡蛋
  egg: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="55" rx="18" ry="25" fill="#FFF8E1" stroke="#DEB887" strokeWidth="2"/>
      <ellipse cx="50" cy="45" rx="12" ry="15" fill="#FFFDF0"/>
      <path d="M42 50 Q45 45 50 43 Q55 45 58 50" fill="none" stroke="#DEB887" strokeWidth="1"/>
    </svg>
  ),
  // 牛奶
  milk: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="35" y="25" width="30" height="50" rx="3" fill="#FFF8E1" stroke="#DDD" strokeWidth="2"/>
      <rect x="35" y="25" width="30" height="8" fill="#4169E1" stroke="#3151B7" strokeWidth="1"/>
      <rect x="40" y="40" width="20" height="15" fill="#4169E1" rx="2" opacity="0.8"/>
      <circle cx="45" cy="47" r="2" fill="#FFF"/>
      <circle cx="55" cy="47" r="2" fill="#FFF"/>
    </svg>
  ),
  // 酸奶
  yogurt: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 30 L65 30 L60 70 L40 70Z" fill="#FFF8E1" stroke="#DDD" strokeWidth="2"/>
      <rect x="35" y="25" width="30" height="8" fill="#FF69B4" stroke="#FF1493" strokeWidth="1"/>
      <circle cx="42" cy="40" r="3" fill="#FF69B4" opacity="0.6"/>
      <circle cx="58" cy="45" r="3" fill="#FF69B4" opacity="0.6"/>
      <circle cx="50" cy="55" r="3" fill="#FF69B4" opacity="0.6"/>
    </svg>
  ),
  // 豆腐
  tofu: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="30" y="35" width="40" height="30" rx="3" fill="#FFFDF0" stroke="#F5DEB3" strokeWidth="2"/>
      <rect x="35" y="40" width="30" height="20" fill="#FFF" stroke="#F5DEB3" strokeWidth="1"/>
      <line x1="40" y1="45" x2="60" y2="45" stroke="#F5DEB3" strokeWidth="1"/>
      <line x1="40" y1="55" x2="60" y2="55" stroke="#F5DEB3" strokeWidth="1"/>
    </svg>
  ),
  // 鸡胸肉
  chickenBreast: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 55 Q30 40 50 35 Q70 40 75 55 Q70 70 50 75 Q30 70 25 55Z" fill="#FFB6C1" stroke="#FF8C94" strokeWidth="2"/>
      <ellipse cx="40" cy="50" rx="8" ry="5" fill="#FFC0CB" opacity="0.6"/>
      <ellipse cx="60" cy="55" rx="6" ry="4" fill="#FFC0CB" opacity="0.6"/>
    </svg>
  ),
  // 牛肉
  beef: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 55 Q30 40 50 35 Q70 40 75 55 Q70 70 50 75 Q30 70 25 55Z" fill="#CD5C5C" stroke="#B22222" strokeWidth="2"/>
      <ellipse cx="40" cy="50" rx="6" ry="4" fill="#DC143C" opacity="0.5"/>
      <ellipse cx="60" cy="55" rx="5" ry="3" fill="#DC143C" opacity="0.5"/>
    </svg>
  ),
  // 猪肉
  pork: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 55 Q30 40 50 35 Q70 40 75 55 Q70 70 50 75 Q30 70 25 55Z" fill="#FFE4E1" stroke="#FFB6C1" strokeWidth="2"/>
      <ellipse cx="40" cy="50" rx="6" ry="4" fill="#FFF5EE" opacity="0.7"/>
      <ellipse cx="60" cy="55" rx="5" ry="3" fill="#FFF5EE" opacity="0.7"/>
      <path d="M35 55 Q45 60 65 55" fill="none" stroke="#FFB6C1" strokeWidth="2"/>
    </svg>
  ),
  // 鱼
  fish: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M20 50 Q30 35 50 35 Q70 35 80 50 Q70 65 50 65 Q30 65 20 50Z" fill="#B0C4DE" stroke="#87CEEB" strokeWidth="2"/>
      <circle cx="35" cy="45" r="3" fill="#4682B4"/>
      <path d="M80 50 L90 40 L90 60Z" fill="#B0C4DE" stroke="#87CEEB" strokeWidth="2"/>
      <line x1="40" y1="55" x2="65" y2="55" stroke="#87CEEB" strokeWidth="1.5"/>
    </svg>
  ),
  // 虾
  shrimp: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 70 Q30 50 50 45 Q70 40 75 55 Q70 65 65 60 Q60 55 55 60 Q50 65 45 60 Q40 55 35 60 Q30 65 25 70Z" fill="#FFB347" stroke="#FF8C00" strokeWidth="2"/>
      <circle cx="30" cy="65" r="2" fill="#FF8C00"/>
      <path d="M75 55 L85 50" stroke="#FF8C00" strokeWidth="2"/>
    </svg>
  ),
  // 蔬菜 - 通用
  vegetable: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 65 Q30 50 35 40 Q40 30 50 28 Q60 30 65 40 Q70 50 65 65Z" fill="#90EE90" stroke="#32CD32" strokeWidth="2"/>
      <line x1="50" y1="65" x2="50" y2="75" stroke="#228B22" strokeWidth="3"/>
      <path d="M40 45 Q50 40 60 45" fill="none" stroke="#32CD32" strokeWidth="1.5"/>
    </svg>
  ),
  // 西兰花
  broccoli: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <circle cx="40" cy="35" r="12" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
      <circle cx="60" cy="35" r="12" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
      <circle cx="50" cy="25" r="12" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
      <line x1="50" y1="45" x2="50" y2="70" stroke="#228B22" strokeWidth="4"/>
    </svg>
  ),
  // 西红柿
  tomato: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <circle cx="50" cy="50" r="25" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <path d="M45 28 Q50 25 55 28" fill="none" stroke="#228B22" strokeWidth="2"/>
      <circle cx="38" cy="42" r="5" fill="#FF7F7F" opacity="0.6"/>
      <circle cx="62" cy="58" r="4" fill="#FF7F7F" opacity="0.6"/>
    </svg>
  ),
  // 黄瓜
  cucumber: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="50" rx="15" ry="30" fill="#90EE90" stroke="#32CD32" strokeWidth="2"/>
      <line x1="40" y1="35" x2="60" y2="35" stroke="#32CD32" strokeWidth="1.5"/>
      <line x1="38" y1="45" x2="62" y2="45" stroke="#32CD32" strokeWidth="1.5"/>
      <line x1="38" y1="55" x2="62" y2="55" stroke="#32CD32" strokeWidth="1.5"/>
      <line x1="40" y1="65" x2="60" y2="65" stroke="#32CD32" strokeWidth="1.5"/>
    </svg>
  ),
  // 胡萝卜
  carrot: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M50 25 L40 70 L60 70Z" fill="#FF8C00" stroke="#FF6600" strokeWidth="2"/>
      <path d="M50 25 L45 15 M50 25 L55 15 M50 25 L50 15" stroke="#228B22" strokeWidth="3"/>
      <line x1="45" y1="40" x2="55" y2="40" stroke="#FF6600" strokeWidth="1"/>
      <line x1="43" y1="50" x2="57" y2="50" stroke="#FF6600" strokeWidth="1"/>
      <line x1="42" y1="60" x2="58" y2="60" stroke="#FF6600" strokeWidth="1"/>
    </svg>
  ),
  // 苹果
  apple: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 40 Q30 25 50 20 Q70 25 65 40 Q70 60 50 75 Q30 60 35 40Z" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <path d="M50 20 L50 15" stroke="#8B4513" strokeWidth="3"/>
      <circle cx="38" cy="45" r="6" fill="#FF7F7F" opacity="0.6"/>
      <circle cx="62" cy="50" r="5" fill="#FF7F7F" opacity="0.6"/>
    </svg>
  ),
  // 香蕉
  banana: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 65 Q30 35 50 25 Q70 15 80 30 Q70 45 55 50 Q40 55 25 65Z" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
      <path d="M80 30 L85 25" stroke="#8B4513" strokeWidth="2"/>
      <path d="M35 50 Q50 40 65 35" fill="none" stroke="#FFA500" strokeWidth="1.5"/>
    </svg>
  ),
  // 橙子
  orange: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <circle cx="50" cy="50" r="25" fill="#FFA500" stroke="#FF8C00" strokeWidth="2"/>
      <circle cx="38" cy="42" r="6" fill="#FFB347" opacity="0.6"/>
      <circle cx="62" cy="58" r="5" fill="#FFB347" opacity="0.6"/>
      <circle cx="50" cy="50" r="2" fill="#FF8C00" opacity="0.8"/>
      <path d="M50 25 L50 20" stroke="#228B22" strokeWidth="2"/>
    </svg>
  ),
  // 葡萄
  grape: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <circle cx="40" cy="45" r="8" fill="#9370DB" stroke="#8A2BE2" strokeWidth="1"/>
      <circle cx="55" cy="45" r="8" fill="#9370DB" stroke="#8A2BE2" strokeWidth="1"/>
      <circle cx="48" cy="55" r="8" fill="#9370DB" stroke="#8A2BE2" strokeWidth="1"/>
      <circle cx="40" cy="65" r="8" fill="#9370DB" stroke="#8A2BE2" strokeWidth="1"/>
      <circle cx="55" cy="65" r="8" fill="#9370DB" stroke="#8A2BE2" strokeWidth="1"/>
      <line x1="50" y1="35" x2="50" y2="25" stroke="#228B22" strokeWidth="2"/>
    </svg>
  ),
  // 西瓜
  watermelon: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M20 50 Q50 20 80 50" fill="#FF6347" stroke="#228B22" strokeWidth="3"/>
      <path d="M20 50 Q50 80 80 50" fill="#228B22" stroke="#228B22" strokeWidth="3"/>
      <circle cx="40" cy="42" r="2" fill="#000"/>
      <circle cx="50" cy="38" r="2" fill="#000"/>
      <circle cx="60" cy="42" r="2" fill="#000"/>
      <circle cx="45" cy="50" r="2" fill="#000"/>
      <circle cx="55" cy="50" r="2" fill="#000"/>
    </svg>
  ),
  // 草莓
  strawberry: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 35 Q30 50 50 70 Q70 50 65 35 Q60 25 50 20 Q40 25 35 35Z" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <path d="M45 22 Q50 18 55 22" fill="none" stroke="#228B22" strokeWidth="2"/>
      <circle cx="42" cy="40" r="2" fill="#FFB347"/>
      <circle cx="55" cy="42" r="2" fill="#FFB347"/>
      <circle cx="48" cy="55" r="2" fill="#FFB347"/>
    </svg>
  ),
  // 坚果 - 通用
  nut: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="50" cy="50" rx="20" ry="15" fill="#D2691E" stroke="#8B4513" strokeWidth="2"/>
      <ellipse cx="50" cy="48" rx="15" ry="10" fill="#F5DEB3"/>
      <line x1="35" y1="50" x2="65" y2="50" stroke="#8B4513" strokeWidth="1"/>
    </svg>
  ),
  // 花生
  peanut: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 45 Q30 35 45 35 Q50 35 50 40 Q50 35 65 35 Q70 35 70 45 Q70 55 65 60 Q55 65 50 60 Q45 65 35 60 Q30 55 30 45Z" fill="#D2B48C" stroke="#B8860B" strokeWidth="2"/>
      <line x1="50" y1="40" x2="50" y2="60" stroke="#B8860B" strokeWidth="1.5"/>
      <circle cx="40" cy="45" r="2" fill="#B8860B" opacity="0.5"/>
      <circle cx="60" cy="50" r="2" fill="#B8860B" opacity="0.5"/>
    </svg>
  ),
  // 核桃
  walnut: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 50 Q25 35 50 30 Q75 35 70 50 Q65 65 50 70 Q35 65 30 50Z" fill="#D2691E" stroke="#8B4513" strokeWidth="2"/>
      <path d="M40 40 Q50 35 60 40 Q65 50 60 60 Q50 65 40 60 Q35 50 40 40Z" fill="#F5DEB3"/>
      <path d="M45 45 Q50 42 55 45 Q58 50 55 55 Q50 58 45 55 Q42 50 45 45Z" fill="#D2B48C"/>
    </svg>
  ),
  // 咖啡
  coffee: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 40 L35 70 L65 70 L70 40Z" fill="#FFF8E1" stroke="#D2691E" strokeWidth="2"/>
      <path d="M70 45 Q85 45 85 55 Q85 65 70 65" fill="none" stroke="#D2691E" strokeWidth="2"/>
      <path d="M35 40 L65 40" stroke="#D2691E" strokeWidth="2"/>
      <path d="M40 30 Q45 25 50 30 Q55 35 60 30" fill="none" stroke="#DDD" strokeWidth="1.5"/>
      <rect x="38" y="48" width="24" height="12" fill="#D2691E" rx="2"/>
    </svg>
  ),
  // 奶茶
  milkTea: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 30 L70 30 L65 70 L35 70Z" fill="#FFF8E1" stroke="#D2691E" strokeWidth="2"/>
      <rect x="35" y="25" width="30" height="8" fill="#8B4513" rx="2"/>
      <circle cx="45" cy="55" r="3" fill="#8B4513"/>
      <circle cx="55" cy="50" r="3" fill="#8B4513"/>
      <circle cx="50" cy="60" r="3" fill="#8B4513"/>
      <line x1="50" y1="20" x2="50" y2="10" stroke="#D2691E" strokeWidth="3"/>
    </svg>
  ),
  // 可乐
  cola: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="35" y="25" width="30" height="50" rx="3" fill="#8B0000" stroke="#FF0000" strokeWidth="2"/>
      <rect x="40" y="40" width="20" height="20" fill="#FFF" rx="2"/>
      <circle cx="50" cy="50" r="6" fill="#8B0000"/>
      <text x="45" y="54" fill="#FFF" fontSize="10">C</text>
    </svg>
  ),
  // 冰淇淋
  icecream: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M45 50 L55 50 L52 75 L48 75Z" fill="#F5DEB3" stroke="#D2691E" strokeWidth="2"/>
      <circle cx="50" cy="35" r="15" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
      <circle cx="50" cy="35" r="3" fill="#FFF"/>
    </svg>
  ),
  // 蛋糕
  cake: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="25" y="50" width="50" height="20" rx="3" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <rect x="30" y="40" width="40" height="15" rx="3" fill="#FFFDF0" stroke="#F5DEB3" strokeWidth="2"/>
      <path d="M30 40 Q35 35 40 40 Q45 35 50 40 Q55 35 60 40 Q65 35 70 40" fill="#FF69B4" stroke="#FF1493" strokeWidth="2"/>
      <circle cx="40" cy="55" r="2" fill="#FF69B4"/>
      <circle cx="50" cy="55" r="2" fill="#FF69B4"/>
      <circle cx="60" cy="55" r="2" fill="#FF69B4"/>
    </svg>
  ),
  // 巧克力
  chocolate: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="25" y="35" width="50" height="30" rx="3" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
      <rect x="30" y="40" width="15" height="10" fill="#A0522D"/>
      <rect x="50" y="40" width="15" height="10" fill="#A0522D"/>
      <rect x="30" y="55" width="15" height="5" fill="#A0522D"/>
      <rect x="50" y="55" width="15" height="5" fill="#A0522D"/>
    </svg>
  ),
  // 披萨
  pizza: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 65 L50 25 L75 65Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
      <circle cx="45" cy="50" r="4" fill="#FF6347"/>
      <circle cx="55" cy="55" r="4" fill="#FF6347"/>
      <circle cx="50" cy="40" r="4" fill="#FF6347"/>
    </svg>
  ),
  // 汉堡
  burger: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 40 Q30 30 50 25 Q70 30 70 40" fill="#F4A460" stroke="#D2691E" strokeWidth="2"/>
      <rect x="25" y="40" width="50" height="5" fill="#90EE90" stroke="#228B22" strokeWidth="1"/>
      <rect x="25" y="50" width="50" height="5" fill="#FF6347" stroke="#DC143C" strokeWidth="1"/>
      <rect x="25" y="55" width="50" height="5" fill="#FFB347" stroke="#FF8C00" strokeWidth="1"/>
      <path d="M25 60 Q25 70 50 75 Q75 70 75 60" fill="#F4A460" stroke="#D2691E" strokeWidth="2"/>
    </svg>
  ),
  // 薯条
  fries: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="35" y="55" width="30" height="20" rx="2" fill="#FFF" stroke="#DDD" strokeWidth="2"/>
      <rect x="40" y="25" width="4" height="30" fill="#FFD700" stroke="#FFA500" strokeWidth="1" rx="1"/>
      <rect x="48" y="20" width="4" height="35" fill="#FFD700" stroke="#FFA500" strokeWidth="1" rx="1"/>
      <rect x="56" y="25" width="4" height="30" fill="#FFD700" stroke="#FFA500" strokeWidth="1" rx="1"/>
    </svg>
  ),
  // 寿司
  sushi: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <rect x="30" y="45" width="40" height="20" rx="3" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <rect x="35" y="40" width="30" height="10" fill="#FF6347" stroke="#DC143C" strokeWidth="1"/>
      <rect x="35" y="40" width="30" height="3" fill="#000" opacity="0.3"/>
    </svg>
  ),
  // 汤
  soup: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 45 Q30 70 50 75 Q70 70 70 45" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <path d="M35 50 Q45 55 55 50 Q65 45 70 50" fill="none" stroke="#F5DEB3" strokeWidth="2"/>
      <circle cx="45" cy="55" r="3" fill="#FFD700" opacity="0.6"/>
      <circle cx="55" cy="52" r="3" fill="#FFD700" opacity="0.6"/>
    </svg>
  ),
  // 沙拉
  salad: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M25 50 Q25 70 50 75 Q75 70 75 50Z" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <circle cx="40" cy="55" r="6" fill="#90EE90" stroke="#32CD32" strokeWidth="1"/>
      <circle cx="55" cy="58" r="5" fill="#FF6347" stroke="#DC143C" strokeWidth="1"/>
      <circle cx="48" cy="48" r="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
      <circle cx="60" cy="52" r="4" fill="#FFB347" stroke="#FF8C00" strokeWidth="1"/>
    </svg>
  ),
  // 饮料 - 通用
  drink: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 30 L65 30 L60 70 L40 70Z" fill="#87CEEB" stroke="#4682B4" strokeWidth="2"/>
      <rect x="35" y="25" width="30" height="8" fill="#4682B4" stroke="#3151B7" strokeWidth="1"/>
      <line x1="50" y1="15" x2="50" y2="10" stroke="#D2691E" strokeWidth="3"/>
    </svg>
  ),
  // 果汁
  juice: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 30 L65 30 L60 70 L40 70Z" fill="#FFA500" stroke="#FF8C00" strokeWidth="2"/>
      <rect x="35" y="25" width="30" height="8" fill="#FF8C00" stroke="#FF6600" strokeWidth="1"/>
      <circle cx="45" cy="45" r="5" fill="#FFD700" opacity="0.6"/>
      <circle cx="55" cy="55" r="4" fill="#FFD700" opacity="0.6"/>
    </svg>
  ),
  // 茶叶
  tea: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 40 L70 40 L65 70 L35 70Z" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="2"/>
      <path d="M35 40 L65 40" stroke="#F5DEB3" strokeWidth="2"/>
      <circle cx="45" cy="50" r="3" fill="#90EE90"/>
      <circle cx="55" cy="55" r="3" fill="#90EE90"/>
      <path d="M40 30 Q45 25 50 30 Q55 35 60 30" fill="none" stroke="#DDD" strokeWidth="1.5"/>
    </svg>
  ),
  // 蜂蜜
  honey: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M35 30 L65 30 L60 70 L40 70Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
      <rect x="35" y="25" width="30" height="8" fill="#DAA520" stroke="#B8860B" strokeWidth="1"/>
      <polygon points="45,42 48,38 51,42 51,46 48,48 45,46" fill="#FFF" opacity="0.6"/>
      <polygon points="50,52 53,48 56,52 56,56 53,58 50,56" fill="#FFF" opacity="0.6"/>
    </svg>
  ),
  // 饼干
  cookie: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <circle cx="50" cy="50" r="25" fill="#D2B48C" stroke="#B8860B" strokeWidth="2"/>
      <circle cx="40" cy="42" r="3" fill="#8B4513"/>
      <circle cx="55" cy="38" r="3" fill="#8B4513"/>
      <circle cx="45" cy="58" r="3" fill="#8B4513"/>
      <circle cx="60" cy="55" r="3" fill="#8B4513"/>
      <circle cx="52" cy="50" r="3" fill="#8B4513"/>
    </svg>
  ),
  // 爆米花
  popcorn: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <path d="M30 50 L70 50 L65 70 L35 70Z" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <circle cx="40" cy="40" r="8" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="1"/>
      <circle cx="55" cy="35" r="8" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="1"/>
      <circle cx="48" cy="25" r="8" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="1"/>
      <circle cx="60" cy="45" r="8" fill="#FFF8E1" stroke="#F5DEB3" strokeWidth="1"/>
    </svg>
  ),
  // 薯片
  chips: (
    <svg viewBox="0 0 100 100" width="48" height="48">
      <ellipse cx="40" cy="45" rx="15" ry="10" fill="#FFD700" stroke="#FFA500" strokeWidth="1.5" transform="rotate(-20 40 45)"/>
      <ellipse cx="55" cy="50" rx="15" ry="10" fill="#FFD700" stroke="#FFA500" strokeWidth="1.5" transform="rotate(15 55 50)"/>
      <ellipse cx="48" cy="35" rx="15" ry="10" fill="#FFD700" stroke="#FFA500" strokeWidth="1.5" transform="rotate(5 48 35)"/>
      <circle cx="35" cy="42" r="2" fill="#FF8C00"/>
      <circle cx="50" cy="48" r="2" fill="#FF8C00"/>
      <circle cx="60" cy="48" r="2" fill="#FF8C00"/>
    </svg>
  ),
};

export default FoodIcons;
