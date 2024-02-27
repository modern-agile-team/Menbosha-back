import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Menbosha API')
    .setDescription('모던애자일 6기 멘보샤 프로젝트 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '액세스 토큰 입력',
        in: 'header',
      },
      'access-token',
    )
    .addCookieAuth(
      'refreshToken-cookie',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
        description: '리프레시 토큰 입력',
      },
      'refresh-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (a: Map<any, any>, b: Map<any, any>) => {
        const order = {
          post: '0',
          get: '1',
          put: '2',
          patch: '3',
          delete: '4',
        };

        return order[a.get('method')].localeCompare(order[b.get('method')]);
      },
    },
  };
  SwaggerModule.setup('swagger', app, document, { ...swaggerCustomOptions });
}
