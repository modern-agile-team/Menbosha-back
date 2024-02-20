import { Test, TestingModule } from '@nestjs/testing';
import { UserReportsController } from './user-reports.controller';

describe('UserReportsController', () => {
  let controller: UserReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReportsController],
    }).compile();

    controller = module.get<UserReportsController>(UserReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
