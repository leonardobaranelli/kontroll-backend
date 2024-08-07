export const standardShipmentStructure = {
  HousebillNumber: 'String',
  Origin: {
    LocationCode: 'String',
    LocationName: 'String',
    CountryCode: 'String',
  },
  Destination: {
    LocationCode: 'String',
    LocationName: 'String',
    CountryCode: 'String',
  },
  DateAndTimes: {
    ScheduledDeparture: 'String',
    ScheduledArrival: 'String',
    ShipmentDate: 'String',
  },
  ProductType: 'String',
  TotalPackages: 'Number',
  TotalWeight: {
    '*body': 'Number',
    '@uom': 'String',
  },
  TotalVolume: {
    '*body': 'Number',
    '@uom': 'String',
  },
  Timestamp: [
    {
      TimestampCode: 'String',
      TimestampDescription: 'String',
      TimestampDateTime: 'Date',
      TimestampLocation: 'String',
    },
  ],
  brokerName: 'String',
  incoterms: 'String',
  shipmentDate: 'String',
  booking: 'String',
  mawb: 'String',
  hawb: 'String',
  flight: 'String',
  airportOfDeparture: 'String',
  etd: 'String',
  atd: 'String',
  airportOfArrival: 'String',
  eta: 'String',
  ata: 'String',
  vessel: 'String',
  portOfLoading: 'String',
  mbl: 'String',
  hbl: 'String',
  pickupDate: 'String',
  containerNumber: 'String',
  portOfUnloading: 'String',
  finalDestination: 'String',
  internationalCarrier: 'String',
  voyage: 'String',
  portOfReceipt: 'String',
  goodsDescription: 'String',
  containers: [],
};
