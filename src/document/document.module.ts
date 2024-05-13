import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DocumentService } from './document.service';
@Module({})
export class DocumentModule {
  imports: [HttpModule];
  providers: [DocumentService];
}
