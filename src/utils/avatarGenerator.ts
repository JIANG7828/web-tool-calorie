/**
 * 根据性别和昵称生成头像SVG
 * 使用内联SVG生成，无需外部API依赖
 */

const MALE_COLORS = ['#1677FF', '#4096FF', '#69B1FF', '#91CAFF'];
const FEMALE_COLORS = ['#FA8C16', '#FAAD14', '#FFC53D', '#FFD666'];
const BG_COLORS = ['#FFF7E6', '#FFF1F0', '#F6FFED', '#E6F7FF', '#F0F5FF'];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateAvatarSvg(
  gender: 'male' | 'female',
  nickname: string = '用户'
): string {
  const hash = hashCode(nickname + gender);
  const colorIndex = hash % (gender === 'male' ? MALE_COLORS.length : FEMALE_COLORS.length);
  const bgColorIndex = hash % BG_COLORS.length;
  
  const faceColor = gender === 'male' ? MALE_COLORS[colorIndex] : FEMALE_COLORS[colorIndex];
  const bgColor = BG_COLORS[bgColorIndex];
  const hairColor = hash % 2 === 0 ? '#333' : '#555';
  
  const initials = nickname.slice(0, 2).toUpperCase();
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <radialGradient id="bg${hash}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFF;stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill="url(#bg${hash})" />
      
      ${gender === 'male' ? `
        <circle cx="50" cy="42" r="18" fill="${faceColor}" opacity="0.9" />
        <circle cx="50" cy="42" r="12" fill="#FFF" opacity="0.3" />
        <text x="50" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="${faceColor}">${initials}</text>
      ` : `
        <circle cx="50" cy="42" r="18" fill="${faceColor}" opacity="0.9" />
        <path d="M32 35 Q50 20 68 35 Q60 25 50 22 Q40 25 32 35Z" fill="${hairColor}" opacity="0.7" />
        <text x="50" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="${faceColor}">${initials}</text>
      `}
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function generateAvatar(
  gender: 'male' | 'female',
  nickname: string = '用户'
): string {
  return generateAvatarSvg(gender, nickname);
}
