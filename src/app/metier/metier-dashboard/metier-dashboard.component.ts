import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AddTicketComponent } from '../../add-ticket/add-ticket.component';
import { ListeticketComponent } from '../listeticket/listeticket.component';

@Component({
  selector: 'app-metier-dashboard',
  standalone: true,
  imports: [NgIf, AddTicketComponent, ListeticketComponent],
  templateUrl: './metier-dashboard.component.html',
  styleUrls: ['./metier-dashboard.component.css']
})
export class MetierDashboardComponent {
  view: 'create' | 'list' = 'list';
}