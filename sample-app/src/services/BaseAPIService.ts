import { MLinkConfig } from '../config';
import { MLinkJsonParser, jsonObject } from '../helpers/MLinkJsonParser';
import { QueryParameterGenerator } from '../helpers/QueryParameterGenerator';

class BaseApiService {
  private config: MLinkConfig;
  private FRAME_JSON = 'rest/jsonf';

  constructor(config: MLinkConfig) {
    this.config = config;
  }

  private getHeader() {
    const headers = new Headers();
    headers.append('Content-Type', 'text/json');
    return headers;
  }

  private isFramedJsonURL(url: string) {
    return url.includes(this.FRAME_JSON);
  }

  /**
     * For MLink we have two different of URLs available:
     * 
     *  - First one finish on 'rest/json' that return a JSON object, it could be managed by standard json() function
     *    Example: 
     *    [{"header":{"mTyp":"MsgDesc"},"message":{"pkey":{},"name":"LiveAtmModel","mNum":1000,"schemaHash":"6F89DED149E6399C","hasTKey":"No","hasEKey":"Yes","hasOKey":"No","mCat":"SystemData"}}]
     * 
     * 
     *  - Second one finish on 'rest/jsonf' that return a framed JSON (JSONF), which is a specific SpiderRock JSON format 
     *    We'll have a bunch of lines where every line will have the following format (Note: First line is always empty):
     *     - Json metadata -> 12 charts
     *     - Json object -> standart Json object
     *    Example: 
     *    J03330000174{"header":{"mTyp":"MsgDesc"},"message":{"name":"LiveAtmModel","mNum":1000,"schemaHash":"6F89DED149E6399C","hasTKey":"Yes","hasEKey":"Yes","hasOKey":"No","mCat":"SystemData"}}
     *      
     */
  private async get(url: string): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeader(),
    }).catch(function(error) {
      console.error(error)
      throw new Error("Something went wrong processing this request. Please ensure your query syntax is valid and try again.");
    });
    let jsonResponse;
    //Analyze the URL to know the kind of service requested
    if (this.isFramedJsonURL(url)) {
      /**
      * For Framed Json we have a custom parser, see MLinkJsonParser.parseMLinkResponse
      */
      const json = await response.text();
      jsonResponse = MLinkJsonParser.parseMLinkResponse(json);
    } else {
      /**
       * For Json we use the standard Json parser
       */
      jsonResponse = await response.json();
    }
    return jsonResponse;
  }

  async getMsgTypes(): Promise<jsonObject[]> {
    const url = this.getMsgTypesURL();
    return this.get(url);
  }

  async getMessages(
    msgType: string,
    whereFilter?: string,
    viewFilter?: string,
    limit?: number
  ): Promise<jsonObject[]> {
    const url = this.getMessagesURL(msgType, whereFilter, viewFilter, limit);
    return this.get(url);
  }

  async getMessageSchema(msgType: string): Promise<jsonObject[]> {
    const url = this.getMessagesSchemaURL(msgType);
    return this.get(url);
  }

  getBaseUrl(): string {
    return (
      this.config.MLINK_ENDPOINT +
      '?apikey=' +
      this.config.API_KEY +
      '.' +
      this.config.PASS
    );
  }

  getMsgTypesURL(): string {
    return this.getBaseUrl() + '&cmd=getmsgtypes';
  }

  getMessagesSchemaURL(msgType: string): string {
    let url = this.getBaseUrl() + '&cmd=getschema&msgtype=' + msgType;
    return url;
  }

  getMessagesURL(
    msgType: string,
    whereFilter?: string,
    viewFilter?: string,
    limit?: number,
  ): string {
    let url = this.getBaseUrl() + '&cmd=getmsgs&msgtype=' + msgType;
    if (whereFilter) {
      const encodedWhereFilter =
        QueryParameterGenerator.parseAndEncodeFilter(whereFilter);
      url = url + '&where=' + encodedWhereFilter;
    } else if (viewFilter) {
      const encodedViewFilter =
        QueryParameterGenerator.parseAndEncodeFilter(viewFilter);
      url = url + '&view=' + encodedViewFilter;
    }
    if (limit) {
      url = url + '&l=' + limit;
    }
    return url;
  }
}

export default BaseApiService;
