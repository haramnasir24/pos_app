/**
 * Builds a map from image ID to image URL for quick lookup
 */
export function buildImageMap(images: any[]): Record<string, string> {
  const imageMap: Record<string, string> = {};

  images.forEach((img: any) => {
    imageMap[img.id] = img.image_data?.url;
  });

  return imageMap;
}
