import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import "dotenv/config";


const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

bootstrap().then(() => console.log(`server started on PORT ${PORT}`));