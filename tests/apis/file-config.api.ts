import { BaseApi } from '@apis/base.api';
import { APIRequestContext } from 'playwright-core';

export class FileaConfigApi extends BaseApi {
  constructor(public readonly request: APIRequestContext) {
    super(request, '.env.production');
  }

  /** *************************************************** URLs **************************************************** **/

  static getAllUrl(): string {
    return `${this.baseUrl()}/file-config/all`;
  }
}
