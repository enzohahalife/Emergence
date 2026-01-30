import { FastAverageColor } from 'fast-average-color';

/**
 * RGB 颜色接口
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * 将 RGB 转换为 HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * 将 HEX 转换为 RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 计算颜色亮度
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 判断颜色是否为深色
 */
export function isDarkColor(r: number, g: number, b: number): boolean {
  return getLuminance(r, g, b) < 0.5;
}

/**
 * 调整颜色饱和度
 */
export function adjustSaturation(r: number, g: number, b: number, factor: number): RGBColor {
  // 转换为 HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const diff = max - min;
  const sum = max + min;
  const l = sum / 2;

  if (diff === 0) {
    return { r, g, b }; // 灰色，无饱和度
  }

  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;

  // 计算色相
  let h = 0;
  switch (max) {
    case r / 255:
      h = ((g / 255 - b / 255) / diff + (g < b ? 6 : 0)) / 6;
      break;
    case g / 255:
      h = ((b / 255 - r / 255) / diff + 2) / 6;
      break;
    case b / 255:
      h = ((r / 255 - g / 255) / diff + 4) / 6;
      break;
  }

  // 调整饱和度
  const newS = Math.max(0, Math.min(1, s * factor));

  // 转换回 RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (newS === 0) {
    return { r: Math.round(l * 255), g: Math.round(l * 255), b: Math.round(l * 255) };
  }

  const q = l < 0.5 ? l * (1 + newS) : l + newS - l * newS;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  };
}

/**
 * 调整颜色亮度
 */
export function adjustBrightness(r: number, g: number, b: number, factor: number): RGBColor {
  return {
    r: Math.max(0, Math.min(255, Math.round(r * factor))),
    g: Math.max(0, Math.min(255, Math.round(g * factor))),
    b: Math.max(0, Math.min(255, Math.round(b * factor)))
  };
}

/**
 * 颜色提取缓存
 */
const colorCache = new Map<string, RGBColor>();

// 创建 FastAverageColor 实例的函数
const createFAC = () => new FastAverageColor();

/**
 * 从图片提取主色调（优化版本）
 */
export async function extractDominantColor(imageUrl: string): Promise<RGBColor | null> {
  // 检查缓存
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl)!;
  }

  try {
    const fac = createFAC();
    const color = await fac.getColorAsync(imageUrl, {
      algorithm: 'dominant',
      ignoredColor: [255, 255, 255, 255], // 忽略白色
    });

    const rgbColor: RGBColor = {
      r: color.value[0],
      g: color.value[1],
      b: color.value[2]
    };

    // 缓存结果
    colorCache.set(imageUrl, rgbColor);
    return rgbColor;
  } catch (error) {
    console.error('颜色提取失败:', error);

    // 返回默认颜色
    const defaultColor = { r: 128, g: 128, b: 128 };
    colorCache.set(imageUrl, defaultColor);
    return defaultColor;
  }
}

/**
 * 从图片提取调色板（优化版本）
 */
export async function extractColorPalette(imageUrl: string, colorCount: number = 5): Promise<RGBColor[]> {
  try {
    // fast-average-color 主要用于提取主色调，对于调色板我们简化处理
    const dominantColor = await extractDominantColor(imageUrl);
    if (!dominantColor) return [];

    // 基于主色调生成和谐的调色板
    const palette: RGBColor[] = [dominantColor];

    // 生成相近的颜色变体
    for (let i = 1; i < colorCount; i++) {
      const variation = adjustSaturation(
        dominantColor.r,
        dominantColor.g,
        dominantColor.b,
        0.8 + (i * 0.1)
      );
      palette.push(adjustBrightness(variation.r, variation.g, variation.b, 0.7 + (i * 0.1)));
    }

    return palette;
  } catch (error) {
    console.error('调色板提取失败:', error);
    return [];
  }
}

/**
 * 生成渐变背景样式
 */
export interface GradientOptions {
  direction?: string;
  opacity?: number;
  blendMode?: string;
}

