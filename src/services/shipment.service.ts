import admin from 'firebase-admin';
import { Shipment } from '../models/shipment.model';
import { CreateShipmentDto, UpdateShipmentDto } from '../utils/dtos';
import {
  IShipmentPublic,
  AbstractShipmentPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/commons/get-attributes.helper';

export default class ShipmentService {
  private static getIdFieldForCarrier(carrier: string): string {
    const carrierIdFields: { [key: string]: string } = {
      dhl: 'id',
      fedex: 'transactionId',
      kandn: 'shipmentNumber',
      sch: 'ShipmentId',
    };

    return carrierIdFields[carrier] || 'id';
  }

  public static async getAllShipments(): Promise<IShipmentPublic[]> {
    try {
      const shipmentCollections = [
        'shipments_dhl',
        'shipments_fedex',
        'shipments_kandn',
        'shipments_sch',
      ];
      const allShipments: IShipmentPublic[] = [];

      for (const collection of shipmentCollections) {
        const snapshot = await admin.firestore().collection(collection).get();
        snapshot.forEach((doc) => {
          allShipments.push({ ...(doc.data() as IShipmentPublic) });
        });
      }

      if (allShipments.length === 0) {
        const error: IError = new Error('There are no shipments available');
        error.statusCode = 404;
        throw error;
      }

      return allShipments;
    } catch (error) {
      throw error;
    }
  }
  public static async getShipmentsByCarrier(
    carrier: string,
  ): Promise<IShipmentPublic[]> {
    try {
      const shipmentsCollection = admin
        .firestore()
        .collection(`shipments_${carrier}`);
      const snapshot = await shipmentsCollection.get();
      const shipments: IShipmentPublic[] = [];

      snapshot.forEach((doc) => {
        shipments.push(doc.data() as IShipmentPublic);
      });

      if (shipments.length === 0) {
        const error: IError = new Error(
          'There are no shipments available for that carrier',
        );
        error.statusCode = 404;
        throw error;
      }

      return shipments;
    } catch (error) {
      throw error;
    }
  }

  public static async getShipmentByCarrierAndId(
    carrier: string,
    shipmentId: string,
  ): Promise<IShipmentPublic> {
    try {
      const shipmentsCollection = admin
        .firestore()
        .collection(`shipments_${carrier}`);

      const snapshot = await shipmentsCollection.get();
      const idField = this.getIdFieldForCarrier(carrier);

      let shipmentDoc = null;
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data[idField] === shipmentId) {
          shipmentDoc = data;
          break;
        } else {
          const shipments = data.shipments || [];
          shipmentDoc = shipments.find(
            (shipment: any) => shipment[idField] === shipmentId,
          );
        }
      }

      if (!shipmentDoc) {
        const error: IError = new Error(
          `Shipment with ID ${shipmentId} not found for carrier ${carrier}`,
        );
        error.statusCode = 404;
        throw error;
      }

      return shipmentDoc as IShipmentPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async createShipment(
    shipmentData: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    const { HousebillNumber } = shipmentData;

    try {
      // Aquí deberíamos buscar el envío en los conectores
      const existingShipment = await this.searchShipmentInConnectors(
        HousebillNumber,
      );

      if (existingShipment) {
        const error: IError = new Error(
          `Shipment with tracking number ${HousebillNumber} already exists`,
        );
        error.statusCode = 409;
        throw error;
      }

      // Aquí deberíamos crear el envío en el conector apropiado
      const newShipment = await this.createShipmentInConnector(shipmentData);

      // Convertir el resultado del conector a IShipmentPublic
      const publicShipment: IShipmentPublic =
        this.convertToPublicShipment(newShipment);

      return publicShipment;
    } catch (error) {
      throw error;
    }
  }

  private static async searchShipmentInConnectors(
    HousebillNumber: string,
  ): Promise<any> {
    // Implementar la lógica para buscar en los conectores
    // Por ahora, retornamos null como placeholder
    console.log('Buscando envío en conectores... a ' + HousebillNumber);
    return null;
  }

  private static async createShipmentInConnector(
    shipmentData: CreateShipmentDto,
  ): Promise<any> {
    // Implementar la lógica para crear el envío en el conector apropiado
    // Por ahora, retornamos los datos recibidos como placeholder
    return shipmentData;
  }

  private static convertToPublicShipment(shipmentData: any): IShipmentPublic {
    // Implementar la lógica para convertir los datos del conector a IShipmentPublic
    // Por ahora, hacemos un cast simple
    return shipmentData as IShipmentPublic;
  }

  public static async updateShipmentByNumber(
    HousebillNumber: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const [updatedRows]: [number] = await Shipment.update(newData, {
        where: { HousebillNumber },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(
          `Shipment with number ${HousebillNumber} not found`,
        );
        error.statusCode = 404;
        throw error;
      }

      const updatedShipment: IShipmentPublic | null = await Shipment.findOne({
        where: { HousebillNumber },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      return updatedShipment as IShipmentPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteAllShipments(): Promise<void> {
    try {
      await Shipment.destroy({ where: {} });
    } catch (error) {
      throw error;
    }
  }

  public static async deleteShipmentByNumber(
    HousebillNumber: string,
  ): Promise<void> {
    try {
      const shipments: Shipment[] | null = await Shipment.findAll({
        where: { HousebillNumber },
      });
      if (shipments.length === 0) {
        throw new Error(`No shipments with number ${HousebillNumber} found`);
      }
      await Shipment.destroy({ where: { HousebillNumber } });
    } catch (error) {
      throw error;
    }
  }
}
