export class CommentResponseDTO {
  id: number;
  content: string;
  commentOwner: boolean;
  user: {
    name: string;
    userId: number;
    rank: number;
    categoryId: number;
    imageUrl: string;
  };
}
