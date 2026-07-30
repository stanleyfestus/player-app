import { IsIn } from 'class-validator';

export class UpdatePlayerStatusDto {
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
