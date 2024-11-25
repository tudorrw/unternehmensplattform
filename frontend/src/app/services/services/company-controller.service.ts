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

import { assignAdminToCompany } from '../fn/company-controller/assign-admin-to-company';
import { AssignAdminToCompany$Params } from '../fn/company-controller/assign-admin-to-company';
import { Company } from '../models/company';
import { CompanyDetailsDto } from '../models/company-details-dto';
import { createCompany } from '../fn/company-controller/create-company';
import { CreateCompany$Params } from '../fn/company-controller/create-company';
import { getAllCompanies1 } from '../fn/company-controller/get-all-companies-1';
import { GetAllCompanies1$Params } from '../fn/company-controller/get-all-companies-1';

@Injectable({ providedIn: 'root' })
export class CompanyControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `assignAdminToCompany()` */
  static readonly AssignAdminToCompanyPath = '/company/{companyId}/assign-admin/{adminId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignAdminToCompany()` instead.
   *
   * This method doesn't expect any request body.
   */
  assignAdminToCompany$Response(params: AssignAdminToCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return assignAdminToCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `assignAdminToCompany$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  assignAdminToCompany(params: AssignAdminToCompany$Params, context?: HttpContext): Observable<string> {
    return this.assignAdminToCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `createCompany()` */
  static readonly CreateCompanyPath = '/company/create';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createCompany()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCompany$Response(params: CreateCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<Company>> {
    return createCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createCompany$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCompany(params: CreateCompany$Params, context?: HttpContext): Observable<Company> {
    return this.createCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<Company>): Company => r.body)
    );
  }

  /** Path part for operation `getAllCompanies1()` */
  static readonly GetAllCompanies1Path = '/company/get-all';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllCompanies1()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCompanies1$Response(params?: GetAllCompanies1$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CompanyDetailsDto>>> {
    return getAllCompanies1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllCompanies1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCompanies1(params?: GetAllCompanies1$Params, context?: HttpContext): Observable<Array<CompanyDetailsDto>> {
    return this.getAllCompanies1$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CompanyDetailsDto>>): Array<CompanyDetailsDto> => r.body)
    );
  }

}
