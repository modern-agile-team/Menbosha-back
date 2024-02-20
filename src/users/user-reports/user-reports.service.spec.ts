import { Test, TestingModule } from '@nestjs/testing';
import { UserReportsService } from './user-reports.service';

describe('UserReportsService', () => {
  let service: UserReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserReportsService],
    }).compile();

    service = module.get<UserReportsService>(UserReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
