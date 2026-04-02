import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-metier-dashboard',
  imports:[NgFor,NgIf,FormsModule],
  templateUrl: './metier-dashboard.component.html',
  styleUrls: ['./metier-dashboard.component.css']
})
export class MetierDashboardComponent implements OnInit {

  tickets: Ticket[] = [];
  todoTickets: Ticket[] = [];
  selectedTicketId!: number;
  commentText = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
    this.loadTodoTickets();
  }

  loadTickets() {
    this.ticketService.getAllTickets().subscribe(data => {
      this.tickets = data;
    });
  }

  loadTodoTickets() {
    this.ticketService.getTodoTickets().subscribe(data => {
      this.todoTickets = data;
    });
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id).subscribe(() => {
      this.loadTickets();
      this.loadTodoTickets();
    });
  }

 selectTicket(id: number) {
  this.selectedTicketId = id;
  console.log("Selected ticket:", id); // 🔥 debug
}

  addComment() {

  if (!this.selectedTicketId) {
    alert("⚠️ Sélectionnez un ticket d'abord !");
    return;
  }

  if (!this.commentText.trim()) {
    alert("⚠️ Écrivez un commentaire !");
    return;
  }

  this.ticketService.addComment(this.selectedTicketId, this.commentText)
    .subscribe({
      next: () => {
        this.commentText = '';
        alert('✅ Commentaire ajouté');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Erreur ajout commentaire');
      }
    });
}
}