import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,    
    forbidNonWhitelisted:true
  }))


  const config = new DocumentBuilder()
  .setTitle("Learning-Management-System")
  .setVersion("1")
  .addBearerAuth()
  .addBearerAuth()
  .build()
  



  let document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("swagger",app,document)
  
  
  
  
  await app.listen(process.env.PORT ?? 3000);

  console.log(`http://localhost:${process.env.PORT ?? 3000}/swagger`);
  


}
bootstrap();
