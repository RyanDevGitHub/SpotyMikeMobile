import { ERoleUser, IUserDataBase } from './../../core/interfaces/user';
import { AuthentificationService } from './../../core/services/authentification.service';
import { IPlaylist } from 'src/app/core/interfaces/playlistes';
import { IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonInput,
  IonItem,
  IonText,
  IonButton,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonAvatar,
} from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-strorage.service';
import { BackButtonComponent } from 'src/app/shared/components/button/back-button/back-button.component';
import { Camera, CameraResultType } from '@capacitor/camera';

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
    IonHeader,
    IonTitle,
    IonToolbar,
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
    IonAvatar,
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
  avatar: any = {
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
    favorites: [],
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
    lastsplayeds: [],
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
    if (this.getFormControl('email')?.value)
      this.getFormControl(input)?.setValue(this.getFormControl('email')?.value);
    if (this.getFormControl(input)?.valid && this.getFormControl(input)?.value)
      return false;
    if (input === 'avatar') return false;

    return true;
  }

  handleChange(e: any) {
    this.getFormControl(this.input[this.step].formeControlName)?.setValue(
      e.detail.value
    );
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
      control: import('@angular/forms').AbstractControl
    ): { [key: string]: any } | null => {
      if (control.value) {
        const today = new Date();
        const birthDate = new Date(control.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Si le mois de naissance est plus tard dans l'année que le mois actuel, nous devons diminuer l'âge de 1.
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < minAge) {
          return { minimumAge: { requiredAge: minAge, actualAge: age } };
        }
        if (age > 100) {
          return { maximumAge: { requiredAge: 100, actualAge: age } };
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
    var imageUrl = image.webPath;

    // Can be set to the src of an image now
    this.avatar.src = imageUrl;
  }

  registerUser(data: IUserDataBase) {
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
