import { Controller, Param, Post } from '@nestjs/common';

@Controller('users/:userId/reports')
export class ReportsController {
  @Post()
  create(@Param('userId') userId: number) {}
}
