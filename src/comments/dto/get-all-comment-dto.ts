import { UserImage } from 'src/users/entities/user-image.entity';

export class CommentResponseDTO {
  id: number;
  content: string;
  commentOwner: boolean;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
