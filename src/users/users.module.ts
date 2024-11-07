import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc-options-scores';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCORES_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
