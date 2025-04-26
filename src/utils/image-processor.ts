import sharp from "sharp";

export class ImageProcessor {
  private static readonly MAX_SIZE = 2 * 1024 * 1024; // 2MB

  /**
   * base64 이미지를 압축하여 Buffer로 반환
   * @param base64Image base64로 인코딩된 이미지
   * @returns 압축된 이미지 Buffer
   */
  static async compressImage(base64Image: string): Promise<Buffer> {
    const imageBuffer = Buffer.from(base64Image, "base64");

    // 이미지 크기가 2MB 이하면 그대로 반환
    if (imageBuffer.length <= this.MAX_SIZE) {
      return imageBuffer;
    }

    // 이미지 메타데이터 가져오기
    const metadata = await sharp(imageBuffer).metadata();

    // 압축 품질 계산 (2MB를 기준으로 비율 계산)
    const quality = Math.floor((this.MAX_SIZE / imageBuffer.length) * 100);

    // 이미지 크기 조절 계수 계산
    const scale = Math.sqrt(this.MAX_SIZE / imageBuffer.length);
    const width = Math.floor((metadata.width || 1000) * scale);
    const height = Math.floor((metadata.height || 1000) * scale);

    // 이미지 압축
    const compressedBuffer = await sharp(imageBuffer)
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: Math.max(quality, 60), // 최소 품질 60으로 제한
        progressive: true,
      })
      .toBuffer();

    // 압축 후에도 2MB를 초과하면 더 강하게 압축
    if (compressedBuffer.length > this.MAX_SIZE) {
      return await sharp(compressedBuffer)
        .jpeg({
          quality: 60,
          progressive: true,
        })
        .toBuffer();
    }

    return compressedBuffer;
  }

  /**
   * 이미지 크기 확인
   * @param imageBuffer 이미지 버퍼
   * @returns 이미지 크기가 2MB를 초과하는지 여부
   */
  static isOversize(imageBuffer: Buffer): boolean {
    return imageBuffer.length > this.MAX_SIZE;
  }

  /**
   * 이미지 메타데이터 확인
   * @param imageBuffer 이미지 버퍼
   * @returns 이미지 메타데이터
   */
  static async getMetadata(imageBuffer: Buffer) {
    return await sharp(imageBuffer).metadata();
  }
}
