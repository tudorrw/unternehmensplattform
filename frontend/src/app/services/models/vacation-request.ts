/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { User } from '../models/user';
export interface VacationRequest {
  administrator?: User;
  description: string;
  employee?: User;
  endDate: string;
  id?: number;
  pdfPath?: string;
  requestedDate: string;
  startDate: string;
  status: 'New' | 'Approved' | 'Rejected';
}
