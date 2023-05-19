/*
This parser is created specifically for framed JSON (JSONF), which is a specific SpiderRock JSON format 
that includes a header to provide additional metadata before the message content itself such as type,
hash and length. If consuming standard JSON, any standard parser can be used. 
*/
import { getViewFilterArray } from './ViewFilterHelper';
export interface jsonObject {
  [key: string]: any;
}

class mlJsonParser {
  /*
      This function is used to parse the MLink Response data
      from \n based format with pre-pended data strings to valid JSON 
      params:
          input : responseData (any) -> The raw MLink response to a request
    */

  parseMLinkResponse(responseData: string): jsonObject[] {
    let responseArray: jsonObject[] = [];
    if (responseData === '') {
      // Blank response return empty array
      return [];
    } else {
      let lines = responseData.split('\n'); // We start at index 1 here because the MLink response starts with // a blank line so we need to avoid that first index
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] !== '') {
          // Strip out the non standard 12 chars from the JSON
          let substring = lines[i].substring(12); // Push it as valid JSON to the responseArray
          responseArray.push(JSON.parse(substring));
        }
      }
      return responseArray;
    }
  }

  /**
   * Add key to schema if not included yet
   * @param key: 
   * @param schemaArray 
   * @param viewArray 
   */
  addKeyToSchema(key: string, schemaArray: string[], viewArray: string[]): string[] {
    // If the schema array doesn't already have this key
    if (!schemaArray.includes(key.toLowerCase())) {
      // Add always pkey
      if ('pkey' === key.toLowerCase().split('.')[0]) {
        schemaArray.push(key.toLowerCase());
      } else if (viewArray.length > 0) { // If the view filter is set by the user
        // Check if the key is in the view filter
        if (viewArray.includes(key.toLowerCase().split('.')[0])) {
          // And if so, push it to the schema
          schemaArray.push(key.toLowerCase());
        }
      } else {
        // Otherwise, we just push all the keys
        schemaArray.push(key.toLowerCase());
      }
    }
    return schemaArray;
  }

  /*
      This function parses a data request from MLink into a string of items that
      form the schema. This can be used as an alternative to 'parseMLinkSchemaToArray'
      as the schema supplied from MLink does not split primary keys (eg 'okey') into
      it's sub keys. This takes the raw data response, flattens the primary keys
      and creates the appropriate viewable columns
      params:
          responseData (jsonObject) -> The raw MLink response for data
          viewFilter string -> The view filter supplied by the user to allow loading of sub columns
  */

  parseMLinkResponseToSchemaArray(responseData: jsonObject[], viewFilter: string | null): string[] {
    let schemaArray: string[] = [];
    let viewArray: string[] = [];

    if (viewFilter !== null) {
      // Grabs an array of the view filter strings
      viewArray = getViewFilterArray(viewFilter);
    }
    //Iterate whole response due to every message could contain different params
    for (let i = 0; i < responseData.length; i++) {
      //Only grab message because header doesn't contain usefull info to show it in table
      let messageData = responseData[i]['message'];
      // Flatten the message
      const flattenedPkey = this.flattenObject(messageData);
      // Then we want to iterate the flattened keys (eg okey will now be flattened to okey.ts, okey.kk etc)
      // eslint-disable-next-line
      for (const [pkey, _pkeyvalue] of Object.entries(flattenedPkey)) {
        schemaArray = this.addKeyToSchema(pkey, schemaArray, viewArray);
      }
    }
    return schemaArray;
  }

  /*
      This function parses the data response from MLink to an easy to use jsonObject (string keyed JS Array)
      params:
          input : mlinkResponse (any) -> The parsed MLink JSON response to data request
  */

  parseMLinkDataToFlattenedArray(mlinkResponse: jsonObject[]) {
    let flattenedMessage = []; // For each item in the MLink response
    for (let i = 0; i < mlinkResponse.length; i++) {
      // Set up an empty object for putting this item's data into
      let currentMessage: jsonObject = {}; // Get the current message data into a variable to handle
      let messageData = mlinkResponse[i]['message']; // For every key, value in the message's data headers
      const flattenedPkey = this.flattenObject(messageData);
      for (const [pkey, pkeyvalue] of Object.entries(flattenedPkey)) {
        currentMessage[pkey.toLowerCase()] = pkeyvalue;
      }
      // Push that data to the holding array
      flattenedMessage.push(currentMessage);
    }

    return flattenedMessage;
  }

  flattenObject(obj: jsonObject, prefix = '', result: jsonObject = {}) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          this.flattenObject(value, newPrefix, result);
        } else {
          result[newPrefix] = value;
        }
      }
    }
    return result;
  }
}

export const MLinkJsonParser = new mlJsonParser();

export default MLinkJsonParser;
