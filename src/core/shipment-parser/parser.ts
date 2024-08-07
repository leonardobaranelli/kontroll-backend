import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  ParserResult,
  ShipmentInput,
  ParserOptions,
} from '../../utils/types/utilities.interface';
import { config } from '../../config/shipment-parser/shipment-parser.config';
import {
  formatShipmentData,
  removeSpecificNullFields,
} from './utils/formattingUtils';
import ParsingDictionaryService from '../../services/parsing-dictionary.service';
import {
  generateMechanicalMapping,
  enhanceMappingDictionary,
} from './utils/mappingUtils';
import { saveMappingDictionary } from './utils/fileUtils';
import { logInfo, logObject, countTokens } from './utils/loggingUtils';

// Función para parsear el JSON con OpenAI
async function parseJsonWithOpenAI(inputJson: ShipmentInput) {
  // Definimos el prompt para OpenAI
  const prompt = `### Instruction ###
  You are a highly capable JSON parsing assistant for the Kontroll application. Your tasks are:
  
  1. **Parse the provided JSON data**: Convert the input JSON into the standard shipment tracking structure as defined below. Ensure to deeply analyze and parse all nested structures.
  
  2. **Create a mapping dictionary**: Show how each input field maps to the corresponding output field in the standard structure. The mapping dictionary should be an array of objects, each with 'key' (input path) and 'value' (output path) properties.
  
  ### Input JSON ###
  \`\`\`json
  ${JSON.stringify(inputJson, null, 2)}
  \`\`\`
  
  ### Standard Structure for Shipment Tracking ###
  {
    HousebillNumber: 'String', // The unique tracking number or house bill number for the shipment. This serves as the primary identifier for tracking the shipment.
    Origin: {
      LocationCode: 'String', // The ISO 3166 location code for the origin location. This code uniquely identifies the city or region where the shipment originated.
      LocationName: 'String', // The name of the origin location, typically the city or region name.
      CountryCode: 'String', // The ISO 3166 country code for the origin country. This code uniquely identifies the country where the shipment originated.
    },
    Destination: {
      LocationCode: 'String', // The ISO 3166 location code for the destination location. This code uniquely identifies the city or region where the shipment is being delivered.
      LocationName: 'String', // The name of the destination location, typically the city or region name.
      CountryCode: 'String', // The ISO 3166 country code for the destination country. This code uniquely identifies the country where the shipment is being delivered.
    },
    DateAndTimes: {
      ScheduledDeparture: 'String', // The scheduled or estimated departure date and time from the origin. This indicates when the shipment is expected to leave the origin.
      ScheduledArrival: 'String', // The scheduled or estimated arrival date and time at the destination. This indicates when the shipment is expected to arrive at the destination.
      ShipmentDate: 'String', // The actual date and time when the shipment was dispatched. This is the date when the shipment was handed over to the carrier.
    },
    ProductType: 'String', // The type of product being shipped. This is an optional field that describes the nature of the goods in the shipment.
    TotalPackages: 'Number', // The total number of packages included in the shipment. This is an optional field.
    TotalWeight: {
      '*body': 'Number', // The total weight of the shipment, including all packages. This is only the numerical value.
      '@uom': 'String', // The unit of measure for the weight (e.g., KG for kilograms, LB for pounds).
    },
    TotalVolume: {
      '*body': 'Number', // The total volume of the shipment, including all packages. This is only the numerical value.
      '@uom': 'String', // The unit of measure for the volume (e.g., m³ for cubic meters, ft³ for cubic feet).
    },
    Timestamp: [
      // An array of events that occurred during the shipment's transit. Each event provides details about a significant moment in the shipment's journey.
      {
        TimestampCode: 'String', // The code representing the type of event (e.g., PU for Picked Up, DL for Delivered).
        TimestampDescription: 'String', // A description of the event (e.g., "Shipment picked up from the origin").
        TimestampDateTime: 'Date', // The date and time when the event occurred.
        TimestampLocation: 'String', // The location where the event took place, typically the city or region name.
      },
    ],
    brokerName: 'String', // The name of the carrier or freight forwarder responsible for transporting the shipment.
    incoterms: 'String', // The international commercial terms (Incoterms) that define the responsibilities of buyers and sellers in the shipment process.
    shipmentDate: 'String', // The actual date when the shipment was dispatched.
    booking: 'String', // The booking number associated with the shipment.
    mawb: 'String', // The Master Air Waybill number for the shipment. This is used for air freight.
    hawb: 'String', // The House Air Waybill number for the shipment. This is used for air freight.
    flight: 'String', // The flight number if the shipment is transported by air.
    airportOfDeparture: 'String', // The name of the airport where the shipment departs.
    etd: 'String', // The estimated time of departure from the origin.
    atd: 'String', // The actual time of departure from the origin.
    airportOfArrival: 'String', // The name of the airport where the shipment arrives.
    eta: 'String', // The estimated time of arrival at the destination.
    ata: 'String', // The actual time of arrival at the destination.
    vessel: 'String', // The name of the vessel if the shipment is transported by sea.
    portOfLoading: 'String', // The name of the port where the shipment is loaded onto the vessel.
    mbl: 'String', // The Master Bill of Lading number for the shipment. This is used for sea freight.
    hbl: 'String', // The House Bill of Lading number for the shipment. This is used for sea freight.
    pickupDate: 'String', // The date when the shipment was picked up from the origin.
    containerNumber: 'String', // The number of the container if the shipment is transported in a container.
    portOfUnloading: 'String', // The name of the port where the shipment is unloaded from the vessel.
    finalDestination: 'String', // The final destination of the shipment.
    internationalCarrier: 'String', // The name of the international carrier transporting the shipment.
    voyage: 'String', // The voyage number if the shipment is transported by sea.
    portOfReceipt: 'String', // The name of the port where the carrier received the shipment.
    goodsDescription: 'String', // A description of the goods being shipped.
    containers: [], // A list of containers associated with the shipment. Each container can have its own set of details and identifiers.
  };

  ### Response Format ###
  \`\`\`json
  {
    "parsedData": {
      // Parsed JSON object here, following the standard structure
    },
    "mappingDictionary": [
      {
        "key": "input.path.here",
        "value": "output.path.here"
      },
      // More mapping entries...
    ]
  }
  \`\`\`
  
  ### Instructions ###
  - Ensure the output is a valid JSON object with correct data types.
  - Any optional fields missing in the input should be set to null.
  - HouseBillNumber is the main identifier for the shipment, so it should be mapped to the shipment or tracking field in the output which is higher on the structure of the JSON.
  - If fields like ScheduledDeparture, ScheduledArrival, and ShipmentDate are not present in the input JSON, look for them in the events array and use the most relevant event dates to populate these fields.
  - For arrays, map each relevant field from the input to the corresponding output structure using the index notation for the array elements.
  - For nested objects, use dot notation to specify the path to each field.
  - Identify and map all relevant date and time fields, and ensure they are formatted consistently in the output.
  - Ensure that all weight and volume fields are correctly mapped, including their units of measure.
  - Map event-related fields such as timestamps, event codes, and descriptions to the corresponding fields in the output structure.
  - Be thorough and ensure no fields from the standard structure are left unmapped. Include mappings for all fields present in both the input and output, even if they are null or empty.
  - **Analyze deeply nested structures**: Ensure that all nested objects and arrays are thoroughly analyzed and mapped to the corresponding fields in the standard structure.
  - **Iterate over all keys and arrays**: Dynamically iterate over all keys and arrays to ensure a comprehensive mapping.
  
  ### Mapping Dictionary Guidelines ###
  1. Use dot notation for nested objects and [] for array indices.
   2. Include mappings for ALL fields present in both the input and output, even if they are null or empty.
  3. Pay special attention to fields like ProductType, TotalPackages, TotalWeight, TotalVolume, and all timestamp-related fields.
  4. If a field in the standard structure doesn't have a direct correspondence in the input, map it to null or the most appropriate alternative.
  5. For arrays like Timestamp, map each relevant field from the input to the corresponding output structure.
  6. Ensure all fields from the input are mapped to the output, even if the output field is null.
  
  Ensure no fields from the standard structure are left unmapped. Your response should be concise, clear, and formatted correctly as JSON without any additional text or comments.
  `;

  // Log de información del prompt y el token count
  logInfo(`Prompt: ${prompt}`);
  logInfo(`Token count: ${countTokens(prompt)}`);

  try {
    // Llamamos a la API de OpenAI para obtener la respuesta
    const response = await axios.post(
      config.openai.apiEndpoint,
      {
        // Modelo de OpenAI
        model: config.openai.model,
        // Mensajes para OpenAI
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that parses JSON data and creates mapping dictionaries. Always respond with valid JSON only, without any additional formatting or text.',
          },
          { role: 'user', content: prompt },
        ],
        // Tempratura y top_p, esto controla la aleatoriedad de la respuesta
        temperature: config.openai.temperature,
        top_p: config.openai.top_p,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Clave de API de OpenAI
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
      },
    );

    // Obtenemos la respuesta de OpenAI
    const responseText = response.data.choices[0].message.content.trim();
    const cleanedResponse = responseText.replace(/```json\n|\n```/g, '');

    let parsedResponse;
    try {
      // Parseamos la respuesta de OpenAI
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError: any) {
      throw new Error(`Invalid JSON in OpenAI response: ${parseError.message}`);
    }

    // Validamos que la respuesta de OpenAI tenga los campos esperados
    if (!parsedResponse.parsedData || !parsedResponse.mappingDictionary) {
      throw new Error(
        'OpenAI response is missing parsedData or mappingDictionary',
      );
    }

    // Log de información de la respuesta de OpenAI
    logInfo('OpenAI response: ');
    logInfo('Parsed data: ');
    logObject(parsedResponse.parsedData);
    logInfo('Mapping dictionary: ');
    logObject(parsedResponse.mappingDictionary);

    // Formateamos los datos de la respuesta de OpenAI
    const formattedData = formatShipmentData(parsedResponse.parsedData);
    const finalData = removeSpecificNullFields(formattedData);

    return {
      parsedData: finalData,
      mappingDictionary: parsedResponse.mappingDictionary,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse JSON with OpenAI: ${error.message}`);
  }
}

// Función para parsear los datos de la carga
export async function parseShipmentData(
  input: ShipmentInput,
  carrier: string,
  options?: ParserOptions,
): Promise<ParserResult> {
  try {
    // Validamos que el input no esté vacío
    if (Object.keys(input).length === 0) {
      throw new Error('Input JSON is empty');
    }

    // Si no se usa OpenAI, lanzamos un error
    if (!options?.useOpenAI) {
      throw new Error('OpenAI option is not enabled');
    }

    // Parseamos los datos de la carga con OpenAI
    const { parsedData, mappingDictionary } = await parseJsonWithOpenAI(input);

    // Generamos el diccionario de mapeo mecánico
    const mechanicalMapping = generateMechanicalMapping(input, parsedData);

    // Mejoramos el diccionario de mapeo
    const combinedMapping = enhanceMappingDictionary(
      mappingDictionary,
      mechanicalMapping,
    );

    // Guardamos el diccionario de mapeo
    saveMappingDictionary(combinedMapping);

    // Creamos el diccionario de mapeo
    const parsingDictionary = {
      id: uuidv4(),
      carrier: carrier,
      dictionary: Object.fromEntries(
        combinedMapping.map((item) => [item.key, item.value]),
      ),
    };

    try {
      // Guardamos el diccionario de mapeo en la base de datos
      await ParsingDictionaryService.createParsingDictionary({
        carrier: parsingDictionary.carrier,
        dictionary: parsingDictionary.dictionary,
      });
    } catch (dbError: any) {
      //Continuar la ejecucion incluso si falla la base de datos
    }
    return {
      success: true,
      data: parsedData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Error parsing shipment: ${error.message}`,
    };
  }
}
