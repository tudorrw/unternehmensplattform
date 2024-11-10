import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AddCompanyComponent } from './add-company.component';
import { AddAdminComponent } from '../add-admin/add-admin.component'; // Asigură-te că importi corect componenta de admin
import { By } from '@angular/platform-browser';

describe('AddCompanyComponent', () => {
    let component: AddCompanyComponent;
    let fixture: ComponentFixture<AddCompanyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ AddCompanyComponent, AddAdminComponent ],
            imports: [ FormsModule ] // Asigură-te că importi FormsModule pentru [(ngModel)]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddCompanyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should show the add admin form when the "Create Admin" button is clicked', () => {
        const createAdminButton = fixture.debugElement.query(By.css('button[type="button"]'));
        createAdminButton.triggerEventHandler('click', null);

        fixture.detectChanges(); // Recalculează starea componentei

        const adminForm = fixture.debugElement.query(By.css('app-add-admin'));
        expect(adminForm).toBeTruthy(); // Verifică dacă formularul de admin a devenit vizibil
    });

    it('should close the add admin form when closeForm is emitted from AddAdminComponent', () => {
        // Fă formularul de admin vizibil
        component.openAddAdminForm();
        fixture.detectChanges();

        const closeFormButton = fixture.debugElement.query(By.css('app-add-admin button[type="button"]'));
        closeFormButton.triggerEventHandler('click', null);

        fixture.detectChanges();

        const adminForm = fixture.debugElement.query(By.css('app-add-admin'));
        expect(adminForm).toBeFalsy(); // Verifică dacă formularul de admin a fost închis
    });

    it('should emit companyCreated event when form is submitted', () => {
        const spy = spyOn(component.companyCreated, 'emit'); // Creăm un "spy" pe emit

        // Completem formularul cu date valide
        component.company.name = 'New Company';
        component.company.address = '123 Company Street';
        component.company.telefonNumber = '+1234567890';
        component.selectedAdminId = 1; // Selectăm un admin existent

        // Apelăm metoda onSubmit
        component.onSubmit();

        expect(spy).toHaveBeenCalled(); // Verificăm că evenimentul companyCreated a fost emis
    });

    it('should disable the submit button if the form is invalid', () => {
        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

        // Inițial, butonul ar trebui să fie dezactivat
        expect(submitButton.disabled).toBeTruthy();

        // Completăm formularul cu date valide
        component.company.name = 'New Company';
        component.company.address = '123 Company Street';
        component.company.telefonNumber = '+1234567890';
        component.selectedAdminId = 1; // Selectăm un admin existent

        fixture.detectChanges(); // Recalculează starea formularului

        // După completarea câmpurilor, butonul de submit ar trebui să fie activ
        expect(submitButton.disabled).toBeFalsy();
    });

    it('should show the admin selection dropdown', () => {
        const selectDropdown = fixture.nativeElement.querySelector('select');
        expect(selectDropdown).toBeTruthy(); // Verifică dacă dropdown-ul cu admins este prezent
    });
});
