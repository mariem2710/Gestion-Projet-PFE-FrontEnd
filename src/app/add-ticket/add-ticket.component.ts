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

  ticket: Ticket = {
    titre: '',
    description: '',
    statut: 'TODO',
    priorite: 'MEDIUM',
    dateSouhaite: ''
  };

  message = '';

  constructor(private ticketService: TicketService) {}

  createTicket() {
    this.ticketService.createTicket(this.ticket).subscribe({
      next: (data) => {
        console.log("Ticket created:", data);
        this.message = "Ticket créé avec succès ✅";

        // reset form
        this.ticket = {
          titre: '',
          description: '',
          statut: 'TODO',
          priorite: 'MEDIUM',
          dateSouhaite: ''
        };
      },
      error: (err) => {
        console.error(err);
        this.message = "Erreur lors de la création ❌";
      }
    });
  }
}
