import { UserImage } from 'src/users/entities/user-image.entity';

export class PullingUpHelpMeBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  pullingUp: Date;
  category: number;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
