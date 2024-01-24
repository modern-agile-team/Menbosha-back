export class PageByMentorListResponseDTO {
  id: number;
  name: string;
  categoryId: number;
  userImage: {
    imageId: number;
    imageUrl: string;
  };
  userIntro: {
    shortIntro: string;
    career: string;
  };
  reviewCount: number;
  boardCount: number;
}
