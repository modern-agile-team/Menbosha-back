import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRooms, ChatRoomsSchema } from './schemas/chat-rooms.schemas';
import { ChatImages, ChatImagesSchema } from './schemas/chat-images.schemas';
import { S3Module } from 'src/common/s3/s3.module';
import { ChatRepository } from './repositories/ChatRepository';
import { NotificationService } from './services/notification.service';
import { EventsGateway } from './events/events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRooms.name, schema: ChatRoomsSchema },
      { name: ChatImages.name, schema: ChatImagesSchema },
    ]),
    TypeOrmModule.forFeature([User]),
    S3Module,
    AuthModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, NotificationService, EventsGateway],
})
export class ChatModule {}
