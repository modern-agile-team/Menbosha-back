import { UserImage } from 'src/users/entities/user-image.entity';

export class oneBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  unitowner: true | false;
  category: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
