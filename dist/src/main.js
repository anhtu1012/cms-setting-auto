"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    const rawOrigins = process.env.CORS_ORIGINS || '';
    const allowedOrigins = rawOrigins
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    if (allowedOrigins.length === 0) {
        app.enableCors({ origin: true, credentials: true });
        console.log('CORS: allowing any origin (no CORS_ORIGINS set)');
    }
    else {
        app.enableCors({
            origin: (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                if (allowedOrigins.indexOf(origin) !== -1) {
                    return callback(null, true);
                }
                console.log(`⚠️  CORS: Rejected origin "${origin}". Allowed origins: ${allowedOrigins.join(', ')}`);
                return callback(new Error('CORS policy: Origin not allowed'), false);
            },
            credentials: true,
        });
        console.log(`✅ CORS: allowed origins: ${allowedOrigins.join(', ')}`);
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CMS Setting Auto API')
        .setDescription('CMS system with MongoDB - API Documentation')
        .setVersion('1.0')
        .addTag('users', 'User management endpoints')
        .addTag('settings', 'Settings management endpoints')
        .addTag('content', 'Content management endpoints')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`Swagger documentation is available at: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map