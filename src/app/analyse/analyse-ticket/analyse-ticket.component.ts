import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-analyse-ticket',
  standalone: true,                                        // ✅ ajout obligatoire
  imports: [NgIf, NgFor, DatePipe, CommonModule],
  templateUrl: './analyse-ticket.component.html',          // ✅ était "template" sans Url ni :
  styleUrls: ['./analyse-ticket.component.css']
})
export class AnalyseTicketComponent implements OnInit {

  tickets: Ticket[] = [];

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTodoTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => {
        console.error('Erreur chargement tickets TODO', err);
      }
    });
  }

  openDetails(id: number) {
    this.router.navigate(['/ticket-details', id]);
  }
}