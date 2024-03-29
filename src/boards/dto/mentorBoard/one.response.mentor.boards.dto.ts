import { UserImage } from '@src/entities/UserImage';

export class oneMentorBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  unitOwner: boolean;
  categoryId: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
  mentorBoardImages: {
    id: number;
    imageUrl: string;
  }[];
  mentorBoardLikes: number;
  isLike: boolean;
}
