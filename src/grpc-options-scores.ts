import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'scores',
    url: 'localhost:50201',
    protoPath: join(__dirname, 'protos/scores.proto'),
  }
}