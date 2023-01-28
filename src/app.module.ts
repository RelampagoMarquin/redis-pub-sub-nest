import { CacheModule, Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { createClient } from '@redis/client'
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'CACHE_MANAGER',
    useFactory: async () => {
      const client = createClient({
        url: 'redis://localhost:6379'
      })
      await client.connect();
      return client;
    }
  }],
})
export class AppModule {}