export function generateGradientBackground(
  startColor: RGBColor,
  endColor: RGBColor,
  options: GradientOptions = {}
): string {
  const {
    direction = '135deg',
    opacity = 0.8,
    blendMode = 'multiply'
  } = options;

  const startRgba = `rgba(${startColor.r}, ${startColor.g}, ${startColor.b}, ${opacity})`;
  const endRgba = `rgba(${endColor.r}, ${endColor.g}, ${endColor.b}, ${opacity * 0.6})`;

  return `linear-gradient(${direction}, ${startRgba} 0%, ${endRgba} 100%)`;
}

/**
 * 基于主色调生成和谐的渐变色彩
 */
export function generateHarmoniousGradient(dominantColor: RGBColor): {
  startColor: RGBColor;
  endColor: RGBColor;
  gradient: string;
} {
  const { r, g, b } = dominantColor;

  // 判断是否为深色
  const isMainColorDark = isDarkColor(r, g, b);

  let startColor: RGBColor;
  let endColor: RGBColor;

  if (isMainColorDark) {
    // 深色主调：创建从深色到更深色的渐变
    startColor = adjustSaturation(r, g, b, 1.2); // 增加饱和度
    endColor = adjustBrightness(r, g, b, 0.3); // 降低亮度
  } else {
    // 浅色主调：创建从浅色到中等深度的渐变
    startColor = adjustBrightness(r, g, b, 1.1); // 稍微增加亮度
    endColor = adjustBrightness(r, g, b, 0.6); // 降低亮度
  }

  // 生成渐变
  const gradient = generateGradientBackground(startColor, endColor, {
    direction: '135deg',
    opacity: 0.9
  });

  return {
    startColor,
    endColor,
    gradient
  };
}

/**
 * 获取默认渐变（当无法提取颜色时使用）
 */
export function getDefaultGradient(): {
  startColor: RGBColor;
  endColor: RGBColor;
  gradient: string;
} {
  const startColor = { r: 30, g: 30, b: 30 };
  const endColor = { r: 10, g: 10, b: 10 };

  return {
    startColor,
    endColor,
    gradient: generateGradientBackground(startColor, endColor, {
      direction: '135deg',
      opacity: 0.8
    })
  };
}

/**
 * 生成三色渐变背景
 */
export function generateThreeColorGradient(
  color1: RGBColor,
  color2: RGBColor,
  color3: RGBColor,
  options: GradientOptions = {}
): string {
  const {
    direction = '135deg',
    opacity = 0.8
  } = options;

  const rgba1 = `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity})`;
  const rgba2 = `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity})`;
  const rgba3 = `rgba(${color3.r}, ${color3.g}, ${color3.b}, ${opacity * 0.7})`;

  return `linear-gradient(${direction}, ${rgba1} 0%, ${rgba2} 50%, ${rgba3} 100%)`;
}

/**
 * 预定义的30+种低饱和度三色渐变方案
 */
