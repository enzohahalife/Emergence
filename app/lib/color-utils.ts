import ColorThief from 'colorthief';

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
 * 从图片提取主色调
 */
export async function extractDominantColor(imageUrl: string): Promise<RGBColor | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);

        if (dominantColor && dominantColor.length === 3) {
          resolve({
            r: dominantColor[0],
            g: dominantColor[1],
            b: dominantColor[2]
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('颜色提取失败:', error);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.error('图片加载失败:', imageUrl);
      resolve(null);
    };

    img.src = imageUrl;
  });
}

/**
 * 从图片提取调色板
 */
export async function extractColorPalette(imageUrl: string, colorCount: number = 5): Promise<RGBColor[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, colorCount);

        if (palette && palette.length > 0) {
          const colors = palette.map((color: number[]) => ({
            r: color[0],
            g: color[1],
            b: color[2]
          }));
          resolve(colors);
        } else {
          resolve([]);
        }
      } catch (error) {
        console.error('调色板提取失败:', error);
        resolve([]);
      }
    };

    img.onerror = () => {
      console.error('图片加载失败:', imageUrl);
      resolve([]);
    };

    img.src = imageUrl;
  });
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