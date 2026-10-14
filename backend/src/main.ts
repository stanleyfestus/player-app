import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL || '*' });
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.flatMap(err => Object.values(err.constraints ?? {}))
      new Logger('ValidationPipe').warn(`Validation failed: ${messages.join(', ')}`);
      return new BadRequestException(errors);

    },
  }));

  // This is what makes the frontend's types generation possible: Nest
  // reads every DTO and every @Api... decorator below and builds a full
  // OpenAPI spec from them. /docs is the human-readable page; /docs-json
  // is the raw spec the frontend's type generator reads from.
  const config = new DocumentBuilder()
    .setTitle('Football Agency API')
    .setDescription('Player registration, admin approval, and auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  console.log(`API docs at http://localhost:${port}/docs`);
}
bootstrap();
