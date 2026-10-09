export type CategoryStyle = {
  /** badge background */
  bg: string;
  /** badge text */
  text: string;
  /** node / dot color */
  dot: string;
};

const DEFAULT_STYLE: CategoryStyle = { bg: "#EFEFEC", text: "#3A3A35", dot: "#8B8A82" };

/**
 * A restrained categorical set: one low-saturation hue per support category,
 * each pairing a light tint with a dark text tone for AA contrast.
 */
export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  ORDER: { bg: "#E7ECF6", text: "#2E4374", dot: "#41598F" },
  SHIPPING: { bg: "#F6EEDB", text: "#775714", dot: "#A07A1E" },
  CANCEL: { bg: "#F7E9EA", text: "#8A3039", dot: "#A8454E" },
  INVOICE: { bg: "#EEE9F6", text: "#57407E", dot: "#7057A0" },
  PAYMENT: { bg: "#E6F1E9", text: "#1F6A44", dot: "#2C8A5B" },
  REFUND: { bg: "#E3F0EE", text: "#0E6B62", dot: "#178C80" },
  FEEDBACK: { bg: "#EAECF7", text: "#3A3F87", dot: "#5157A8" },
  CONTACT: { bg: "#E2EFF4", text: "#17607A", dot: "#237E9C" },
  ACCOUNT: { bg: "#F7ECE2", text: "#8A4A1F", dot: "#AB612C" },
  DELIVERY: { bg: "#EDF0E0", text: "#56601E", dot: "#71811F" },
  SUBSCRIPTION: { bg: "#F4E9F1", text: "#7A2E5E", dot: "#9C3F79" },
};

export function categoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}
