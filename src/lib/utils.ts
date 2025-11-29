/**
 * Convert camera model name to URL-friendly ID
 * Example: "LEICA Q2" -> "leica-q2"
 */
export function modelToId(model: string): string {
  return model.toLowerCase().replace(/\s+/g, '-');
}