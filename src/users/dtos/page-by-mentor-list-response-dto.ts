import { UserImage } from 'src/users/entities/user-image.entity';

export class PageByMentorListResponseDTO {
  id: number;
  name: string;
  userImage: UserImage | UserImage[];
  userIntro: {
    introduce: string;
    mainField: string;
  };

  // constructor() {
  //   // 초기값 설정
  //   this.userIntro = {
  //     introduce: '',
  //     mainField: '',
  //   };
  // }
}
