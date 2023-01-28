import { Inject, Injectable } from '@nestjs/common';
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

const clientOptions : ClientOptions = {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
    retryAttempts : 5,
    retryDelay : 5000
  },
}

@Injectable()
export class AppService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(clientOptions);
  }

  getUser(username) {
    return this.client.send<User, string>('get_user', username);
  }
}
