import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { BootstrapService } from '@src/bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const bootstrapService = app.get<BootstrapService>(BootstrapService);

  bootstrapService.setLogger(app);
  bootstrapService.setCors(app);
  bootstrapService.setPipe(app);
  bootstrapService.setSwagger(app);
  bootstrapService.setAsyncApiDoc(app);
  bootstrapService.setCookieParser(app);
  bootstrapService.setFilters(app);
  await bootstrapService.startingServer(app);
}
bootstrap();
