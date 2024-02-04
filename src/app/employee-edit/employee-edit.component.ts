import {Component, inject, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Employee} from "../Employee";
import {ActivatedRoute, Router} from "@angular/router";
import {DataRequest} from "../dataRequest.service";
import {map, Observable} from "rxjs";
import {Qualification} from "../Qualification";
import {AppFilterPipe} from "../app-filter.pipe";

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, AppFilterPipe],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {
  qualifications$: Observable<Qualification[]> = new Observable();
  skillset: number[];
  route: ActivatedRoute = inject(ActivatedRoute);
  employee!: Employee;

  constructor(private reqService: DataRequest, private router: Router) {
    this.skillset = [];

  }
  goBack() {
    this.router.navigate(['/employees/details', this.employee.id]);
  }

  ngOnInit():void {
    this.getQualifications();
    const id = this.route.snapshot.paramMap.get('id');
    this.reqService.getEmployeesById(id).subscribe((data) => {
      this.employee = data;
    })
    if(this.employee.skillSet) {
      this.skillset = this.employee.skillSet?.map(skill => {
        return skill.id
      });
    }
  }

  updateEmployee(){
    this.reqService.updateEmployee(this.employee.id, this.employee.firstName, this.employee.lastName, this.employee.street, this.employee.postcode, this.employee.city, this.employee.phone, this.skillset)
  }

  addQualification(quali: Qualification) {
    if (!this.skillset.includes(quali.id)) {
      this.skillset.push(quali.id);
    }
  }

  removeQualification(quali: Qualification){
    if (this.skillset.includes(quali.id)){
      const index = this.skillset.indexOf(quali.id, 0);
      if (index > -1) {
        this.skillset.splice(index, 1);
      }
    }
  }

  getQualifications() {
    this.qualifications$ = this.reqService.getQualifications().pipe(
      map(qualifications => qualifications.sort((a, b) => {
        if (a.id && b.id) {
          return a.id - b.id;
        } else {
          return 0;
        }
      }))
    );
  }
}