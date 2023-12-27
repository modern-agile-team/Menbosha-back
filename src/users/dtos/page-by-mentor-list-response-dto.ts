import { UserImage } from 'src/users/entities/user-image.entity';
// import { UserIntro } from '../entities/user-intro.entity';

export class PageByMentorListResponseDTO {
  id: number;
  name: string;
  userImage: UserImage | UserImage[];
  userIntro: {
    introduce: string;
    mainField: string;
  };
}
