/**
 * 简化版颜色提取工具 - 使用 Canvas API
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
 * 使用 Canvas API 提取图片主色调
 */
export async function extractDominantColorCanvas(imageUrl: string): Promise<RGBColor | null> {
  const colors = await extractColorPaletteCanvas(imageUrl, 1);
  return colors.length > 0 ? colors[0] : null;
}

/**
 * 从图片提取调色板（使用 Canvas API）
 */
export async function extractColorPaletteCanvas(imageUrl: string, colorCount: number = 10): Promise<RGBColor[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // 创建 canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve([]);
          return;
        }

        // 设置较小的尺寸以提高性能
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        // 绘制图片
        ctx.drawImage(img, 0, 0, size, size);

        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        // 统计颜色
        const colorMap = new Map<string, number>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          // 跳过透明像素
          if (alpha < 128) continue;

          // 将颜色量化以减少噪音
          const quantizedR = Math.floor(r / 32) * 32;
          const quantizedG = Math.floor(g / 32) * 32;
          const quantizedB = Math.floor(b / 32) * 32;

          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }

        // 按频率排序颜色
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([colorKey]) => {
            const [r, g, b] = colorKey.split(',').map(Number);
            return { r, g, b };
          });

        // 返回前 N 个颜色
        resolve(sortedColors.slice(0, colorCount));
      } catch (error) {
        console.error('Canvas 颜色提取失败:', error);
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
 * 计算两个颜色之间的差异（欧几里得距离）
 */
export function calculateColorDistance(color1: RGBColor, color2: RGBColor): number {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * 从调色板中找出差异最大的两个颜色
 */
export function findMaxDistanceColors(colors: RGBColor[]): {
  color1: RGBColor;
  color2: RGBColor;
  distance: number;
} | null {
  if (colors.length < 2) return null;

  let maxDistance = 0;
  let result = { color1: colors[0], color2: colors[1], distance: 0 };

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const distance = calculateColorDistance(colors[i], colors[j]);
      if (distance > maxDistance) {
        maxDistance = distance;
        result = {
          color1: colors[i],
          color2: colors[j],
          distance
        };
      }
    }
  }

  return result;
}

/**
 * 生成渐变背景样式
 */
export interface GradientOptions {
  direction?: string;
  opacity?: number;
}

export function generateGradientBackground(
  startColor: RGBColor,
  endColor: RGBColor,
  options: GradientOptions = {}
): string {
  const {
    direction = '135deg',
    opacity = 0.9,
  } = options;

  const startRgba = `rgba(${startColor.r}, ${startColor.g}, ${startColor.b}, ${opacity})`;
  const endRgba = `rgba(${endColor.r}, ${endColor.g}, ${endColor.b}, ${opacity * 0.7})`;

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
    startColor = { r, g, b };
    endColor = adjustBrightness(r, g, b, 0.3);
  } else {
    // 浅色主调：创建从浅色到中等深度的渐变
    startColor = adjustBrightness(r, g, b, 1.1);
    endColor = adjustBrightness(r, g, b, 0.5);
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
 * 从图片提取调色板并生成基于最大差异颜色的渐变
 */
export async function generateMaxDistanceGradient(imageUrl: string): Promise<{
  startColor: RGBColor;
  endColor: RGBColor;
  gradient: string;
}> {
  try {
    // 提取调色板（10个主色调）
    const colors = await extractColorPaletteCanvas(imageUrl, 10);

    if (colors.length < 2) {
      // 如果颜色不足，使用默认渐变
      return getDefaultGradient();
    }

    // 找出差异最大的两个颜色
    const maxDistanceResult = findMaxDistanceColors(colors);

    if (maxDistanceResult && maxDistanceResult.distance > 100) {
      // 如果差异足够大，使用这两个颜色
      const gradient = generateGradientBackground(maxDistanceResult.color1, maxDistanceResult.color2, {
        direction: '135deg',
        opacity: 0.9
      });

      return {
        startColor: maxDistanceResult.color1,
        endColor: maxDistanceResult.color2,
        gradient
      };
    } else {
      // 如果差异太小，使用第一个颜色生成和谐渐变
      return generateHarmoniousGradient(colors[0]);
    }
  } catch (error) {
    console.error('生成渐变失败:', error);
    return getDefaultGradient();
  }
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