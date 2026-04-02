export interface Ticket {
  id?: number;
  titre: string;
  description: string;
  statut: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priorite: 'LOW' | 'MEDIUM' | 'HIGH';
  dateCreation?: string;
  dateSouhaite: string;
  dateMiseAJour?: string;
}