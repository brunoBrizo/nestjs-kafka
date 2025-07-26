import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumberString()
  @IsNotEmpty()
  totalAmount: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
