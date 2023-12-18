import { UserImage } from 'src/users/entities/user-image.entity';

export class PageByHelpMeBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  category: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
