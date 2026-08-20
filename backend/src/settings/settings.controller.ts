import { Controller, Get, Put, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SettingsService } from './settings.service';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  updateSettings(@Body() data: any) {
    return this.settingsService.updateSettings(data);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file uploaded');
    const base64Image = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64Image}`;
    return {
      url: dataUri,
    };
  }
}
