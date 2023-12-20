import { UserImage } from 'src/users/entities/user-image.entity';

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
  unitowner: true | false;
}
