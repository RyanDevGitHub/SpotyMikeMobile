import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToggle,
} from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { BackButtonComponent } from 'src/app/shared/components/button/back-button/back-button.component';

import { ERoleUser, ICover, IUserDataBase } from './../../core/interfaces/user';
import { AuthentificationService } from './../../core/services/authentification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    IonList,
    IonInput,
    IonItem,
    IonText,
    IonButton,
    ReactiveFormsModule,
    BackButtonComponent,
    IonToggle,
    IonSelect,
    IonSelectOption,
    IonImg,
  ],
})
export class RegisterPage implements OnInit {
  constructor() {}
  router = inject(Router);
  localStore = inject(LocalStorageService);
  authentificationService = inject(AuthentificationService);
  step: number;
  form: FormGroup;
  public checkedToggle: boolean = false;
  avatar: ICover = {
    src: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  };
  user: IUserDataBase = {
    id: '',
    avatar: '',
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    sexe: '',
    favorites: { songs: [], albums: [] },
    role: ERoleUser.User,
    artiste: {
      id: '',
      userId: '',
      label: '',
      firstName: '',
      avatar: '',
      description: '',
      subscribers: [''],
    },
    playlists: [],
    lastsPlayed: [],
    created_at: '',
  };
  input = [
    {
      type: 'email',
      formeControlName: 'email',
      label: 'Email',
      formControl: 'email',
      btnName: 'Suivant',
      btnBack: 'ion-hide',
      toggle: 'ion-hide',
      selectSexe: 'ion-hide',
      avatar: 'ion-hide',
    },

    {
      type: 'password',
      formeControlName: 'password',
      label: 'Mot de passe',
      formControl: 'password',
      btnName: 'Suivant',
      btnBack: '',
      toggle: 'ion-hide',
      selectSexe: 'ion-hide',
      avatar: 'ion-hide',
    },

    {
      type: 'date',
      formeControlName: 'dateOfBirth',
      label: 'Date de naissance',
      formControl: 'dateOfBirth',
      btnName: 'Suivant',
      btnBack: '',
      toggle: 'ion-hide',
      selectSexe: 'ion-hide',
      avatar: 'ion-hide',
    },

    {
      type: 'sexe',
      formeControlName: 'sexe',
      label: 'Indiquer votre sexe',
      formControl: 'sexe',
      btnName: 'Suivant',
      btnBack: '',
      toggle: 'ion-hide',
      selectSexe: '',
      hideInput: 'ion-hide',
      avatar: 'ion-hide',
    },

    {
      type: 'artist',
      formeControlName: 'artist',
      label: '',
      formControl: '',
      btnName: 'Suivant',
      btnBack: '',
      toggle: '',
      selectSexe: 'ion-hide',
      hideInput: 'ion-hide',
      avatar: 'ion-hide',
    },

    {
      type: 'avatar',
      formeControlName: 'avatar',
      label: 'Importer votre avatar',
      formControl: 'avatar',
      btnName: 'Suivant',
      btnBack: '',
      toggle: 'ion-hide',
      selectSexe: 'ion-hide',
      hideInput: 'ion-hide',
      avatar: '',
    },

    {
      type: 'name',
      formeControlName: 'name',
      label: 'Quel est votre nom',
      formControl: 'name',
      btnName: 'Crée un compte',
      btnBack: '',
      toggle: 'ion-hide',
      selectSexe: 'ion-hide',
      hideInput: '',
      avatar: 'ion-hide',
    },
  ];
  ngOnInit() {
    this.step = 0;
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'
        ),
        Validators.minLength(10),
      ]),
      dateOfBirth: new FormControl('', [
        Validators.required,
        this.minimumAgeValidator(12),
      ]),
      sexe: new FormControl('', [Validators.required]),
      artistName: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Zs'-.]{2,50}$"),
      ]),
      label: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9s.,'!&()-]{5,1000}$"),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9\\s.,'!&()-]{10,1000}$"),
      ]),
      avatar: new FormControl('', []),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-ZÀ-ÿ'\\s]{1,40}$"),
        Validators.minLength(5),
      ]),
    });
  }
  onChangeToggle() {
    if (this.checkedToggle === true) {
      this.checkedToggle = false;
    } else {
      this.checkedToggle = true;
    }
  }
  back() {
    if (this.step === this.input.length - 1 && !this.checkedToggle) {
      this.step -= 2;
      return;
    }
    this.step--;
    this.form.get('email')?.reset();
    this.form.get(this.input[this.step].formeControlName)?.reset();
  }

  getFormControl(input: string) {
    return this.form.get(input);
  }
  isBtnDisabled(input: string): boolean {
    // console.log(this.form.get(this.input[this.step].formeControlName));
    if (
      this.input[this.step].formeControlName === 'artist' &&
      !this.checkedToggle
    ) {
      return false;
    }
    if (
      this.input[this.step].formeControlName === 'artist' &&
      this.checkedToggle
    ) {
      if (
        this.getFormControl('artistName')?.valid &&
        this.getFormControl('label')?.valid &&
        this.getFormControl('description')?.valid
      )
        return false;
    }
    // if (this.getFormControl('email')?.value)
    //   this.getFormControl(input)?.setValue(this.getFormControl('email')?.value);
    if (this.getFormControl(input)?.valid && this.getFormControl(input)?.value)
      return false;
    if (input === 'avatar') return false;

    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange(e: any) {
    console.log('Selected value:', e.detail.value);
    // this.getFormControl(this.input[this.step].formeControlName)?.setValue(
    //   e.detail.value
    // );
  }

  returnToLoginPage() {
    this.router.navigate(['/auth/login']);
  }
  nextStep() {
    //verifier si l'étape est celle de l'artist ou de l'avatar
    console.log(
      this.input[this.step].formeControlName === 'artist' && !this.checkedToggle
    );
    if (
      this.input[this.step].formeControlName === 'artist' ||
      (this.input[this.step].formeControlName === 'avatar' &&
        this.checkedToggle === true)
    ) {
      if (this.input[this.step].formeControlName === 'artist') {
        this.user.artiste!.description =
          this.form.get('description')?.value || 'Description non fournie';
        this.user.artiste!.firstName =
          this.form.get('artistName')?.value || 'artistName non fournie';
        this.user.artiste!.label =
          this.form.get('label')?.value || 'label non fournie';
        this.user.role = ERoleUser.Artist;
        console.log('test!!!!!!!!!!!');
        console.log(this.user.artiste);
      }
    } else {
      //ajouter les info dans le user
      const userProperty = this.input[this.step]
        .formeControlName as keyof IUserDataBase;
      const value: string = this.form.get(
        this.input[this.step].formeControlName
      )?.value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.user[userProperty] = value as any;
      console.log(this.user[userProperty]);
      console.log(this.user);
    }
    //afficher le nouvelle input et bouton
    if (
      this.step < this.input.length - 1 &&
      this.input[this.step].formeControlName != 'artist'
    ) {
      this.form.get('email')?.reset();
      this.step++;
    } else if (
      this.input[this.step].formeControlName === 'artist' &&
      !this.checkedToggle
    ) {
      this.step = this.step + 2;
    } else if (
      this.input[this.step].formeControlName === 'artist' &&
      this.checkedToggle
    ) {
      console.log('test');
      this.form.get('email')?.reset();
      this.step = this.step + 1;
    } else if (this.step === this.input.length - 1) {
      this.registerUser(this.user);
    }

    //verifier si c'est dernier input pour ajouter un bouton avec la method OnSubmit() et avec comme valeur Crée un compte

    //verifier si ce n'ets pas le premier input pour afficher la fleche de retour

    //mettre la valeur du input a empty
  }

  minimumAgeValidator(minAge: number) {
    return (
      control: AbstractControl // Simplification de l'import Angular
      // ✅ CORRECTION : Utilisation de ValidationErrors (le type standard d'Angular) ou votre interface
    ): ValidationErrors | null => {
      if (control.value) {
        const today = new Date();
        // Le type de la valeur doit être converti en Date (ou géré via une garde de type)
        const birthDate = new Date(control.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < minAge) {
          // Le type de retour doit correspondre à ValidationErrors (qui accepte [key: string]: any)
          // Mais nous retournons un objet dont la structure est connue.
          return {
            minimumAge: { requiredAge: minAge, actualAge: age },
          } as ValidationErrors;
        }

        if (age > 100) {
          return {
            maximumAge: { requiredAge: 100, actualAge: age },
          } as ValidationErrors;
        }
      }
      return null;
    };
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;

    if (imageUrl) {
      // Dans ce bloc, TypeScript sait que imageUrl est de type 'string'
      if (this.avatar.src) {
        this.avatar.src = imageUrl;
      }
    }
  }

  registerUser(data: IUserDataBase) {
    console.log('Registering user with data:', data);
    //ajouter la date de creation du user
    const dateNow = new Date();
    this.user.created_at = dateNow.toDateString();

    //create user
    this.authentificationService.register(
      this.user.email,
      this.user.password,
      this.user
    );
    //return home

    this.authentificationService.login(this.user.email, this.user.password);

    this.router.navigate(['/home/home']);
  }
}
