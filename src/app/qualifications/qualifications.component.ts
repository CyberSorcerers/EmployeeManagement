import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataRequest } from "../dataRequest.service";
import { Qualification } from "../Qualification";
import { Observable } from "rxjs";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { AppFilterPipe } from "../app-filter.pipe";
import { Router } from "@angular/router";

@Component({
  selector: "app-qualifications",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppFilterPipe, FormsModule],
  templateUrl: "./qualifications.component.html",
  styleUrl: "./qualifications.component.css",
})
export class QualificationsComponent {
  searchText = "";
  skillProp = "";
  idProp: number = -1;
  qualifications$: Observable<Qualification[]> = new Observable();
  profileForm = new FormGroup({
    skillSet: new FormControl(""),
  });
  constructor(private reqService: DataRequest, private router: Router) {}

  ngOnInit() {
    this.qualifications$ = this.reqService.getQualifications();
  }
  handleNav(id: number) {
    this.reqService.searchEmployee$.next(id);
    this.router.navigate(["/", "searchEmployees"]);
  }

  handleSubmit() {
    if (this.profileForm.value.skillSet) {
      this.reqService
        .createQualification(this.profileForm.value.skillSet)
        .subscribe(
          () => (this.qualifications$ = this.reqService.getQualifications())
        );
    }
  }

  handleProps(id: number | undefined, skill: string | undefined) {
    if (id && skill) {
      this.idProp = id;
      this.skillProp = skill;
    }
  }
  handleSave(id: number | undefined, skill: string) {
    if (id) {
      this.reqService.updateQualification(id, skill).subscribe(() => {
        // refresh the qualifications$ observable
        this.qualifications$ = this.reqService.getQualifications();
      });
    }
  }

  deleteQualification(id: number | undefined, skillSet: string | undefined) {
    if (id) {
      this.reqService
        .handleDeleteOfQualification(id, skillSet ?? "")
        .subscribe(
          () => (this.qualifications$ = this.reqService.getQualifications())
        );
    }
  }
}
