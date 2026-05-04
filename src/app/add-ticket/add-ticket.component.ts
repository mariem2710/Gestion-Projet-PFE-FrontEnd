import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';

@Component({
  selector: 'app-add-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent {
  today = new Date();

  // Date minimale = demain (lendemain de la date système)
  get minDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Date par défaut = demain
  get defaultDate(): string {
    return this.minDate;
  }

  ticket: Ticket = {
    titre:        '',
    description:  '',
    statut:       'A_faire',
    priorite:     'Moyenne',
    dateSouhaite: this.minDate   // ← par défaut = demain
  };

  message = '';
  errors: { [key: string]: string } = {};

  // ── Liste des tickets créés ───────────────────────
  ticketList: Ticket[] = [];
  showList = false;

  constructor(private ticketService: TicketService) {}

  // ── Validation ────────────────────────────────────
  validate(): boolean {
    this.errors = {};

    if (!this.ticket.titre?.trim()) {
      this.errors['titre'] = 'Le titre est obligatoire.';
    }
    if (!this.ticket.description?.trim()) {
      this.errors['description'] = 'La description est obligatoire.';
    }
    if (!this.ticket.priorite) {
      this.errors['priorite'] = 'La priorité est obligatoire.';
    }
    if (!this.ticket.dateSouhaite) {
      this.errors['dateSouhaite'] = 'La date souhaitée est obligatoire.';
    } else {
      // Vérification : date souhaitée > date système
      const selected = new Date(this.ticket.dateSouhaite);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        this.errors['dateSouhaite'] = 'La date souhaitée doit être supérieure à la date du jour.';
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  // ── Création ──────────────────────────────────────
  createTicket() {
    if (!this.validate()) {
      this.message = '❌ Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const payload: Partial<Ticket> = {
      titre:        this.ticket.titre.trim(),
      description:  this.ticket.description!.trim(),
      statut:       'A_faire',
      priorite:     this.ticket.priorite,
      dateSouhaite: this.ticket.dateSouhaite
    };

    this.ticketService.createTicket(payload).subscribe({
      next: (created) => {
        this.message = '✅ Ticket créé avec succès.';
        this.errors = {};

        // Ajouter le ticket retourné par l'API à la liste locale
        const newTicket: Ticket = {
          ...payload,
          id:           created?.id,
          dateCreation: created?.dateCreation ?? new Date().toISOString(),
          statut:       'A_faire',
          titre:        payload.titre!,
          description:  payload.description!,
          priorite:     payload.priorite!,
          dateSouhaite: payload.dateSouhaite!
        };
        this.ticketList.unshift(newTicket); // Ajouter en tête de liste
        this.showList = true;

        this.resetForm();
      },
      error: (err) => {
        this.message = '❌ Erreur : ' + (err.error?.message || 'Erreur serveur.');
      }
    });
  }

  // ── Reset ─────────────────────────────────────────
  resetForm() {
    this.ticket = {
      titre:        '',
      description:  '',
      statut:       'A_faire',
      priorite:     'Moyenne',
      dateSouhaite: this.minDate   // ← reset avec demain
    };
    this.errors = {};
    this.message = '';
  }

  // ── Helpers ───────────────────────────────────────
  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getPrioriteClass(priorite: string): string {
    const p = priorite?.toUpperCase();
    if (p === 'HIGH'   || p === 'HAUTE')   return 'prio prio-haute';
    if (p === 'MEDIUM' || p === 'MOYENNE') return 'prio prio-moyenne';
    if (p === 'LOW'    || p === 'BASSE')   return 'prio prio-basse';
    return 'prio';
  }

  getPrioriteLabel(priorite: string): string {
    const p = priorite?.toUpperCase();
    if (p === 'HIGH'   || p === 'HAUTE')   return 'Haute';
    if (p === 'MEDIUM' || p === 'MOYENNE') return 'Moyenne';
    if (p === 'LOW'    || p === 'BASSE')   return 'Basse';
    return priorite ?? '—';
  }

  removeTicket(index: number): void {
    this.ticketList.splice(index, 1);
    if (this.ticketList.length === 0) this.showList = false;
  }
}