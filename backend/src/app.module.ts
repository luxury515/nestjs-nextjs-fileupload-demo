import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module'; // Make sure this import is present

@Module({
  imports: [FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
