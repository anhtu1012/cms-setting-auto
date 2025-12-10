import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Do not throw on unknown properties; strip them instead.
      // This prevents 400 errors like "property X should not exist" when clients
      // send extra metadata (e.g., databaseId in some payloads).
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Enable CORS
  // Configure CORS from environment variable CORS_ORIGINS (comma-separated list)
  const rawOrigins = process.env.CORS_ORIGINS || '';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    // If no origins specified, disable strict origin checks (development friendly)
    app.enableCors({ origin: true, credentials: true });
    console.log('CORS: allowing any origin (no CORS_ORIGINS set)');
  } else {
    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl, Swagger UI)
        if (!origin) return callback(null, true);

        // Check if origin is in whitelist
        if (allowedOrigins.indexOf(origin) !== -1) {
          return callback(null, true);
        }

        // Log rejected origin for debugging
        console.log(
          `⚠️  CORS: Rejected origin "${origin}". Allowed origins: ${allowedOrigins.join(', ')}`,
        );
        return callback(new Error('CORS policy: Origin not allowed'), false);
      },
      credentials: true,
    });
    console.log(`✅ CORS: allowed origins: ${allowedOrigins.join(', ')}`);
  }

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CMS Setting Auto API')
    .setDescription('CMS system with MongoDB - API Documentation')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation is available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
