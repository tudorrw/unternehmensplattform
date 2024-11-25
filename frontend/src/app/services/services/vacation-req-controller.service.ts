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

import { getAllCompanies } from '../fn/vacation-req-controller/get-all-companies';
import { GetAllCompanies$Params } from '../fn/vacation-req-controller/get-all-companies';
import { getAllPendingVacationRequests } from '../fn/vacation-req-controller/get-all-pending-vacation-requests';
import { GetAllPendingVacationRequests$Params } from '../fn/vacation-req-controller/get-all-pending-vacation-requests';
import { updateRequestStatus } from '../fn/vacation-req-controller/update-request-status';
import { UpdateRequestStatus$Params } from '../fn/vacation-req-controller/update-request-status';
import { UserWithVacationRequestDetailsDto } from '../models/user-with-vacation-request-details-dto';
import { VacationRequestDetailsDto } from '../models/vacation-request-details-dto';

@Injectable({ providedIn: 'root' })
export class VacationReqControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateRequestStatus()` */
  static readonly UpdateRequestStatusPath = '/vacation-request/modify-status/{requestId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateRequestStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateRequestStatus$Response(params: UpdateRequestStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return updateRequestStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateRequestStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateRequestStatus(params: UpdateRequestStatus$Params, context?: HttpContext): Observable<{
}> {
    return this.updateRequestStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getAllPendingVacationRequests()` */
  static readonly GetAllPendingVacationRequestsPath = '/vacation-request/get-pending-requests';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllPendingVacationRequests()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPendingVacationRequests$Response(params?: GetAllPendingVacationRequests$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<VacationRequestDetailsDto>>> {
    return getAllPendingVacationRequests(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllPendingVacationRequests$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPendingVacationRequests(params?: GetAllPendingVacationRequests$Params, context?: HttpContext): Observable<Array<VacationRequestDetailsDto>> {
    return this.getAllPendingVacationRequests$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<VacationRequestDetailsDto>>): Array<VacationRequestDetailsDto> => r.body)
    );
  }

  /** Path part for operation `getAllCompanies()` */
  static readonly GetAllCompaniesPath = '/vacation-request/get-employees-with-vacation-requests';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllCompanies()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCompanies$Response(params?: GetAllCompanies$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserWithVacationRequestDetailsDto>>> {
    return getAllCompanies(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllCompanies$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCompanies(params?: GetAllCompanies$Params, context?: HttpContext): Observable<Array<UserWithVacationRequestDetailsDto>> {
    return this.getAllCompanies$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<UserWithVacationRequestDetailsDto>>): Array<UserWithVacationRequestDetailsDto> => r.body)
    );
  }

}
