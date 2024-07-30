import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IShipment } from '../../types/models.interface';
import {
  OriginDto,
  DestinationDto,
  DateAndTimesDto,
  TotalWeightDto,
  TotalVolumeDto,
  TimestampDto,
} from './update-shipment-dto-classes';

type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

export class UpdateShipmentDto implements Partial<Omit<IShipment, 'id'>> {
  @IsOptional()
  @IsString({ message: 'Housebill number must be a string' })
  @Transform(({ value }) => value?.trim())
  HousebillNumber?: string;

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
  @Transform(({ value }) => value?.trim() || null)
  ProductType?: MaybeString;

  @IsOptional()
  @IsNumber({}, { message: 'Total packages must be a valid number' })
  @Transform(({ value }) => (value === '' ? null : Number(value)))
  TotalPackages?: MaybeNumber;

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
  @Transform(({ value }) => value?.trim() || null)
  brokerName?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Incoterms must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  incoterms?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'Shipment date must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  shipmentDate?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Booking must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  booking?: MaybeString;

  @IsOptional()
  @IsString({ message: 'MAWB must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  mawb?: MaybeString;

  @IsOptional()
  @IsString({ message: 'HAWB must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  hawb?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Flight must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  flight?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Airport of departure must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  airportOfDeparture?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'ETD must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  etd?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'ATD must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  atd?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Airport of arrival must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  airportOfArrival?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'ETA must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  eta?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'ATA must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  ata?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Vessel must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  vessel?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Port of loading must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  portOfLoading?: MaybeString;

  @IsOptional()
  @IsString({ message: 'MBL must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  mbl?: MaybeString;

  @IsOptional()
  @IsString({ message: 'HBL must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  hbl?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'Pickup date must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  pickupDate?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Container number must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  containerNumber?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Port of unloading must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  portOfUnloading?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Final destination must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  finalDestination?: MaybeString;

  @IsOptional()
  @IsString({ message: 'International carrier must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  internationalCarrier?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Voyage must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  voyage?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Port of receipt must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  portOfReceipt?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Goods description must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  goodsDescription?: MaybeString;
}
