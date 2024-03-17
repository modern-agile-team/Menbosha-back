import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Module } from '@src/common/s3/s3.module';
import { UserModule } from '@src/users/user.module';
import { ChatController } from '@src/chat/controllers/chat.controller';
import { EventsGateway } from '@src/chat/events/events.gateway';
import { ChatRepository } from '@src/chat/repositories/chat.repository';
import {
  ChatImages,
  ChatImagesSchema,
} from '@src/chat/schemas/chat-images.schemas';
import {
  ChatRooms,
  ChatRoomsSchema,
} from '@src/chat/schemas/chat-rooms.schemas';
import { ChatService } from '@src/chat/services/chat.service';
import { NotificationService } from '@src/chat/services/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRooms.name, schema: ChatRoomsSchema },
      { name: ChatImages.name, schema: ChatImagesSchema },
    ]),
    S3Module,
    forwardRef(() => UserModule),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, NotificationService, EventsGateway],
  exports: [ChatService],
})
export class ChatModule {}
