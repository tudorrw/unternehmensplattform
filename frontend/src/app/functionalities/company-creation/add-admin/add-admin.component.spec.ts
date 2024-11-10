import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Necesitar pentru [(ngModel)]
import { AddAdminComponent } from './add-admin.component'; // Import componenta

describe('AddAdminComponent', () => {
    let component: AddAdminComponent;
    let fixture: ComponentFixture<AddAdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddAdminComponent],
            imports: [FormsModule], // Importează FormsModule pentru a permite utilizarea [(ngModel)]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit admin data when submitAdmin is called', () => {
        const spy = spyOn(component.adminSubmitted, 'emit'); // Creăm un "spy" pe emit

        // Setăm datele adminului
        component.adminData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

        component.submitAdmin(); // Apelăm metoda submitAdmin

        expect(spy).toHaveBeenCalledWith(component.adminData); // Verificăm că evenimentul a fost emis corect cu datele adminului
    });

    it('should emit closeForm when closeFormHandler is called', () => {
        const spy = spyOn(component.closeForm, 'emit'); // Creăm un "spy" pe emit

        component.closeFormHandler(); // Apelăm metoda de închidere a formularului

        expect(spy).toHaveBeenCalled(); // Verificăm că evenimentul de închidere a formularului a fost emis
    });

    it('should have empty fields on initialization', () => {
        expect(component.adminData.firstName).toBe('');
        expect(component.adminData.lastName).toBe('');
        expect(component.adminData.email).toBe('');
    });

    it('should disable submit button if form is invalid', () => {
        // Verificăm că butonul de submit este activ doar dacă formularul este valid
        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

        // Înainte de a completa câmpurile, butonul ar trebui să fie dezactivat
        expect(submitButton.disabled).toBeTruthy();

        // Setăm câmpurile ca valide
        component.adminData.firstName = 'John';
        component.adminData.lastName = 'Doe';
        component.adminData.email = 'john.doe@example.com';

        fixture.detectChanges(); // Recalculează starea formularului

        // După completarea câmpurilor, butonul de submit ar trebui să fie activ
        expect(submitButton.disabled).toBeFalsy();
    });
});
