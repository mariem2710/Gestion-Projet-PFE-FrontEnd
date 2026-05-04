import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket';

interface TicketValide {
  ticket: Ticket;
  domaines: string[];
  dateValidation: Date;
}

const STORAGE_KEY = 'ticketsValides';

@Component({
  selector: 'app-analyse-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analyse-dashboard.component.html',
  styleUrls: ['./analyse-dashboard.component.css']
})
export class AnalyseDashboardComponent implements OnInit {

  view: string = 'tickets';
  tickets: Ticket[] = [];
  filtered: Ticket[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  filterPriorite = '';

  selectedTicket: Ticket | null = null;
  showPanel = false;
  actionMessage = '';
  actionType: 'success' | 'error' | '' = '';

  showDomaineModal = false;
  selectedDomaines: string[] = [];

  domaines: string[] = [
    'DME', 'DMFI', 'IT', 'DRC', 'DFR', 'DCF',
    'DMM', 'DRT', 'INFO CENTRE', '1200',
    'NOC DATA', 'BOM', 'PORTAIL', 'DCWI'
  ];

  ticketsValides: TicketValide[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTicketsValidesFromStorage(); // ← charger au démarrage
    this.loadTickets();
  }

  // ── Persistance localStorage ──────────────────────
  private loadTicketsValidesFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: TicketValide[] = JSON.parse(raw);
        // Reconvertir les dates string → Date
        this.ticketsValides = parsed.map(tv => ({
          ...tv,
          dateValidation: new Date(tv.dateValidation)
        }));
      }
    } catch {
      this.ticketsValides = [];
    }
  }

  private saveTicketsValidesToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ticketsValides));
    } catch {
      console.error('Erreur lors de la sauvegarde localStorage.');
    }
  }

  // ── Tickets ───────────────────────────────────────
  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        // Exclure les tickets déjà validés localement
        const validatedIds = new Set(this.ticketsValides.map(tv => tv.ticket.id));
        this.tickets = data.filter(
          t => (t.statut as string) === 'A_faire' && !validatedIds.has(t.id)
        );
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les tickets.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = this.tickets.filter(t => {
      const matchSearch = !term || t.titre?.toLowerCase().includes(term);
      let matchPrio = true;
      if (this.filterPriorite) {
        const p = (t.priorite as string)?.toUpperCase();
        switch (this.filterPriorite) {
          case 'HIGH':   matchPrio = p === 'HIGH'   || p === 'HAUTE';   break;
          case 'MEDIUM': matchPrio = p === 'MEDIUM' || p === 'MOYENNE'; break;
          case 'LOW':    matchPrio = p === 'LOW'    || p === 'BASSE';   break;
        }
      }
      return matchSearch && matchPrio;
    });
  }

  countByPrio(level: string): number {
    return this.tickets.filter(t => {
      const p = (t.priorite as string)?.toUpperCase();
      switch (level) {
        case 'HIGH':   return p === 'HIGH'   || p === 'HAUTE';
        case 'MEDIUM': return p === 'MEDIUM' || p === 'MOYENNE';
        case 'LOW':    return p === 'LOW'    || p === 'BASSE';
        default:       return false;
      }
    }).length;
  }

  getPrioriteClass(priorite: string): string {
    const p = priorite?.toUpperCase();
    if (p === 'HIGH' || p === 'HAUTE')     return 'prio prio-haute';
    if (p === 'MEDIUM' || p === 'MOYENNE') return 'prio prio-moyenne';
    if (p === 'LOW' || p === 'BASSE')      return 'prio prio-basse';
    return 'prio';
  }

  getPrioriteLabel(priorite: string): string {
    const p = priorite?.toUpperCase();
    if (p === 'HIGH' || p === 'HAUTE')     return 'Haute';
    if (p === 'MEDIUM' || p === 'MOYENNE') return 'Moyenne';
    if (p === 'LOW' || p === 'BASSE')      return 'Basse';
    return priorite ?? '—';
  }

  // ── Panel ─────────────────────────────────────────
  openDetails(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.showPanel = true;
    this.actionMessage = '';
    this.actionType = '';
    this.selectedDomaines = [];
    this.showDomaineModal = false;
  }

  closePanel(): void {
    this.showPanel = false;
    this.selectedTicket = null;
    this.actionMessage = '';
    this.actionType = '';
    this.showDomaineModal = false;
    this.selectedDomaines = [];
  }

  // ── Sélection domaines ────────────────────────────
  ouvrirSelectionDomaine(): void {
    this.selectedDomaines = [];
    this.showDomaineModal = true;
  }

  annulerDomaine(): void {
    this.showDomaineModal = false;
    this.selectedDomaines = [];
  }

  toggleDomaine(d: string): void {
    const idx = this.selectedDomaines.indexOf(d);
    if (idx === -1) {
      this.selectedDomaines.push(d);
    } else {
      this.selectedDomaines.splice(idx, 1);
    }
  }

  isDomainSelected(d: string): boolean {
    return this.selectedDomaines.includes(d);
  }

  getDomaineRank(d: string): number {
    return this.selectedDomaines.indexOf(d) + 1;
  }

  // ── Validation ────────────────────────────────────
  confirmerValidation(): void {
    if (this.selectedDomaines.length === 0) {
      alert('Veuillez sélectionner au moins un domaine.');
      return;
    }
    if (!this.selectedTicket?.id) return;

    this.ticketService.approveTicket(this.selectedTicket.id).subscribe({
      next: () => {
        this.showDomaineModal = false;

        const newEntry: TicketValide = {
          ticket:         { ...this.selectedTicket! },
          domaines:       [...this.selectedDomaines],
          dateValidation: new Date()
        };

        this.ticketsValides.unshift(newEntry);
        this.saveTicketsValidesToStorage(); // ← persister

        const liste = this.selectedDomaines
          .map((d, i) => `${i + 1}. ${d}`)
          .join(' › ');
        this.actionMessage = `✅ Ticket validé — Domaines : ${liste}`;
        this.actionType = 'success';

        this.tickets = this.tickets.filter(t => t.id !== this.selectedTicket!.id);
        this.applyFilters();
        setTimeout(() => this.closePanel(), 2000);
      },
      error: () => {
        this.showDomaineModal = false;
        this.actionMessage = '❌ Erreur lors de la validation.';
        this.actionType = 'error';
      }
    });
  }

  // ── Rejet ─────────────────────────────────────────
  rejeter(): void {
    if (!this.selectedTicket?.id) return;
    this.ticketService.rejectTicket(this.selectedTicket.id).subscribe({
      next: () => {
        this.actionMessage = '🚫 Ticket rejeté.';
        this.actionType = 'error';
        this.tickets = this.tickets.filter(t => t.id !== this.selectedTicket!.id);
        this.applyFilters();
        setTimeout(() => this.closePanel(), 1500);
      },
      error: () => {
        this.actionMessage = '❌ Erreur lors du rejet.';
        this.actionType = 'error';
      }
    });
  }

  // ── Retirer un ticket validé ──────────────────────
  retirerTicketValide(index: number): void {
    this.ticketsValides.splice(index, 1);
    this.saveTicketsValidesToStorage(); // ← persister la suppression
  }
}