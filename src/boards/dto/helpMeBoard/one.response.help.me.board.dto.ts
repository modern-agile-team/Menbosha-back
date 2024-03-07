import { UserImage } from '@src/users/entities/user-image.entity';

export class oneHelpMeBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  unitOwner: true | false;
  categoryId: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
  helpMeBoardImages: {
    id: number;
    imageUrl: string;
  }[];
}