export const GRADIENT_SCHEMES: Array<{
  color1: RGBColor;
  color2: RGBColor;
  color3: RGBColor;
  gradient: string;
}> = [
  // 蓝紫色系
  { color1: { r: 100, g: 120, b: 180 }, color2: { r: 80, g: 100, b: 160 }, color3: { r: 60, g: 80, b: 140 }, gradient: '' },
  { color1: { r: 120, g: 110, b: 170 }, color2: { r: 100, g: 90, b: 150 }, color3: { r: 80, g: 70, b: 130 }, gradient: '' },
  { color1: { r: 90, g: 130, b: 190 }, color2: { r: 70, g: 110, b: 170 }, color3: { r: 50, g: 90, b: 150 }, gradient: '' },
  
  // 绿色系
  { color1: { r: 100, g: 150, b: 120 }, color2: { r: 80, g: 130, b: 100 }, color3: { r: 60, g: 110, b: 80 }, gradient: '' },
  { color1: { r: 120, g: 160, b: 140 }, color2: { r: 100, g: 140, b: 120 }, color3: { r: 80, g: 120, b: 100 }, gradient: '' },
  { color1: { r: 110, g: 140, b: 110 }, color2: { r: 90, g: 120, b: 90 }, color3: { r: 70, g: 100, b: 70 }, gradient: '' },
  
  // 橙红色系
  { color1: { r: 180, g: 130, b: 100 }, color2: { r: 160, g: 110, b: 80 }, color3: { r: 140, g: 90, b: 60 }, gradient: '' },
  { color1: { r: 190, g: 140, b: 120 }, color2: { r: 170, g: 120, b: 100 }, color3: { r: 150, g: 100, b: 80 }, gradient: '' },
  { color1: { r: 170, g: 120, b: 110 }, color2: { r: 150, g: 100, b: 90 }, color3: { r: 130, g: 80, b: 70 }, gradient: '' },
  
  // 粉紫色系
  { color1: { r: 170, g: 120, b: 160 }, color2: { r: 150, g: 100, b: 140 }, color3: { r: 130, g: 80, b: 120 }, gradient: '' },
  { color1: { r: 160, g: 110, b: 150 }, color2: { r: 140, g: 90, b: 130 }, color3: { r: 120, g: 70, b: 110 }, gradient: '' },
  { color1: { r: 180, g: 130, b: 170 }, color2: { r: 160, g: 110, b: 150 }, color3: { r: 140, g: 90, b: 130 }, gradient: '' },
  
  // 青蓝色系
  { color1: { r: 100, g: 160, b: 170 }, color2: { r: 80, g: 140, b: 150 }, color3: { r: 60, g: 120, b: 130 }, gradient: '' },
  { color1: { r: 110, g: 150, b: 180 }, color2: { r: 90, g: 130, b: 160 }, color3: { r: 70, g: 110, b: 140 }, gradient: '' },
  { color1: { r: 120, g: 170, b: 190 }, color2: { r: 100, g: 150, b: 170 }, color3: { r: 80, g: 130, b: 150 }, gradient: '' },
  
  // 黄绿色系
  { color1: { r: 160, g: 170, b: 100 }, color2: { r: 140, g: 150, b: 80 }, color3: { r: 120, g: 130, b: 60 }, gradient: '' },
  { color1: { r: 170, g: 160, b: 110 }, color2: { r: 150, g: 140, b: 90 }, color3: { r: 130, g: 120, b: 70 }, gradient: '' },
  { color1: { r: 150, g: 180, b: 120 }, color2: { r: 130, g: 160, b: 100 }, color3: { r: 110, g: 140, b: 80 }, gradient: '' },
  
  // 灰蓝色系
  { color1: { r: 130, g: 140, b: 160 }, color2: { r: 110, g: 120, b: 140 }, color3: { r: 90, g: 100, b: 120 }, gradient: '' },
  { color1: { r: 140, g: 150, b: 170 }, color2: { r: 120, g: 130, b: 150 }, color3: { r: 100, g: 110, b: 130 }, gradient: '' },
  { color1: { r: 120, g: 130, b: 150 }, color2: { r: 100, g: 110, b: 130 }, color3: { r: 80, g: 90, b: 110 }, gradient: '' },
  
  // 紫红色系
  { color1: { r: 150, g: 100, b: 140 }, color2: { r: 130, g: 80, b: 120 }, color3: { r: 110, g: 60, b: 100 }, gradient: '' },
  { color1: { r: 160, g: 110, b: 150 }, color2: { r: 140, g: 90, b: 130 }, color3: { r: 120, g: 70, b: 110 }, gradient: '' },
  { color1: { r: 140, g: 90, b: 130 }, color2: { r: 120, g: 70, b: 110 }, color3: { r: 100, g: 50, b: 90 }, gradient: '' },
  
  // 棕橙色系
  { color1: { r: 160, g: 140, b: 110 }, color2: { r: 140, g: 120, b: 90 }, color3: { r: 120, g: 100, b: 70 }, gradient: '' },
  { color1: { r: 170, g: 150, b: 120 }, color2: { r: 150, g: 130, b: 100 }, color3: { r: 130, g: 110, b: 80 }, gradient: '' },
  { color1: { r: 150, g: 130, b: 100 }, color2: { r: 130, g: 110, b: 80 }, color3: { r: 110, g: 90, b: 60 }, gradient: '' },
  
  // 青绿色系
  { color1: { r: 100, g: 170, b: 150 }, color2: { r: 80, g: 150, b: 130 }, color3: { r: 60, g: 130, b: 110 }, gradient: '' },
  { color1: { r: 110, g: 180, b: 160 }, color2: { r: 90, g: 160, b: 140 }, color3: { r: 70, g: 140, b: 120 }, gradient: '' },
  { color1: { r: 120, g: 160, b: 150 }, color2: { r: 100, g: 140, b: 130 }, color3: { r: 80, g: 120, b: 110 }, gradient: '' },
  
  // 蓝绿色系
  { color1: { r: 90, g: 150, b: 160 }, color2: { r: 70, g: 130, b: 140 }, color3: { r: 50, g: 110, b: 120 }, gradient: '' },
  { color1: { r: 100, g: 160, b: 180 }, color2: { r: 80, g: 140, b: 160 }, color3: { r: 60, g: 120, b: 140 }, gradient: '' },
  { color1: { r: 110, g: 150, b: 170 }, color2: { r: 90, g: 130, b: 150 }, color3: { r: 70, g: 110, b: 130 }, gradient: '' },
  
  // 紫蓝色系
  { color1: { r: 130, g: 110, b: 160 }, color2: { r: 110, g: 90, b: 140 }, color3: { r: 90, g: 70, b: 120 }, gradient: '' },
  { color1: { r: 140, g: 120, b: 170 }, color2: { r: 120, g: 100, b: 150 }, color3: { r: 100, g: 80, b: 130 }, gradient: '' },
  { color1: { r: 120, g: 100, b: 150 }, color2: { r: 100, g: 80, b: 130 }, color3: { r: 80, g: 60, b: 110 }, gradient: '' },
  
  // 红橙色系
  { color1: { r: 180, g: 110, b: 100 }, color2: { r: 160, g: 90, b: 80 }, color3: { r: 140, g: 70, b: 60 }, gradient: '' },
  { color1: { r: 190, g: 120, b: 110 }, color2: { r: 170, g: 100, b: 90 }, color3: { r: 150, g: 80, b: 70 }, gradient: '' },
  { color1: { r: 170, g: 100, b: 90 }, color2: { r: 150, g: 80, b: 70 }, color3: { r: 130, g: 60, b: 50 }, gradient: '' },
];

// 初始化渐变方案，降低饱和度并生成渐变字符串
function initializeGradientSchemes() {
  return GRADIENT_SCHEMES.map(scheme => {
    // 降低饱和度（使用0.4-0.6的饱和度因子）
    const satFactor = 0.5;
    const color1 = adjustSaturation(scheme.color1.r, scheme.color1.g, scheme.color1.b, satFactor);
    const color2 = adjustSaturation(scheme.color2.r, scheme.color2.g, scheme.color2.b, satFactor);
    const color3 = adjustSaturation(scheme.color3.r, scheme.color3.g, scheme.color3.b, satFactor);
    
    return {
      color1,
      color2,
      color3,
      gradient: generateThreeColorGradient(color1, color2, color3, {
        direction: '135deg',
        opacity: 0.85
      })
    };
  });
}

// 预初始化的渐变方案
export const INITIALIZED_GRADIENT_SCHEMES = initializeGradientSchemes();

/**
 * 获取随机渐变方案
 */
export function getRandomGradient(): string {
  const randomIndex = Math.floor(Math.random() * INITIALIZED_GRADIENT_SCHEMES.length);
  return INITIALIZED_GRADIENT_SCHEMES[randomIndex].gradient;
}