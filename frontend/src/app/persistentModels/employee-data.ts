import {RegistrationRequest} from "../services/models/registration-request";
import {UserDetailsDto} from "../services/models/user-details-dto";

export type EmployeeData = RegistrationRequest & Partial<UserDetailsDto>
