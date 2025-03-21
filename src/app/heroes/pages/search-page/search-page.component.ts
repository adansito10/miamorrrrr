import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interfaces';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  standalone: false,
  styles: []
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  constructor(private heroesService: HeroesService) {}

  searchHero() {
    const value: string = this.searchInput.value?.trim() || '';

    if (value.length === 0) {
      this.heroes = [];
      return;
    }

    this.heroesService.getSuggestions(value)
      .subscribe(heroes => this.heroes = heroes);
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;
  }
}
