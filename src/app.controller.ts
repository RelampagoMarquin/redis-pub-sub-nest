import { Controller, Get, Inject, MessageEvent, Query, Sse } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { RedisClientType } from 'redis';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject('CACHE_MANAGER') private redisClient : RedisClientType) {}

  @Get()
  getUser(@Query() query){

    //fazer um publish, o var é a key, desta forma a mensagem da risada
    // aparecerá no canal var
    this.redisClient.publish('var', "AHAHAHA");
  }

  @Sse("watch")
  watchVariable() : Observable<MessageEvent> {
    //criar um enventsource no browser para ficar escutando
    return new Observable(subscriber => {
      (async () => {
        let client;
        try {
          client = await this.redisClient.duplicate();
          client.then.connect().then(() => {
            this.redisClient.subscribe("var", (message, channel) => {
              console.log(message)
              subscriber.next({data: message})
            })
          })
        } catch (error) {
          console.log(error);
          
        }
        return () => {
          console.log("Disconectou...");
          
          subscriber.unsubscribe();
          client.disconnect();
        }
      })();
    })
  }


}
