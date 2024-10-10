import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { join } from 'path';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File) {
    console.log('uploadFile 함수 호출됨:', file.originalname);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return {
      data: response,
      status: 'success',
      error: null,
    };
  }

  async uploadFiles(files: Express.Multer.File[]) {
    console.log('uploadFiles 함수 호출됨:', files.length, '개의 파일');
    const response = files.map(file => ({
      originalname: file.originalname,
      filename: file.filename,
    }));
    return {
      data: response,
      status: 'success',
      error: null,
    };
  }

  async parseExcel(file: Express.Multer.File) {
    try {
      const workbook = XLSX.readFile(join(process.cwd(), 'temp', file.filename));
      const sheet_name_list = workbook.SheetNames;
      const sheet = workbook.Sheets[sheet_name_list[0]];
      
      const parsedData = [];
      let rowIndex = 3; // 시작 행 (B3부터 시작)
      
      while (sheet[`B${rowIndex}`]) {
        parsedData.push({
          id: sheet[`B${rowIndex}`]?.v,
          name: sheet[`C${rowIndex}`]?.v,
          age: sheet[`D${rowIndex}`]?.v
        });
        rowIndex++;
      }

      return {
        data: parsedData,
        status: 'success',
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        status: 'error',
        error: error.message,
      };
    }
  }
}