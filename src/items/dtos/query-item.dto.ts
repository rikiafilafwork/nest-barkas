import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryItemDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  category: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  year: number;
}
