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
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, FormsModule, AppFilterPipe],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css'
})
export class EmployeeCreateComponent implements OnInit {
  qualifications$: Observable<Qualification[]> = new Observable();
  skillset: {skill: Qualification}[];


  constructor(private reqService: DataRequest, private router: Router) {
    this.skillset = [];
  }
  goBack() {
    this.router.navigate(['/employees']);
  }

  ngOnInit():void {
    this.getQualifications();
  }

  create(firstName: string, lastName: string, street: string, postcode: string, city: string, phone: string){
    this.reqService.createEmployee(firstName, lastName, street, postcode, city, phone, this.skillset)
  }

  addQualification(quali: Qualification) {
    if (this.skillset


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
