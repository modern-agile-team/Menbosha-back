import { UserImage } from 'src/users/entities/user-image.entity';

export class BoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  userId: {
    name: string;
    userImage: UserImage | UserImage[];
  };

  // boardImages: {
  //   id: number;
  //   imageUrl: string;
  // }[];
}
