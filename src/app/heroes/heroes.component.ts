import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }
  /**when the given name is non-blank, the handler creates a hero-like object from 
   * the name (it's only missing the id) and passes it to the services addHero() method
   * when addHero() saves successfully, the subscribe() callback receives the new hero and pushes it
   * to the heroes list for display
   */
  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({name} as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      })
  }

  /** Although the component delegates hero deletion to the HeroService, it remains responsible for 
   * updating its own list of heroes. The component's delete() method immediately removes the hero-to-delete 
   * from that list, anticipating that the HeroService will succeed on the server.*/
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
