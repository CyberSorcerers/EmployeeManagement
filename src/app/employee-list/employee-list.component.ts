import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataRequest } from "../dataRequest.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployeeListContentComponent } from "../employee-list-content/employee-list-content.component";
import { Employee } from "../Employee";
import { Router } from "@angular/router";
import {LocalStorageService} from "../local-storage.service";

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeListContentComponent,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.css",
})
export class EmployeeListComponent implements OnInit {
  employeeList!: Employee[];
  filteredEmployeeList!: Employee[];

  filterOptions: string = "name";

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  constructor(private reqService: DataRequest, private router: Router, private localStorageService: LocalStorageService) {
  }
  ngOnInit(): void {
    this.filterOptions = this.localStorageService.getItem("filterOptions") || "name";
    this.getEmployees();
  }
  filterResults(text: string) {
    if (!text) {
      this.filteredEmployeeList = this.employeeList;
      this.initializePaginator();
    } else {
      let filteredList = this.employeeList.filter((employee) => {
        switch (this.filterOptions) {
          case "name":
            return (
              employee.firstName?.toLowerCase().includes(text.toLowerCase()) ||
              employee.lastName?.toLowerCase().includes(text.toLowerCase())
            );
          case "skill":
            return (
              employee.skillSet &&
              employee.skillSet.some((skillObj) =>
                skillObj.skill.toLowerCase().includes(text.toLowerCase())
              )
            );
          case "address":
            return (
              employee.street?.toLowerCase().includes(text.toLowerCase()) ||
              employee.city?.toLowerCase().includes(text.toLowerCase()) ||
              employee.postcode?.toLowerCase().includes(text.toLowerCase())
            );
          default:
            return false;
        }
      });
      this.filteredEmployeeList = filteredList;
      this.initializePaginator();
    }
  }

  private getEmployees() {
    this.reqService.getEmployees().subscribe((data: Employee[]) => {
      this.employeeList = data.sort((a: Employee, b: Employee) => a.id - b.id);
      this.filteredEmployeeList = this.employeeList;
      this.initializePaginator();
      this.updatePage();
    });
  }

  private initializePaginator() {
    this.totalPages = Math.ceil(
      this.filteredEmployeeList.length / this.itemsPerPage
    );
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredEmployeeList = this.employeeList.slice(start, end);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePage();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  createNewEmployee() {
    this.router.navigate(["/create"]);
  }

  updateSelectedIndex(event: any) {
    this.filterOptions = event.target.value;
    this.localStorageService.setItem("filterOptions", this.filterOptions);
  }
}
