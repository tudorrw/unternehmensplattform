export interface Company {
    name: string;
    address: string;
    telefonNumber: string;
    adminId: number | null; // Adminul asociat companiei, sau null dacă nu este selectat
}
