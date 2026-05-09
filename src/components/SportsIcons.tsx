import React from 'react';

// Sports SVG icons - cute illustrated style
const SportsIcons = {
  // 走路/散步
  walk: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="25" r="12" fill="#90EE90" stroke="#32CD32" strokeWidth="2"/>
      <path d="M50 37 L50 55" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 55 L40 75" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 55 L60 75" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 40 L35 50" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 40 L65 50" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="45" cy="23" r="2" fill="#32CD32"/>
      <circle cx="55" cy="23" r="2" fill="#32CD32"/>
      <path d="M45 28 Q50 32 55 28" fill="none" stroke="#32CD32" strokeWidth="1.5"/>
    </svg>
  ),
  // 跑步
  run: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="22" r="12" fill="#87CEEB" stroke="#4682B4" strokeWidth="2"/>
      <path d="M45 34 L45 52" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 52 L35 75" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 52 L60 70" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L30 45" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L60 42" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="20" r="2" fill="#4682B4"/>
      <circle cx="50" cy="20" r="2" fill="#4682B4"/>
      <path d="M42 26 Q45 29 48 26" fill="none" stroke="#4682B4" strokeWidth="1.5"/>
      {/* 汗滴 */}
      <path d="M58 18 L60 12 L62 18Z" fill="#87CEEB"/>
    </svg>
  ),
  // 快走
  fastWalk: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="22" r="12" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
      <path d="M45 34 L45 52" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 52 L32 72" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 52 L58 72" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L28 48" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L62 48" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="20" r="2" fill="#DAA520"/>
      <circle cx="50" cy="20" r="2" fill="#DAA520"/>
      <path d="M42 26 Q45 29 48 26" fill="none" stroke="#DAA520" strokeWidth="1.5"/>
      {/* 速度线 */}
      <line x1="20" y1="30" x2="30" y2="30" stroke="#DAA520" strokeWidth="2" opacity="0.5"/>
      <line x1="15" y1="40" x2="25" y2="40" stroke="#DAA520" strokeWidth="2" opacity="0.5"/>
    </svg>
  ),
  // 跳绳
  jumpRope: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="22" r="10" fill="#FF69B4" stroke="#FF1493" strokeWidth="2"/>
      <path d="M50 32 L50 50" stroke="#FF1493" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 50 L42 70" stroke="#FF1493" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 50 L58 70" stroke="#FF1493" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 36 L35 42" stroke="#FF1493" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 36 L65 42" stroke="#FF1493" strokeWidth="3" strokeLinecap="round"/>
      {/* 绳子 */}
      <path d="M35 42 Q30 25 50 15 Q70 25 65 42" fill="none" stroke="#FF1493" strokeWidth="2"/>
      <circle cx="35" cy="42" r="3" fill="#FF1493"/>
      <circle cx="65" cy="42" r="3" fill="#FF1493"/>
      <circle cx="46" cy="20" r="1.5" fill="#FF1493"/>
      <circle cx="54" cy="20" r="1.5" fill="#FF1493"/>
    </svg>
  ),
  // 骑行
  cycling: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="30" cy="70" r="12" fill="none" stroke="#90EE90" strokeWidth="3"/>
      <circle cx="70" cy="70" r="12" fill="none" stroke="#90EE90" strokeWidth="3"/>
      <path d="M30 70 L50 50 L70 70" fill="none" stroke="#32CD32" strokeWidth="3"/>
      <path d="M50 50 L55 35" stroke="#32CD32" strokeWidth="3"/>
      <path d="M55 35 L60 50" stroke="#32CD32" strokeWidth="3"/>
      <path d="M30 70 L45 55" stroke="#32CD32" strokeWidth="3"/>
      <circle cx="55" cy="30" r="8" fill="#90EE90" stroke="#32CD32" strokeWidth="2"/>
      <circle cx="52" cy="28" r="1.5" fill="#32CD32"/>
      <circle cx="58" cy="28" r="1.5" fill="#32CD32"/>
    </svg>
  ),
  // 瑜伽
  yoga: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="25" r="10" fill="#98D8C8" stroke="#5F9EA0" strokeWidth="2"/>
      <path d="M50 35 L50 55" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 55 L35 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 55 L65 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 40 L30 30" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 40 L70 30" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="46" cy="23" r="1.5" fill="#5F9EA0"/>
      <circle cx="54" cy="23" r="1.5" fill="#5F9EA0"/>
      <path d="M47 28 Q50 30 53 28" fill="none" stroke="#5F9EA0" strokeWidth="1"/>
      {/* 莲花座 */}
      <ellipse cx="50" cy="80" rx="15" ry="5" fill="#DDA0DD" opacity="0.3"/>
    </svg>
  ),
  // 游泳
  swimming: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="40" cy="40" r="10" fill="#87CEEB" stroke="#4682B4" strokeWidth="2"/>
      <path d="M50 45 L65 40" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M65 40 L75 45" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M65 40 L70 55" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M70 55 L80 65" stroke="#4682B4" strokeWidth="3" strokeLinecap="round"/>
      {/* 水波纹 */}
      <path d="M25 65 Q35 60 45 65 Q55 70 65 65 Q75 60 85 65" fill="none" stroke="#4682B4" strokeWidth="2" opacity="0.5"/>
      <path d="M20 75 Q35 70 50 75 Q65 80 80 75" fill="none" stroke="#4682B4" strokeWidth="2" opacity="0.5"/>
      <circle cx="37" cy="38" r="1.5" fill="#4682B4"/>
      <circle cx="43" cy="38" r="1.5" fill="#4682B4"/>
    </svg>
  ),
  // 羽毛球
  badminton: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      {/* 球拍 */}
      <ellipse cx="35" cy="50" rx="15" ry="20" fill="none" stroke="#FFD700" strokeWidth="3"/>
      <line x1="35" y1="70" x2="30" y2="90" stroke="#FFD700" strokeWidth="3"/>
      <line x1="25" y1="50" x2="45" y2="50" stroke="#FFD700" strokeWidth="1"/>
      <line x1="35" y1="35" x2="35" y2="65" stroke="#FFD700" strokeWidth="1"/>
      {/* 羽毛球 */}
      <circle cx="70" cy="35" r="8" fill="#FFF" stroke="#DDD" strokeWidth="1"/>
      <path d="M70 27 L68 15 L72 15Z" fill="#FFF" stroke="#DDD" strokeWidth="1"/>
    </svg>
  ),
  // 篮球
  basketball: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="50" r="25" fill="#FF8C00" stroke="#FF6600" strokeWidth="3"/>
      <path d="M25 50 Q50 40 75 50" fill="none" stroke="#FF6600" strokeWidth="2"/>
      <path d="M50 25 Q60 50 50 75" fill="none" stroke="#FF6600" strokeWidth="2"/>
      <line x1="25" y1="50" x2="75" y2="50" stroke="#FF6600" strokeWidth="1"/>
      <line x1="50" y1="25" x2="50" y2="75" stroke="#FF6600" strokeWidth="1"/>
    </svg>
  ),
  // 足球
  football: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="50" r="25" fill="#FFF" stroke="#333" strokeWidth="2"/>
      <polygon points="50,35 55,42 50,50 45,42" fill="#333"/>
      <polygon points="35,45 40,50 35,58 28,52" fill="#333"/>
      <polygon points="65,45 72,52 65,58 60,50" fill="#333"/>
      <polygon points="45,60 50,68 40,70 38,62" fill="#333"/>
      <polygon points="55,60 62,62 60,70 50,68" fill="#333"/>
    </svg>
  ),
  // 网球
  tennis: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="50" r="25" fill="#ADFF2F" stroke="#9ACD32" strokeWidth="2"/>
      <path d="M30 35 Q50 45 70 35" fill="none" stroke="#FFF" strokeWidth="2"/>
      <path d="M30 65 Q50 55 70 65" fill="none" stroke="#FFF" strokeWidth="2"/>
    </svg>
  ),
  // 呼啦圈
  hulaHoop: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="50" r="25" fill="none" stroke="#FF69B4" strokeWidth="6"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke="#FF1493" strokeWidth="2" strokeDasharray="5,5"/>
      <circle cx="50" cy="45" r="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
      <circle cx="47" cy="43" r="1.5" fill="#FF69B4"/>
      <circle cx="53" cy="43" r="1.5" fill="#FF69B4"/>
    </svg>
  ),
  // 哑铃
  dumbbell: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <rect x="35" y="45" width="30" height="10" rx="3" fill="#A9A9A9" stroke="#808080" strokeWidth="2"/>
      <rect x="25" y="38" width="12" height="24" rx="3" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/>
      <rect x="63" y="38" width="12" height="24" rx="3" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/>
      <circle cx="31" cy="50" r="2" fill="#808080"/>
      <circle cx="69" cy="50" r="2" fill="#808080"/>
    </svg>
  ),
  // 登山/爬楼梯
  climbing: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="25" r="10" fill="#DDA0DD" stroke="#BA55D3" strokeWidth="2"/>
      <path d="M45 35 L45 50" stroke="#BA55D3" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L35 70" stroke="#BA55D3" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L60 65" stroke="#BA55D3" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 40 L30 48" stroke="#BA55D3" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 40 L60 45" stroke="#BA55D3" strokeWidth="3" strokeLinecap="round"/>
      {/* 楼梯 */}
      <line x1="55" y1="75" x2="80" y2="75" stroke="#BA55D3" strokeWidth="2"/>
      <line x1="60" y1="65" x2="85" y2="65" stroke="#BA55D3" strokeWidth="2"/>
      <line x1="65" y1="55" x2="90" y2="55" stroke="#BA55D3" strokeWidth="2"/>
      <circle cx="42" cy="23" r="1.5" fill="#BA55D3"/>
      <circle cx="48" cy="23" r="1.5" fill="#BA55D3"/>
    </svg>
  ),
  // 舞蹈
  dance: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="25" r="10" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
      <path d="M45 35 L45 50" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L35 72" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L58 70" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L28 30" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L62 42" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="23" r="1.5" fill="#FF69B4"/>
      <circle cx="48" cy="23" r="1.5" fill="#FF69B4"/>
      <path d="M43 28 Q45 30 47 28" fill="none" stroke="#FF69B4" strokeWidth="1"/>
      {/* 音符 */}
      <text x="65" y="30" fill="#FF69B4" fontSize="16">♪</text>
      <text x="72" y="25" fill="#FF69B4" fontSize="12"></text>
    </svg>
  ),
  // 健身操
  fitness: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="25" r="10" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
      <path d="M45 35 L45 50" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L35 72" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L55 72" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L25 28" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L65 28" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="23" r="1.5" fill="#DAA520"/>
      <circle cx="48" cy="23" r="1.5" fill="#DAA520"/>
      <path d="M43 28 Q45 30 47 28" fill="none" stroke="#DAA520" strokeWidth="1"/>
      {/* 星星 */}
      <text x="68" y="22" fill="#FFD700" fontSize="14">✦</text>
      <text x="72" y="35" fill="#FFD700" fontSize="10">✦</text>
    </svg>
  ),
  // 普拉提
  pilates: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="25" r="10" fill="#B0E0E6" stroke="#5F9EA0" strokeWidth="2"/>
      <path d="M50 35 L50 55" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 55 L35 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 55 L65 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 40 L30 35" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 40 L70 35" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="46" cy="23" r="1.5" fill="#5F9EA0"/>
      <circle cx="54" cy="23" r="1.5" fill="#5F9EA0"/>
      {/* 瑜伽垫 */}
      <ellipse cx="50" cy="85" rx="20" ry="5" fill="#B0E0E6" opacity="0.3"/>
    </svg>
  ),
  // 椭圆机
  elliptical: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="50" cy="25" r="8" fill="#98D8C8" stroke="#5F9EA0" strokeWidth="2"/>
      <path d="M50 33 L50 50" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 50 L40 70" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 50 L60 70" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 38 L35 45" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 38 L65 45" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="47" cy="23" r="1.5" fill="#5F9EA0"/>
      <circle cx="53" cy="23" r="1.5" fill="#5F9EA0"/>
      {/* 椭圆轨迹 */}
      <ellipse cx="50" cy="60" rx="15" ry="8" fill="none" stroke="#5F9EA0" strokeWidth="1.5" strokeDasharray="3,3"/>
    </svg>
  ),
  // 划船机
  rowing: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="35" r="8" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
      <path d="M45 43 L55 55" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M55 55 L45 70" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M55 55 L65 65" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 48 L30 40" stroke="#DAA520" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="33" r="1.5" fill="#DAA520"/>
      <circle cx="48" cy="33" r="1.5" fill="#DAA520"/>
      {/* 桨 */}
      <path d="M30 40 L20 55" stroke="#DAA520" strokeWidth="2"/>
      <ellipse cx="20" cy="58" rx="8" ry="4" fill="#DAA520" transform="rotate(-20 20 58)"/>
      {/* 水波 */}
      <path d="M15 70 Q25 65 35 70 Q45 75 55 70" fill="none" stroke="#5F9EA0" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  ),
  // 拳击
  boxing: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="40" cy="30" r="10" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <path d="M40 40 L45 55" stroke="#DC143C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 55 L38 70" stroke="#DC143C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 55 L55 68" stroke="#DC143C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 45 L25 35" stroke="#DC143C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 45 L65 40" stroke="#DC143C" strokeWidth="3" strokeLinecap="round"/>
      {/* 拳头 */}
      <circle cx="25" cy="35" r="6" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <circle cx="65" cy="40" r="6" fill="#FF6347" stroke="#DC143C" strokeWidth="2"/>
      <circle cx="37" cy="28" r="1.5" fill="#DC143C"/>
      <circle cx="43" cy="28" r="1.5" fill="#DC143C"/>
      {/* 力量线 */}
      <line x1="70" y1="35" x2="80" y2="30" stroke="#FF6347" strokeWidth="2" opacity="0.5"/>
      <line x1="72" y1="40" x2="82" y2="38" stroke="#FF6347" strokeWidth="2" opacity="0.5"/>
    </svg>
  ),
  // 拉伸
  stretching: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="25" r="10" fill="#B0E0E6" stroke="#5F9EA0" strokeWidth="2"/>
      <path d="M45 35 L45 55" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 55 L35 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 55 L55 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L25 25" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 38 L65 25" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="23" r="1.5" fill="#5F9EA0"/>
      <circle cx="48" cy="23" r="1.5" fill="#5F9EA0"/>
      {/* 星星 */}
      <text x="20" y="20" fill="#5F9EA0" fontSize="12">✦</text>
      <text x="70" y="18" fill="#5F9EA0" fontSize="10">✦</text>
    </svg>
  ),
  // 散步
  stroll: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="25" r="10" fill="#98D8C8" stroke="#5F9EA0" strokeWidth="2"/>
      <path d="M45 35 L45 55" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 55 L38 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 55 L52 75" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 40 L35 50" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 40 L55 50" stroke="#5F9EA0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="23" r="1.5" fill="#5F9EA0"/>
      <circle cx="48" cy="23" r="1.5" fill="#5F9EA0"/>
      <path d="M43 28 Q45 30 47 28" fill="none" stroke="#5F9EA0" strokeWidth="1"/>
      {/* 小路 */}
      <path d="M20 80 Q40 75 60 80 Q80 85 90 80" fill="none" stroke="#5F9EA0" strokeWidth="2" opacity="0.3"/>
    </svg>
  ),
  // 跑步(慢)
  jog: (
    <svg viewBox="0 0 100 100" width="56" height="56">
      <circle cx="45" cy="22" r="10" fill="#90EE90" stroke="#32CD32" strokeWidth="2"/>
      <path d="M45 32 L45 50" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L38 70" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 50 L55 68" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 36 L32 45" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 36 L58 42" stroke="#32CD32" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="20" r="1.5" fill="#32CD32"/>
      <circle cx="48" cy="20" r="1.5" fill="#32CD32"/>
      <path d="M43 25 Q45 27 47 25" fill="none" stroke="#32CD32" strokeWidth="1"/>
      {/* 树叶 */}
      <path d="M20 30 Q25 25 30 30" fill="#90EE90" stroke="#32CD32" strokeWidth="1"/>
      <path d="M70 25 Q75 20 80 25" fill="#90EE90" stroke="#32CD32" strokeWidth="1"/>
    </svg>
  ),
};

export default SportsIcons;
