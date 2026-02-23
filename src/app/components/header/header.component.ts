import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;

  ngOnInit() {
    this.setupScrollListener();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    this.closeMobileMenu();
  }

  private setupScrollListener() {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header') as HTMLElement;
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(21, 24, 38, 0.98)';
        } else {
          header.style.background = 'rgba(21, 24, 38, 0.95)';
        }
      }
    });
  }
}