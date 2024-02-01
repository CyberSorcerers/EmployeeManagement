import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {DataRequest} from "../dataRequest.service";
import {FormsModule} from "@angular/forms";
import {Employee} from "../Employee";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent implements OnInit{

  route: ActivatedRoute = inject(ActivatedRoute);
  employee!: Employee;


  constructor(private reqService: DataRequest, private router: Router) {
  }

  ngOnInit():void {
    const id = this.route.snapshot.paramMap.get('id');
    this.reqService.getEmployeesById(id).subscribe((data) => {
      this.employee = data;
    });
  }

  editEmployee() {
    this.router.navigate(['/edit', this.employee.id]);
  }

  deleteEmployee() {
    this.reqService.deleteEmployee(this.employee.id).subscribe((data) => {
      this.router.navigate(['/employees']);
    });
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}
