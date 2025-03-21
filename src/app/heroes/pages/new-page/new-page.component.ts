import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../services/heroes.service';
import { catchError, filter, first, of, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Hero, Publisher } from '../../interfaces/hero.interfaces';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  standalone: false
})
export class NewPageComponent {
  public hero?: Hero;
  public defaultImage = 'images/no-image.png';  // La URL correcta de la imagen por defecto


  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    characters: new FormControl(''),
    first_appearance: new FormControl(''),
    alt_img: new FormControl(''),
    image_url: new FormControl('')

  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(
    private heroesService: HeroesService,  
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private dialog: MatDialog, 
    private snackBar: MatSnackBar
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }
  get heroTitle(): string {
    return this.hero?.superhero ? `Edit ${this.hero.superhero}` : 'Add New Hero';
  }
  

  onSubmit(): void {
    if (this.heroForm.invalid) return;
  
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        console.log("Héroe actualizado:", hero);
        // Mostrar el mensaje de éxito con el nombre del héroe
        this.snackBar.open(`Héroe "${hero.superhero}" editado correctamente`, 'Cerrar', {
          duration: 3000, 
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'] 
        });
        this.router.navigate(['/heroes/list']); // Redirigir después de actualizar
      });
    } else {
      this.heroesService.addHero(this.currentHero).subscribe(hero => {
        console.log("Héroe agregado:", hero);
        this.router.navigate(['/heroes/list']); // Redirigir después de agregar
      });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => {
        if (!id) return []; // Si no hay id, retorna un array vacío para evitar errores
        return this.heroesService.getHeroById(id);
      })
    ).subscribe(hero => {
      if (!hero) {
        this.router.navigate(['/heroes/list']);
        return;
      }
  
      this.hero = hero;
      console.log("Héroe recibido:", hero);
  
      this.heroForm.patchValue({
        id: hero.id,
        superhero: hero.superhero,
        publisher: hero.publisher,
        alter_ego: hero.alter_ego,
        first_appearance: hero.first_appearance,
        characters: hero.characters,
        alt_img: hero.alt_img,
        image_url: hero.image_url

      });
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) {
      throw Error('Hero is required');
    }
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });
  
    dialogRef.afterClosed().pipe(
      tap(result => console.log('Dialog result:', result)), // 👀 Para depuración
      filter((result: boolean) => result), // Solo continúa si el usuario confirma
      switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
      tap(wasDeleted => console.log('Hero deleted:', wasDeleted)), // 👀 Verifica si se eliminó
      filter((wasDeleted: boolean) => wasDeleted), // Solo continúa si se eliminó correctamente
      catchError(error => {
        console.error('Error deleting hero:', error);
        return of(false); // Evita que la suscripción se rompa
      })
    )
    .subscribe((wasDeleted) => {
      if (wasDeleted) {
        this.snackBar.open('Héroe eliminado con éxito', 'Cerrar', {
          duration: 3000, 
          horizontalPosition: 'start',
          verticalPosition: 'bottom', 
          panelClass: ['snackbar-success'] 
        });
        this.router.navigate(['/heroes/list']);
      }
    });
  }
}
