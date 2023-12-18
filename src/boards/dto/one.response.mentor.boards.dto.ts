import { UserImage } from 'src/users/entities/user-image.entity';

export class oneMentorBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  unitowner: true | false;
  categoryId: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
