import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: join(__dirname, 'proto/users.proto'),
    url: 'localhost:50051',
  },
};
