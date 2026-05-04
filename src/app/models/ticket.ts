// src/app/models/ticket.ts

export class Ticket {
  id?: number;
  titre: string = '';
  description: string = '';
  statut: 'A_faire' | 'En_cours' | 'Fait' | 'Approuvé' | 'Rejeté' = 'A_faire';
  priorite: 'HIGH' | 'MEDIUM' | 'LOW' | 'Haute' | 'Moyenne' | 'Basse' = 'MEDIUM';
  dateSouhaite?: string | null;
  dateCreation?: string;
  dateMiseAJour?: string;
  nombreCommentaires?: number;
}