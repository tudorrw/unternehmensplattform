/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { VacationRequestDetailsDto } from '../../models/vacation-request-details-dto';

export interface GetApprovedVacationRequestsByEmployee$Params {
}

export function getApprovedVacationRequestsByEmployee(http: HttpClient, rootUrl: string, params?: GetApprovedVacationRequestsByEmployee$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<VacationRequestDetailsDto>>> {
  const rb = new RequestBuilder(rootUrl, getApprovedVacationRequestsByEmployee.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<VacationRequestDetailsDto>>;
    })
  );
}

getApprovedVacationRequestsByEmployee.PATH = '/vacation-request/get-approved-vacation-requests-for-employee';
