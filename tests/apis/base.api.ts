import { expect, APIRequestContext } from '@fixtures';
import { APIResponse } from 'playwright-core';
import { expect as chaiExpect } from 'chai';

import * as fs from 'fs';
import chai from 'chai';
import jsonSchema from 'chai-json-schema';

chai.use(jsonSchema);

export class BaseApi {
  constructor(readonly request: APIRequestContext, readonly envFileName?: string) {}

  static baseUrl(): string {
    return `${process.env.VITE_API_URL}`;
  }

  validateResponseSchema(requestMethod: string, requestUrl: string, response: any, schema: any): void {
    const errorMessage = `\n\n\t${requestMethod} ${requestUrl}\n\tERROR - Schema validation failed.\n\n\tDETAILS`;
    chaiExpect(response, errorMessage).to.be.jsonSchema(schema);
  }

  async executeGetRequest(requestUrl: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.get(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      timeout: 60000,
    });

    return response;
  }

  async executePutRequest(requestUrl: string, payload: any): Promise<APIResponse> {
    const response: APIResponse = await this.request.put(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      data: payload,
      timeout: 60000,
    });

    return response;
  }

  async executePostRequest(requestUrl: string, payload: any): Promise<APIResponse> {
    const response: APIResponse = await this.request.post(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      data: payload,
      timeout: 60000,
    });

    return response;
  }

  async executeMultipartRequest(requestUrl: string, filePath: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.post(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      multipart: {
        file: fs.createReadStream(filePath),
      },
    });

    return response;
  }

  async executeMultipartTextFileRequest(
    requestUrl: string,
    fileName: string,
    fileContent: string,
  ): Promise<APIResponse> {
    const response: APIResponse = await this.request.post(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      multipart: {
        file: {
          name: fileName,
          mimeType: 'text/plain',
          buffer: Buffer.from(fileContent),
        },
      },
    });

    return response;
  }

  async executePatchRequest(requestUrl: string, payload?: any): Promise<APIResponse> {
    const response: APIResponse = await this.request.patch(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      data: payload,
      timeout: 60000,
    });

    return response;
  }

  async executeDeleteRequest(requestUrl: string, payload?: any): Promise<APIResponse> {
    const response: APIResponse = await this.request.delete(requestUrl, {
      headers: {
        Accept: '*/*',
      },
      data: payload,
      timeout: 60000,
    });

    return response;
  }

  async checkRequestStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const errorMessage = `Error: ${await response.text()}`;
    expect(response.status(), errorMessage).toBe(expectedStatus);
  }

  async checkRequestStatusIsOneOf(response: APIResponse, expectedStatuses: Array<number>): Promise<void> {
    const errorMessage = `Error: ${await response.text()}`;
    const regexFromExpectedStatuses = new RegExp(expectedStatuses.join('|'));
    expect(response.status().toString(), errorMessage).toMatch(regexFromExpectedStatuses);
  }

  async validateApiResponse(promise: Promise<APIResponse>, httpMethod: string, payload?: any): Promise<APIResponse> {
    const response = await promise;
    if (!response.ok()) {
      const error = `
            Url: ${response.url()}
            Http method: ${httpMethod}
            Request body: ${JSON.stringify(payload)}
            Status: ${response.status()} ${response.statusText()}
            Response body: ${await response.text()}
            `;
      throw new Error(error);
    }
    return response;
  }

  async executeValidatedGet(url: string): Promise<APIResponse> {
    return await this.validateApiResponse(this.executeGetRequest(url), 'GET');
  }

  async executeValidatedPost(url: string, payload: any): Promise<APIResponse> {
    return await this.validateApiResponse(this.executePostRequest(url, payload), 'POST', payload);
  }

  async executeValidatedPut(url: string, payload: any): Promise<APIResponse> {
    return await this.validateApiResponse(this.executePutRequest(url, payload), 'PUT', payload);
  }

  async executeValidatedPatch(url: string, payload: any): Promise<APIResponse> {
    return await this.validateApiResponse(this.executePatchRequest(url, payload), 'PATCH', payload);
  }

  async executeValidatedDelete(url: string, payload?: any): Promise<APIResponse> {
    return await this.validateApiResponse(this.executeDeleteRequest(url, payload), 'DELETE');
  }

  async executeValidatedMultipart(url: string, filePath: string): Promise<APIResponse> {
    return await this.validateApiResponse(this.executeMultipartRequest(url, filePath), 'POST - Multipart');
  }

  async executeValidatedMultipartTextFile(url: string, fileName: string, fileContent: string): Promise<APIResponse> {
    return await this.validateApiResponse(
      this.executeMultipartTextFileRequest(url, fileName, fileContent),
      'POST - Multipart',
    );
  }
}
