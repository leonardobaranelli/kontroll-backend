import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsISO } from './iso-validator';

type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

export class OriginDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @IsISO('location')
  @Transform(({ value }) => value?.trim() || null)
  LocationCode?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  LocationName?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value?.trim() || null)
  CountryCode?: MaybeString;
}

export class DestinationDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @IsISO('location')
  @Transform(({ value }) => value?.trim() || null)
  LocationCode?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  LocationName?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value?.trim() || null)
  CountryCode?: MaybeString;
}

export class DateAndTimesDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Scheduled departure must be a valid date string' },
  )
  @Transform(({ value }) => value?.trim() || null)
  ScheduledDeparture?: MaybeDate;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Scheduled Arrival must be a valid date string' },
  )
  @Transform(({ value }) => value?.trim() || null)
  ScheduledArrival?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'Shipment date must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  ShipmentDate?: MaybeDate;
}

export class TotalWeightDto {
  @IsOptional()
  @IsNumber({}, { message: 'Weight value must be a number' })
  @Transform(({ value }) => (value === '' ? null : Number(value)))
  '*body': MaybeNumber;

  @IsOptional()
  @IsString({ message: 'Weight unit must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  '@uom': MaybeString;
}

export class TotalVolumeDto {
  @IsOptional()
  @IsNumber({}, { message: 'Volume value must be a number' })
  @Transform(({ value }) => (value === '' ? null : Number(value)))
  '*body': MaybeNumber;

  @IsOptional()
  @IsString({ message: 'Volume unit must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  '@uom': MaybeString;
}

export class TimestampDto {
  @IsOptional()
  @IsString({ message: 'Timestamp code must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampCode?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Timestamp description must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampDescription?: MaybeString;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Timestamp date time must be a valid date string' },
  )
  @Transform(({ value }) => value?.trim() || null)
  TimestampDateTime?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Timestamp location must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampLocation?: MaybeString;
}

export class shipmentContentDto {
  @IsOptional()
  @IsString({ message: 'Housebill number must be a string' })
  @Transform(({ value }) => value.trim())
  HousebillNumber: string = '';

  @IsOptional()
  @ValidateNested()
  @Type(() => OriginDto)
  Origin?: OriginDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DestinationDto)
  Destination?: DestinationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateAndTimesDto)
  DateAndTimes?: DateAndTimesDto;

  @IsOptional()
  @IsString({ message: 'Product type must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly ProductType?: MaybeString;

  @IsOptional()
  @IsNumber({}, { message: 'Total packages must be a valid number' })
  readonly TotalPackages?: MaybeNumber;

  @IsOptional()
  @ValidateNested()
  @Type(() => TotalWeightDto)
  TotalWeight?: TotalWeightDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TotalVolumeDto)
  TotalVolume?: TotalVolumeDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimestampDto)
  Timestamp?: TimestampDto[];

  @IsOptional()
  @IsString({ message: 'Broker name must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly brokerName?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Incoterms must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly incoterms?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'Shipment date must be a valid date string' })
  @Transform(({ value }) => value?.trim())
  readonly shipmentDate?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Booking must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly booking?: MaybeString;

  @IsOptional()
  @IsString({ message: 'MAWB must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly mawb?: MaybeString;

  @IsOptional()
  @IsString({ message: 'HAWB must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly hawb?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Flight must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly flight?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Airport of departure must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly airportOfDeparture?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'ETD must be a valid date string' })
  @Transform(({ value }) => value?.trim())
  readonly etd?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'ATD must be a valid date string' })
  @Transform(({ value }) => value?.trim())
  readonly atd?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Airport of arrival must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly airportOfArrival?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'ETA must be a valid date string' })
  @Transform(({ value }) => value?.trim())
  readonly eta?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'ATA must be a valid date string' })
  @Transform(({ value }) => value?.trim())
  readonly ata?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Vessel must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly vessel?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Port of loading must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly portOfLoading?: MaybeString;

  @IsOptional()
  @IsString({ message: 'MBL must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly mbl?: MaybeString;

  @IsOptional()
  @IsString({ message: 'HBL must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly hbl?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'Pickup date must be a valid date string' })
  @Transform(({ value }) => value?.trim())
  readonly pickupDate?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Container number must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly containerNumber?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Port of unloading must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly portOfUnloading?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Final destination must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly finalDestination?: MaybeString;

  @IsOptional()
  @IsString({ message: 'International carrier must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly internationalCarrier?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Voyage must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly voyage?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Port of receipt must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly portOfReceipt?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Goods description must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly goodsDescription?: MaybeString;

  @IsOptional()
  @IsArray()
  readonly containers?: Array<any> | null;
}
