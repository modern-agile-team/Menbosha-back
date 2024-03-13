import { UserImage } from '@src/entities/UserImage';

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
