export class PageByMentorListResponseDTO {
  id: number;
  name: string;
  categoryId: number;
  rank: number;
  userImage: {
    imageId: number;
    imageUrl: string;
  };
  userIntro: {
    introduce: string;
    mainField: string;
  };
  reviewCount: number;
  boardCount: number;
}
