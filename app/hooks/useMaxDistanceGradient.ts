import { useState, useEffect, useCallback } from 'react';
import {
  generateMaxDistanceGradient,
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
 * 从图片提取最大差异颜色生成背景渐变的 Hook
 * 此 Hook 会从图片中提取多个颜色，找出差异最大的两个颜色作为渐变的起始和结束色
 */
export function useMaxDistanceGradient(imageUrl: string | null): BackgroundGradient {
  const [gradient, setGradient] = useState<string>('');
  const [startColor, setStartColor] = useState<string>('');
  const [endColor, setEndColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const extractAndGenerateGradient = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 提取调色板并生成基于最大差异颜色的渐变
      const gradientData = await generateMaxDistanceGradient(url);

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
