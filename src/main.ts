import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: true,
      bufferLogs: true,
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      transform: true 
    })
  );
  
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')
  const portTcp = configService.get('PORT_TCP')
  const microserviceName = configService.get('MICROSERVICE_NAME')

  app.connectMicroservice({
    transport: Transport.REDIS,
    options : {
      url: 'redis://redis:6379'
    }
  })

  // Listen as Microservices
  await app.startAllMicroservices();


  app.enableCors();

  // Listen HTTP services
  await app.listen(port, () => {
    if (configService.get('NODE_ENV') === 'dev') {
      Logger.log(`Listen on port: ${port}`)
      Logger.log(`Transport TCP on port: ${portTcp}`)
    }
  })

  Logger.log(`${microserviceName} microservice running`);
}
bootstrap();
