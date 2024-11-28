import {Component, OnInit, ViewChild} from '@angular/core';
import {VacationReqControllerService} from "../../services/services/vacation-req-controller.service";
import {VacationRequestDetailsDto} from "../../services/models/vacation-request-details-dto";
import {UserWithVacationRequestDetailsDto} from "../../services/models/user-with-vacation-request-details-dto";
import {Table} from "primeng/table";

@Component({
  selector: 'app-leave-requests-admin',
  templateUrl: './leave-requests-admin.component.html',
  styleUrl: './leave-requests-admin.component.scss'
})
export class LeaveRequestsAdminComponent implements OnInit{
  requests: VacationRequestDetailsDto[] = [];
  employeesWithRequests: UserWithVacationRequestDetailsDto[] = [];
  loading: boolean = true;
  expandedRows: { [key: number]: boolean } = {};
  searchValue: string = '';
  @ViewChild('dt2') dt2: Table | undefined;

  constructor(private vacationReqService: VacationReqControllerService) {}

  ngOnInit(): void {
    this.showPendingRequests();
    this.loadEmployeesWithVacationRequests();
  }

  showPendingRequests(): void {
    this.vacationReqService.getAllPendingVacationRequests().subscribe({
      next: (data: VacationRequestDetailsDto[]) => {
        this.requests = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch requests:', error);
        this.loading = false;
      }
    });
  }

  onApprove(requestId: number, status: 'New' | 'Approved' | 'Rejected'): void {
    const params = { requestId, status };
    this.vacationReqService.updateRequestStatus(params).subscribe({
      next: () => {
        this.showPendingRequests();
        this.loadEmployeesWithVacationRequests();
      },
      error: (error) => {
        console.error(`Failed to update request ${requestId}:`, error);
      },
    });
  }

  onDecline(requestId: number, status: 'New' | 'Approved' | 'Rejected'): void {
    const params = { requestId, status };
    this.vacationReqService.updateRequestStatus(params).subscribe({
      next: () => {
        this.showPendingRequests();
        this.loadEmployeesWithVacationRequests();
      },
      error: (error) => {
        console.error(`Failed to update request ${requestId}:`, error);
      },
    });
  }

  loadEmployeesWithVacationRequests(): void {
    this.vacationReqService.getAllEmployeesWithVacationRequests().subscribe({
      next: (data) => {
        this.employeesWithRequests = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching vacation requests:', err);
        this.loading = false;
      }
    });
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }
}
