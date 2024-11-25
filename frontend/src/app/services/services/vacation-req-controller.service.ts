/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createVacationRequest } from '../fn/vacation-req-controller/create-vacation-request';
import { CreateVacationRequest$Params } from '../fn/vacation-req-controller/create-vacation-request';
import { deleteVacationRequest } from '../fn/vacation-req-controller/delete-vacation-request';
import { DeleteVacationRequest$Params } from '../fn/vacation-req-controller/delete-vacation-request';
import { getAvailableAdministrators } from '../fn/vacation-req-controller/get-available-administrators';
import { GetAvailableAdministrators$Params } from '../fn/vacation-req-controller/get-available-administrators';
import { getVacationRequestsByEmployee } from '../fn/vacation-req-controller/get-vacation-requests-by-employee';
import { GetVacationRequestsByEmployee$Params } from '../fn/vacation-req-controller/get-vacation-requests-by-employee';
import { UserDetailsDto } from '../models/user-details-dto';

@Injectable({ providedIn: 'root' })
export class VacationReqControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `deleteVacationRequest()` */
  static readonly DeleteVacationRequestPath = '/vacation-request/delete/{requestId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteVacationRequest()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteVacationRequest$Response(params: DeleteVacationRequest$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return deleteVacationRequest(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteVacationRequest$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteVacationRequest(params: DeleteVacationRequest$Params, context?: HttpContext): Observable<string> {
    return this.deleteVacationRequest$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `createVacationRequest()` */
  static readonly CreateVacationRequestPath = '/vacation-request/create';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createVacationRequest()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createVacationRequest$Response(params: CreateVacationRequest$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return createVacationRequest(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createVacationRequest$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createVacationRequest(params: CreateVacationRequest$Params, context?: HttpContext): Observable<{
}> {
    return this.createVacationRequest$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getVacationRequestsByEmployee()` */
  static readonly GetVacationRequestsByEmployeePath = '/vacation-request/get-all-vacation-requests-for-employee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVacationRequestsByEmployee()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVacationRequestsByEmployee$Response(params?: GetVacationRequestsByEmployee$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return getVacationRequestsByEmployee(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getVacationRequestsByEmployee$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVacationRequestsByEmployee(params?: GetVacationRequestsByEmployee$Params, context?: HttpContext): Observable<{
}> {
    return this.getVacationRequestsByEmployee$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getAvailableAdministrators()` */
  static readonly GetAvailableAdministratorsPath = '/vacation-request/available-administrators';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAvailableAdministrators()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAvailableAdministrators$Response(params?: GetAvailableAdministrators$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserDetailsDto>>> {
    return getAvailableAdministrators(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAvailableAdministrators$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAvailableAdministrators(params?: GetAvailableAdministrators$Params, context?: HttpContext): Observable<Array<UserDetailsDto>> {
    return this.getAvailableAdministrators$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<UserDetailsDto>>): Array<UserDetailsDto> => r.body)
    );
  }

}
