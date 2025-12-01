/**
 * Photo background color options
 */
export enum Colors {
  White = "#ffffff",
  Light = "#fafafa",
  Grey = "#bdbdbd",
  Dark = "#303030",
  Black = "#121212",  // Match dark theme background
}

/**
 * Color scheme for photo display - determines text/icon color based on background
 */
export interface ColorScheme {
  backgroundColor: string;
  color: string;
}

const LightBackgroundText = "#000000";
const DarkBackgroundText = "#ffffff";

/**
 * Get appropriate text/icon color for a given background color
 */
export function colorScheme(backgroundColor: string): ColorScheme {
  switch (backgroundColor) {
    case Colors.White:
    case Colors.Light:
    case Colors.Grey:
      return { backgroundColor, color: LightBackgroundText };
    case Colors.Dark:
    case Colors.Black:
      return { backgroundColor, color: DarkBackgroundText };
    default:
      return { backgroundColor: Colors.Light, color: LightBackgroundText };
  }
}

/**
 * Create a color with alpha transparency
 */
export function alpha(color: string, opacity: number): string {
  // Convert hex to rgb and add alpha
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
