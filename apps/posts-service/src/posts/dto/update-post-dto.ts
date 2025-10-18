import { IsOptional, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  content?: string;
}
