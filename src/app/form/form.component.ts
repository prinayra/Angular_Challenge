import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatCardModule,
    MatSlideToggleModule,

  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  userName: string = '';
  email: string = '';
  password: string = '';
  gender: string = '';
  birthDate!: Date;
  address: string = '';
  phoneNumber: string = '';
  maritalStatus: string = '';
  occupation: string = '';
  emergencyContact: string = '';
  hobbies: string = '';
  angularSkillLevel: number = 5;
  submitted = false;
  minSkillLevel = 1;
  maxSkillLevel = 10;
  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  maritalControl = new FormControl<string | null>('', Validators.required);
  maritalStatusOptions: { status: string }[] = [
    { status: 'Single' },
    { status: 'Married' },
    { status: 'Divorced' },
    { status: 'Widowed' }
  ];
  filteredOptions!: Observable<{ status: string }[]>;

  formdata: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    gender: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    maritalStatus: this.maritalControl,
    address: new FormControl(''),
    angularSkillLevel: new FormControl(5)
  });

  constructor(private fb: FormBuilder, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.formdata = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', Validators.required],
      address: [''],
      birthDate: [''],
      phoneNumber: ['', Validators.pattern('^[0-9]{10,15}$')],
      maritalStatus: [''],
      occupation: [''],
      emergencyContact: ['', Validators.pattern('^[0-9]{10,15}$')],
      hobbies: [''],
      angularSkillLevel: [5]
    });

    this.filteredOptions = this.maritalControl.valueChanges.pipe(
      startWith<string | { status: string } | null>(''),
      map(value => (typeof value === 'string' ? value : (value as { status: string })?.status ?? '')),
      map(status => this._filter(status))
    );

    this.iconRegistry.addSvgIcon(
      'phone',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/phone.svg')
    );
    this.iconRegistry.addSvgIcon(
      'family',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/family.svg')
    );
    this.iconRegistry.addSvgIcon(
      'work',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/work.svg')
    );
    this.iconRegistry.addSvgIcon(
      'emergency',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/emergency.svg')
    );
    this.iconRegistry.addSvgIcon(
      'sports',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/sports.svg')
    );
  }

  private _filter(status: string): { status: string }[] {
    const filterValue = status.toLowerCase();
    return this.maritalStatusOptions.filter(option => option.status.toLowerCase().includes(filterValue));
  }

  displayFn(option: { status: string } | string | null): string {
    return typeof option === 'string' ? option : option?.status ?? '';
  }

  onClickSubmit(data: {
    userName: string;
    email: string;
    password: string;
    gender: string;
    address: string;
    birthDate: Date;
    phoneNumber: string;
    maritalStatus: string;
    occupation: string;
    emergencyContact: string;
    hobbies: string;
    angularSkillLevel: number;
  }) {
    this.submitted = true;
    this.userName = data.userName;
    this.email = data.email;
    this.password = data.password;
    this.gender = data.gender;
    this.address = data.address;
    this.phoneNumber = data.phoneNumber;
    this.birthDate = data.birthDate;
    this.maritalStatus = this.maritalControl.value
        ? typeof this.maritalControl.value === 'object'
          ? (this.maritalControl.value as { status: string }).status
          : this.maritalControl.value
        : '';
    this.occupation = data.occupation;
    this.emergencyContact = data.emergencyContact;
    this.hobbies = data.hobbies;
    this.angularSkillLevel = data.angularSkillLevel;

    if (this.formdata.valid) {
      console.log("Form Submitted!", this.formdata.value);
    } else {
      console.log('Form is not valid!');
    }
  }
}
