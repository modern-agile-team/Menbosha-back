import { UserImage } from 'src/users/entities/user-image.entity';

export class oneBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  unitowner: true | false;
  userId: {
    // id: number;
    name: string;
    userImage: UserImage | UserImage[];
  };

  // boardImages: {
  //   id: number;
  //   imageUrl: string;
  // }[];
}
