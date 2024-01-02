import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
        description: '여기에 토큰 입력',
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
        description: '여기에 토큰 입력',
      },
      'refresh-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}
