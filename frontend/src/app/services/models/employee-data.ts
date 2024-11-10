import {RegistrationRequest} from "./registration-request";
import {UserDetailsDto} from "./user-details-dto";

export type EmployeeData = RegistrationRequest & Partial<UserDetailsDto>
