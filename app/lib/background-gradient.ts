/**
 * 生成随机的不饱和渐变色背景
 */

// 预定义的不饱和色彩基调
const colorPalettes = [
  // 暖色调
  {
    name: 'warm',
    colors: [
      'hsl(20, 25%, 85%)',   // 暖米色
      'hsl(35, 30%, 90%)',   // 浅杏色
      'hsl(45, 20%, 88%)',   // 淡黄色
    ]
  },
  // 冷色调
  {
    name: 'cool',
    colors: [
      'hsl(200, 20%, 88%)',  // 淡蓝色
      'hsl(220, 15%, 90%)',  // 浅灰蓝
      'hsl(180, 18%, 85%)',  // 淡青色
    ]
  },
  // 中性色调
  {
    name: 'neutral',
    colors: [
      'hsl(0, 0%, 88%)',     // 浅灰色
      'hsl(30, 8%, 90%)',    // 暖灰色
      'hsl(210, 5%, 85%)',   // 冷灰色
    ]
  },
  // 柔和绿色调
  {
    name: 'green',
    colors: [
      'hsl(120, 15%, 88%)',  // 淡绿色
      'hsl(90, 20%, 90%)',   // 浅黄绿
      'hsl(150, 12%, 85%)',  // 柔和青绿
    ]
  },
  // 柔和紫色调
  {
    name: 'purple',
    colors: [
      'hsl(280, 15%, 90%)',  // 淡紫色
      'hsl(300, 12%, 88%)',  // 浅粉紫
      'hsl(260, 18%, 85%)',  // 柔和蓝紫
    ]
  },
  // 柔和粉色调
  {
    name: 'pink',
    colors: [
      'hsl(350, 20%, 90%)',  // 淡粉色
      'hsl(15, 25%, 88%)',   // 浅桃色
      'hsl(330, 15%, 85%)',  // 柔和玫瑰色
    ]
  }
];

// 渐变方向
const gradientDirections = [
  '45deg',
  '135deg',
  '225deg',
  '315deg',
  'to right',
  'to bottom right',
  'to bottom',
  'to bottom left'
];

/**
 * 生成随机的不饱和渐变背景
 */
export function generateRandomGradient(): string {
  // 随机选择一个色彩调色板
  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

  // 随机选择2-3个颜色
  const numColors = Math.random() > 0.5 ? 3 : 2;
  const selectedColors = [];

  for (let i = 0; i < numColors; i++) {
    const colorIndex = Math.floor(Math.random() * palette.colors.length);
    selectedColors.push(palette.colors[colorIndex]);
  }

  // 随机选择渐变方向
  const direction = gradientDirections[Math.floor(Math.random() * gradientDirections.length)];

  // 生成渐变字符串
  return `linear-gradient(${direction}, ${selectedColors.join(', ')})`;
}

/**
 * 应用背景渐变到页面
 */
export function applyBackgroundGradient(gradient: string) {
  if (typeof document !== 'undefined') {
    // 强制设置背景样式
    document.body.style.setProperty('background', gradient, 'important');
    document.body.style.setProperty('background-attachment', 'fixed', 'important');
    document.body.style.transition = 'background 0.8s ease-in-out';

    // 也设置html元素的背景作为备用
    document.documentElement.style.setProperty('background', gradient, 'important');
  }
}

/**
 * 根据文章ID生成一致的渐变（可选，用于保持一致性）
 */
export function generateConsistentGradient(articleId: number): string {
  // 使用文章ID作为种子来生成一致的渐变
  const paletteIndex = articleId % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];

  const directionIndex = Math.floor(articleId / colorPalettes.length) % gradientDirections.length;
  const direction = gradientDirections[directionIndex];

  // 选择2-3个颜色
  const numColors = (articleId % 2) + 2; // 2 or 3 colors
  const selectedColors = [];

  for (let i = 0; i < numColors; i++) {
    const colorIndex = (articleId + i) % palette.colors.length;
    selectedColors.push(palette.colors[colorIndex]);
  }

  const gradient = `linear-gradient(${direction}, ${selectedColors.join(', ')})`;
  return gradient;
}