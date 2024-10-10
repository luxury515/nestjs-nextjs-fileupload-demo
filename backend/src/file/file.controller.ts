import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';  // 이 줄을 추가
import { extname } from 'path';  // 이 줄을 추가
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './temp',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    console.log('Received file:', file); // 디버깅을 위한 로그
    return this.fileService.uploadFile(file);
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './temp',
      filename: (req, file, callback) => {
        console.log('파일 이름 생성 중:', file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFilename = file.fieldname + '-' + uniqueSuffix + extname(file.originalname);
        console.log('생성된 파일 이름:', newFilename);
        callback(null, newFilename);
      },
    }),
  }))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('uploadFiles 컨트롤러 메서드 시작');
    console.log('받은 파일 수:', files ? files.length : 0);

    if (!files || files.length === 0) {
      console.log('파일이 없어 BadRequestException 발생');
      throw new BadRequestException('At least one file is required');
    }

    console.log('파일 정보:', files.map(f => ({ name: f.originalname, size: f.size })));


    try {
      const result = await this.fileService.uploadFiles(files);
      console.log('파일 서비스 응답:', result);
      return result;
    } catch (error) {
      console.error('파일 업로드 중 에러 발생:', error);
      throw error;
    }
  }

  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './temp',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.parseExcel(file);
  }
}