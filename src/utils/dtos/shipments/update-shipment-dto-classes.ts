import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsISO } from './iso-validator';

export class OriginDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @Transform(({ value }) => value.trim())
  @IsISO('location')
  LocationCode!: string;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value.trim())
  LocationName!: string;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value.trim())
  CountryCode!: string;
}

export class DestinationDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @Transform(({ value }) => value.trim())
  @IsISO('location')
  LocationCode!: string;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value.trim())
  LocationName!: string;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value.trim())
  CountryCode!: string;
}

export class DateAndTimesDto {
  @IsOptional()
  @IsString({ message: 'Scheduled departure must be a string' })
  @Transform(({ value }) => value.trim())
  ScheduledDeparture!: string;

  @IsOptional()
  @IsString({ message: 'Scheduled Arrival must be a string' })
  @Transform(({ value }) => value.trim())
  ScheduledArrival!: string;

  @IsOptional()
  @IsString({ message: 'Shipment data must be a string' })
  @Transform(({ value }) => value.trim())
  ShipmentDate!: string;
}

export class TotalWeightDto {
  @IsOptional()
  @IsNumber({}, { message: 'Weight value must be a number' })
  '*body'!: number;

  @IsOptional()
  @IsString({ message: 'Weight unit must be a string' })
  @Transform(({ value }) => value.trim())
  '@uom'!: string;
}

export class TotalVolumeDto {
  @IsOptional()
  @IsNumber({}, { message: 'Volume value must be a number' })
  '*body'!: number;

  @IsOptional()
  @IsString({ message: 'Volume unit must be a string' })
  @Transform(({ value }) => value.trim())
  '@uom'!: string;
}
export class TimestampDto {
  @IsOptional()
  @IsString({ message: 'Timestamp code must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampCode!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp description must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampDescription!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp date time must be a string' })
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value.trim(),
  )
  TimestampDateTime!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp location must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampLocation!: string;
}
