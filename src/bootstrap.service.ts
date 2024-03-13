import {
  HttpStatus,
  INestApplication,
  Injectable,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { BannedUserExceptionFilter } from '@src/http-exceptions/exception-filters/banned-user-exception.filter';
// import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/exception-filters/http-bad-request-exception.filter';
// import { HttpConflictExceptionFilter } from '@src/http-exceptions/exception-filters/http-conflict-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/exception-filters/http-forbidden-exception.filter';
// import { HttpInternalServerErrorExceptionFilter } from '@src/http-exceptions/exception-filters/http-internal-server-error-exception.filter';
// import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/exception-filters/http-not-found-exception';
// import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/exception-filters/http-path-not-found-exception';
// import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/exception-filters/http-process-error-exception.filter';
// import { HttpRemainderExceptionFilter } from '@src/http-exceptions/exception-filters/http-remainder-exception.filter';
// import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/exception-filters/http-unauthorized-exception.filter';
import * as cookieParser from 'cookie-parser';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

@Injectable()
export class BootstrapService {
  setLogger(app: INestApplication) {
    const logger = new Logger();

    app.useLogger(logger);
  }

  setCors(app: INestApplication) {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    let allowOrigin: string[] | true;

    if (appConfigService.isProduction()) {
      allowOrigin = appConfigService.getList(
        ...[
          ENV_KEY.FRONT_PRODUCTION_DOMAIN,
          ENV_KEY.FRONT_PRODUCTION_WWW_DOMAIN,
          ENV_KEY.FRONT_LOCAL_DOMAIN,
        ],
      ) as string[];
    }

    if (appConfigService.isDevelopment()) {
      allowOrigin = appConfigService.getList(
        ...[ENV_KEY.FRONT_DEVELOPMENT_DOMAIN, ENV_KEY.FRONT_LOCAL_DOMAIN],
      ) as string[];
    }

    app.enableCors({
      /**
       * @todo 마지막 배포 단계가 되면 production 환경은 로컬에서의 요청은 아예 허용하지 않음. 오직 프론트의 https 적용된 프론트 도메인만 허용.
       * 추후 development 환경의 서버를 새로 개설해야 함.
       * staging server 까지 따로 열 계획은 없기 때문에 환경 자체는 최대한 운영 서버 환경과 거의 100% 비슷할 정도로 환경을 맞춰야 함.
       * development 환경의 허용 도메인은 development 환경의 프론트 서버 도메인 및 로컬에서의 요청 허용
       * 추후 프론트의 admin 전용 서버가 열리면 production 환경에서 프론트의 admin 서버 도메인도 허용(아마 development 환경에서도)
       */
      origin: allowOrigin || true,
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    });
  }

  setPipe(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe());
  }

  setSwagger(app: INestApplication) {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    if (appConfigService.isProduction()) {
      return;
    }

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

  async setAsyncApiDoc(app: INestApplication) {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    if (appConfigService.isProduction()) {
      return;
    }

    const asyncApiOptions = new AsyncApiDocumentBuilder()
      .setTitle('ma6-main-asyncapi')
      .setDescription('모던애자일 6기 메인프로젝트 AsyncAPI 문서')
      .setVersion('1.0')
      .setDefaultContentType('application/json')
      .build();

    const asyncApiDocument = AsyncApiModule.createDocument(
      app,
      asyncApiOptions,
    );

    await AsyncApiModule.setup('asyncapi', app, asyncApiDocument);
  }

  setCookieParser(app: INestApplication) {
    app.use(cookieParser());
  }

  setFilters(app: INestApplication) {
    app.useGlobalFilters(
      //   app.get(HttpProcessErrorExceptionFilter),
      //   app.get(HttpRemainderExceptionFilter),
      //   app.get(HttpInternalServerErrorExceptionFilter),
      //   app.get(HttpConflictExceptionFilter),
      //   app.get(HttpNotFoundExceptionFilter),
      //   app.get(HttpPathNotFoundExceptionFilter),
      app.get(HttpForbiddenExceptionFilter),
      app.get(BannedUserExceptionFilter),
      //   app.get(HttpUnauthorizedExceptionFilter),
      //   app.get(HttpBadRequestExceptionFilter),
    );
  }

  async startingServer(app: INestApplication) {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    const PORT = appConfigService.get<number>(ENV_KEY.PORT);

    await app.listen(PORT);

    console.info(`Server listening on port ${PORT}`);
  }
}
