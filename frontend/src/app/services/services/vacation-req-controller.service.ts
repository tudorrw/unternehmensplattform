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
import { downloadVacationRequestPdf } from '../fn/vacation-req-controller/download-vacation-request-pdf';
import { DownloadVacationRequestPdf$Params } from '../fn/vacation-req-controller/download-vacation-request-pdf';
import { getAllEmployeesWithVacationRequests } from '../fn/vacation-req-controller/get-all-employees-with-vacation-requests';
import { GetAllEmployeesWithVacationRequests$Params } from '../fn/vacation-req-controller/get-all-employees-with-vacation-requests';
import { getAllPendingVacationRequests } from '../fn/vacation-req-controller/get-all-pending-vacation-requests';
import { GetAllPendingVacationRequests$Params } from '../fn/vacation-req-controller/get-all-pending-vacation-requests';
import { getApprovedVacationRequestsByEmployee } from '../fn/vacation-req-controller/get-approved-vacation-requests-by-employee';
import { GetApprovedVacationRequestsByEmployee$Params } from '../fn/vacation-req-controller/get-approved-vacation-requests-by-employee';
import { getAvailableAdministrators } from '../fn/vacation-req-controller/get-available-administrators';
import { GetAvailableAdministrators$Params } from '../fn/vacation-req-controller/get-available-administrators';
import { getVacationRequestsByEmployee } from '../fn/vacation-req-controller/get-vacation-requests-by-employee';
import { GetVacationRequestsByEmployee$Params } from '../fn/vacation-req-controller/get-vacation-requests-by-employee';
import { updateRequestStatus } from '../fn/vacation-req-controller/update-request-status';
import { UpdateRequestStatus$Params } from '../fn/vacation-req-controller/update-request-status';
import { UserDetailsDto } from '../models/user-details-dto';
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

  /** Path part for operation `deleteVacationRequest()` */
  static readonly DeleteVacationRequestPath = '/vacation-request/delete/{requestId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteVacationRequest()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteVacationRequest$Response(params: DeleteVacationRequest$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return deleteVacationRequest(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteVacationRequest$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteVacationRequest(params: DeleteVacationRequest$Params, context?: HttpContext): Observable<{
}> {
    return this.deleteVacationRequest$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
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

  /** Path part for operation `getAllEmployeesWithVacationRequests()` */
  static readonly GetAllEmployeesWithVacationRequestsPath = '/vacation-request/get-employees-with-vacation-requests';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllEmployeesWithVacationRequests()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllEmployeesWithVacationRequests$Response(params?: GetAllEmployeesWithVacationRequests$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserWithVacationRequestDetailsDto>>> {
    return getAllEmployeesWithVacationRequests(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllEmployeesWithVacationRequests$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllEmployeesWithVacationRequests(params?: GetAllEmployeesWithVacationRequests$Params, context?: HttpContext): Observable<Array<UserWithVacationRequestDetailsDto>> {
    return this.getAllEmployeesWithVacationRequests$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<UserWithVacationRequestDetailsDto>>): Array<UserWithVacationRequestDetailsDto> => r.body)
    );
  }

  /** Path part for operation `getApprovedVacationRequestsByEmployee()` */
  static readonly GetApprovedVacationRequestsByEmployeePath = '/vacation-request/get-approved-vacation-requests-for-employee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApprovedVacationRequestsByEmployee()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApprovedVacationRequestsByEmployee$Response(params?: GetApprovedVacationRequestsByEmployee$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<VacationRequestDetailsDto>>> {
    return getApprovedVacationRequestsByEmployee(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getApprovedVacationRequestsByEmployee$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApprovedVacationRequestsByEmployee(params?: GetApprovedVacationRequestsByEmployee$Params, context?: HttpContext): Observable<Array<VacationRequestDetailsDto>> {
    return this.getApprovedVacationRequestsByEmployee$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<VacationRequestDetailsDto>>): Array<VacationRequestDetailsDto> => r.body)
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
  getVacationRequestsByEmployee$Response(params?: GetVacationRequestsByEmployee$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<VacationRequestDetailsDto>>> {
    return getVacationRequestsByEmployee(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getVacationRequestsByEmployee$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVacationRequestsByEmployee(params?: GetVacationRequestsByEmployee$Params, context?: HttpContext): Observable<Array<VacationRequestDetailsDto>> {
    return this.getVacationRequestsByEmployee$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<VacationRequestDetailsDto>>): Array<VacationRequestDetailsDto> => r.body)
    );
  }

  /** Path part for operation `downloadVacationRequestPdf()` */
  static readonly DownloadVacationRequestPdfPath = '/vacation-request/download-pdf/{requestId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `downloadVacationRequestPdf()` instead.
   *
   * This method doesn't expect any request body.
   */
  downloadVacationRequestPdf$Response(params: DownloadVacationRequestPdf$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return downloadVacationRequestPdf(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `downloadVacationRequestPdf$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  downloadVacationRequestPdf(params: DownloadVacationRequestPdf$Params, context?: HttpContext): Observable<Blob> {
    return this.downloadVacationRequestPdf$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
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
