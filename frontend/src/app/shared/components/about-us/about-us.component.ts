import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  currentValueSlide: number = 0;
  currentTeamSlide: number = 0;

  values = [
    { title: 'Accessibility', description: 'We ensure education is available to everyone, anytime, anywhere, with courses designed for all learning levels.' },
    { title: 'Innovation', description: 'Our platform leverages cutting-edge technology to deliver interactive and personalized learning experiences.' },
    { title: 'Community', description: 'We foster a global community of learners and educators, encouraging collaboration and knowledge sharing.' }
  ];

  team = [
    { name: 'Rohit Zirmute', role: 'Founder & CEO', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2PopevORe4gHj-LOC8Yk6ocovEwJMgyOn6w&s' },
    { name: 'Rohit Z', role: 'Chief Learning Officer', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2PopevORe4gHj-LOC8Yk6ocovEwJMgyOn6w&s' },
    { name: 'Rohit', role: 'Head of Technology', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2PopevORe4gHj-LOC8Yk6ocovEwJMgyOn6w&s' }
  ];

  @ViewChild('valuesSlider') valuesSlider!: ElementRef;
  @ViewChild('teamSlider') teamSlider!: ElementRef;

  constructor(private router: Router) {}

  prevSlide(type: 'values' | 'team') {
    if (type === 'values' && this.currentValueSlide > 0) {
      this.currentValueSlide--;
      this.updateSlider(type);
    } else if (type === 'team' && this.currentTeamSlide > 0) {
      this.currentTeamSlide--;
      this.updateSlider(type);
    }
  }

  nextSlide(type: 'values' | 'team') {
    if (type === 'values' && this.currentValueSlide < this.values.length - 1) {
      this.currentValueSlide++;
      this.updateSlider(type);
    } else if (type === 'team' && this.currentTeamSlide < this.team.length - 1) {
      this.currentTeamSlide++;
      this.updateSlider(type);
    }
  }

  goToSlide(type: 'values' | 'team', index: number) {
    if (type === 'values') {
      this.currentValueSlide = index;
      this.updateSlider(type);
    } else if (type === 'team') {
      this.currentTeamSlide = index;
      this.updateSlider(type);
    }
  }

  private updateSlider(type: 'values' | 'team') {
    const slider = type === 'values' ? this.valuesSlider : this.teamSlider;
    const slideIndex = type === 'values' ? this.currentValueSlide : this.currentTeamSlide;
    const slideWidth = slider.nativeElement.querySelector('.mat-grid-tile').offsetWidth;
    slider.nativeElement.querySelector('.mat-grid-list').style.transform = `translateX(-${slideIndex * slideWidth}px)`;
  }
}