import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

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
  subtasks?: Array<{ id?: number; text: string; completed?: boolean }>;
}
