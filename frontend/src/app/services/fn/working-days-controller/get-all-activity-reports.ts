/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { WorkingDaysDto } from '../../models/working-days-dto';

export interface GetAllActivityReports$Params {
}

export function getAllActivityReports(http: HttpClient, rootUrl: string, params?: GetAllActivityReports$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<WorkingDaysDto>>> {
  const rb = new RequestBuilder(rootUrl, getAllActivityReports.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<WorkingDaysDto>>;
    })
  );
}

getAllActivityReports.PATH = '/working-days/get-all-working-days-by-employee';
