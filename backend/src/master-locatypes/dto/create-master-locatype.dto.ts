import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMasterLocatypeDto {
  @ApiProperty({ description: 'Locatype Code (e.g. HOTEL, TOUR)' })
  @IsString()
  @IsNotEmpty()
  locatype_code: string;

  @ApiProperty({ description: 'Locatype Name (e.g. Hotel, Tour/Transfer)' })
  @IsString()
  @IsNotEmpty()
  locatype_name: string;

  @ApiProperty({ description: 'Locatype Description', required: false })
  @IsString()
  @IsOptional()
  locatype_desc?: string;
}

export class UpdateMasterLocatypeDto extends CreateMasterLocatypeDto {}
