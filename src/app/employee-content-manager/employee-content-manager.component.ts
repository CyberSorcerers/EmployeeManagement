import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DataRequest } from "../dataRequest.service";
import { Qualification } from "../Qualification";
import { AppFilterPipe } from "../app-filter.pipe";

@Component({
  selector: "app-employee-content-manager",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppFilterPipe],
  templateUrl: "./employee-content-manager.component.html",
  styleUrl: "./employee-content-manager.component.css",
})
export class EmployeeContentManagerComponent implements OnInit {
  employeeForm: FormGroup;
  qualifications: Qualification[] = [];
  id?: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataRequest: DataRequest
  ) {
    this.employeeForm = this.formBuilder.group({});
    this.isAddMode = true;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.isAddMode = !this.id;
    this.employeeForm = new FormGroup<any>({
      lastName: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      street: new FormControl("", Validators.required),
      postcode: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      skills: this.formBuilder.group({}),
    });
    this.getAllQualifications();
  }

  private getAllQualifications() {
    this.dataRequest.getQualifications().subscribe((qualifications) => {
      this.qualifications = qualifications;
      const skillsGroup = this.employeeForm.get("skills") as FormGroup;
      qualifications.forEach((qualification) => {
        skillsGroup.addControl(
          qualification.id.toString(),
          new FormControl(false)
        );
      });

      if (this.id) {
        if (!this.isAddMode) {
          this.dataRequest.getEmployeesById(this.id).subscribe((employee) => {
            this.employeeForm.patchValue(employee);
            employee.skillSet?.forEach((skill) => {
              if (skillsGroup.contains(skill.id.toString())) {
                skillsGroup.get(skill.id.toString())?.setValue(true);
              }
            });
          });
        }
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm?.invalid) {
      return;
    }

    this.loading = true;
    const employeeData = { ...this.employeeForm.value };
    employeeData.skillSet = this.qualifications
      .filter((qualification) => {
        return this.employeeForm.get("skills")?.get(qualification.id.toString())
          ?.value;
      })
      .map((qualification) => qualification.id); // Nur die IDs der Qualifikationen senden

    if (this.isAddMode) {
      this.createEmployee(employeeData);
    } else {
      this.updateEmployee(employeeData);
    }
  }

  private createEmployee(employeeData: any) {
    this.dataRequest.createEmployee(employeeData).subscribe(() => {
      this.router.navigate(["/employees"]);
    });
  }

  private updateEmployee(employeeData: any) {
    this.dataRequest.updateEmployee(this.id, employeeData).subscribe(() => {
      this.router.navigate(["/detail", this.id]);
    });
  }

  addSkill(skill: string) {
    const control = new FormControl(skill, Validators.required);
    (this.employeeForm?.get("skills") as FormGroup).addControl(skill, control);
  }

  goBack() {
    this.router.navigate(["/employees"]);
  }
}
