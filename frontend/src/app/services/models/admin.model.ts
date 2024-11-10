export interface Admin {
    id: number | null;
    firstName: string;
    lastName: string;
    email: string;
    telefonNumber?: string;  // Telefonul nu este obligatoriu
}
