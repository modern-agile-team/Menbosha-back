export class PageByMentorListResponseDTO {
  id: number;
  name: string;
  categoryId: number;
  userImage: {
    imageId: number;
    imageUrl: string;
  };
  userIntro: {
    introduce: string;
    mainField: string;
  };
  countReviews: number;
  countBoards: number;
}
