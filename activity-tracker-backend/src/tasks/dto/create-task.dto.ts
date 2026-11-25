import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsBoolean()
  @IsOptional()
  starred?: boolean;

  @IsArray()
  @IsOptional()
  subtasks?: Array<{ text: string; completed?: boolean }>;
}
