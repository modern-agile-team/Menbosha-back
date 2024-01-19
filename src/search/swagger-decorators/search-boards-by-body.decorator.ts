import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiSearchBoardsByBody() {
  return applyDecorators(
    ApiOperation({
      summary: '게시글 검색 API',
      description: `Query String의 내용과 Param으로 입력된 카테고리를 토대로 게시글의 본문에 일치하는 값을 조회합니다(카테고리에 "전체" 입력 시 전체 게시판 검색). 
      ex)'흑돼지 고기' 검색 - '흑돼지', '고기' 라는 단어 단위로 검색. (정확성 순으로 정렬됨)`,
      deprecated: true,
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 검색한 게시글(본문 기준) 조회',
      content: {
        JSON: {
          example: {
            data: [
              {
                id: 286,
                head: '흑돼지고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:33:59.713Z',
                updateAt: '2023-11-01T21:33:59.713Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 293,
                head: '흑돼지고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:25.623Z',
                updateAt: '2023-11-01T21:34:25.623Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 292,
                head: '백돼지고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:21.670Z',
                updateAt: '2023-11-01T21:34:21.670Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 287,
                head: '흑돼지 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:01.707Z',
                updateAt: '2023-11-01T21:34:01.707Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 294,
                head: '흑돼지 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:32.500Z',
                updateAt: '2023-11-01T21:34:32.500Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 289,
                head: '양 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:10.379Z',
                updateAt: '2023-11-01T21:34:10.379Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 290,
                head: '백 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:16.132Z',
                updateAt: '2023-11-01T21:34:16.132Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 291,
                head: '백고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:17.954Z',
                updateAt: '2023-11-01T21:34:17.954Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 295,
                head: '기린고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:36.688Z',
                updateAt: '2023-11-01T21:34:36.688Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 296,
                head: '소고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:40.449Z',
                updateAt: '2023-11-01T21:34:40.449Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 297,
                head: '소 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:42.169Z',
                updateAt: '2023-11-01T21:34:42.169Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 298,
                head: '소 고기',
                body: '흑돼지',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:39:22.442Z',
                updateAt: '2023-11-01T21:39:22.442Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 300,
                head: '소 고기',
                body: '백돼지기',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:39:30.715Z',
                updateAt: '2023-11-01T21:39:30.715Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
            ],
            meta: {
              total: 13,
              page: 1,
              last_page: 1,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '페이지 조회 실패.',
      content: {
        JSON: {
          example: {
            message: '해당 페이지는 존재하지 않습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
  );
}
