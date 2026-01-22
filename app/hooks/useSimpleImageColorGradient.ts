import { useState, useEffect, useCallback } from 'react';
import {
  extractDominantColorCanvas,
  generateHarmoniousGradient,
  getDefaultGradient,
  rgbToHex,
  RGBColor
} from '../lib/simple-color-utils';

export interface BackgroundGradient {
  gradient: string;
  startColor: string;
  endColor: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * 简化版颜色提取 Hook - 使用 Canvas API
 */
export function useSimpleImageColorGradient(imageUrl: string | null): BackgroundGradient {
  const [gradient, setGradient] = useState<string>('');
  const [startColor, setStartColor] = useState<string>('');
  const [endColor, setEndColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const extractAndGenerateGradient = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 提取主色调
      const dominantColor = await extractDominantColorCanvas(url);

      let gradientData;

      if (dominantColor) {
        // 基于主色调生成和谐渐变
        gradientData = generateHarmoniousGradient(dominantColor);
      } else {
        // 使用默认渐变
        gradientData = getDefaultGradient();
      }

      setGradient(gradientData.gradient);
      setStartColor(rgbToHex(gradientData.startColor.r, gradientData.startColor.g, gradientData.startColor.b));
      setEndColor(rgbToHex(gradientData.endColor.r, gradientData.endColor.g, gradientData.endColor.b));

    } catch (err) {
      console.error('颜色提取失败:', err);
      setError('颜色提取失败');

      // 使用默认渐变
      const defaultGradient = getDefaultGradient();
      setGradient(defaultGradient.gradient);
      setStartColor(rgbToHex(defaultGradient.startColor.r, defaultGradient.startColor.g, defaultGradient.startColor.b));
      setEndColor(rgbToHex(defaultGradient.endColor.r, defaultGradient.endColor.g, defaultGradient.endColor.b));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (imageUrl) {
      extractAndGenerateGradient(imageUrl);
    } else {
      // 没有图片时使用默认渐变
      const defaultGradient = getDefaultGradient();
      setGradient(defaultGradient.gradient);
      setStartColor(rgbToHex(defaultGradient.startColor.r, defaultGradient.startColor.g, defaultGradient.startColor.b));
      setEndColor(rgbToHex(defaultGradient.endColor.r, defaultGradient.endColor.g, defaultGradient.endColor.b));
      setIsLoading(false);
      setError(null);
    }
  }, [imageUrl, extractAndGenerateGradient]);

  return {
    gradient,
    startColor,
    endColor,
    isLoading,
    error
  };
}