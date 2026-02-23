import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactEmail = 'elevaforge@gmail.com';
  
  contact: Contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    if (this.contact.name && this.contact.email && this.contact.subject && this.contact.message) {
      console.log('Formulario enviado:', this.contact);
      alert('Mensaje enviado correctamente. Te contactaremos pronto.');
      
      // Limpiar formulario
      this.contact = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }
  }
}