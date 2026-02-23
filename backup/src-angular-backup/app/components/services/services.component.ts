import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Service[] = [
    {
      icon: 'fas fa-code',
      title: 'POS + Gestor de inventarios',
      description: 'Controla tus ventas de stock en tiempo real, evita perdidas y optimiza tu negocio con un sistema todo en uno.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'ChatBot',
      description: 'Atiende a tus clientes 24/7, resuelve dudas, toma pedidos y automatiza respuestas.'
    },
    {
      icon: 'fas fa-cloud',
      title: 'Aplicacion Web',
      description: 'Lleva tu negocio al mundo digital con una plataforma a la medida, accesible desde cualquier dispositivo.'
    },
    {
      icon: 'fas fa-database',
      title: 'Gestión de Datos',
      description: 'Diseñamos y optimizamos bases de datos para mejorar el rendimiento y la integridad de tu información.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Software personalizado',
      description: 'Optimiza los procesos internos de tu negocio con soluciones de software pensadas para ti.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Aplicaciones para ti',
      description: 'Transformamos tus ideas en soluciones de software innovadoras.'
    }
  ];

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animation = 'fadeInUp 0.8s ease forwards';
        }
      });
    }, observerOptions);

    setTimeout(() => {
      document.querySelectorAll('.service-card').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }
}