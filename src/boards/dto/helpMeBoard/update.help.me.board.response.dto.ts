import { UserImage } from '@src/entities/UserImage';

export class HelpMeBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
  unitOwner: true | false;
}
