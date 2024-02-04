import { Injectable } from "@angular/core";
import { Employee } from "./Employee";
import { BehaviorSubject, EMPTY, forkJoin, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Qualification } from "./Qualification";
import { catchError, defaultIfEmpty, switchMap } from "rxjs/operators";

interface EmployeeResp {
  id: number;
  lastName: string;
  firstName: string;
}
interface QualificationResp {
  skill: string;
  id: number;
}
interface SearchedEmployees {
  qualification: QualificationResp;
  employees: EmployeeResp[];
}

@Injectable({
  providedIn: "root",
})
export class DataRequest {
  searchEmployee$ = new BehaviorSubject(14);
  constructor(private http: HttpClient) {}
  getEmployees() {
    let val = this.http.get<any>("/backend/employees");
    return val;
  }
  getEmployeesById(id: number | string) {
    return this.http.get<Employee>("/backend/employees/" + id, {
      withCredentials: true,
    });
  }
  deleteEmployee(id: number | undefined) {
    return this.http.delete("/backend/employees/" + id, {
      withCredentials: true,
    });
  }
  createEmployee(employee: Employee) {
    return this.http.post("/backend/employees", employee, {
      withCredentials: true,
    });
  }
  updateEmployee(id: number | undefined, employee: Employee) {
    return this.http.put("/backend/employees/" + id, employee, {
      withCredentials: true,
    });
  }

  getQualifications() {
    return this.http.get<Qualification[]>("/backend/qualifications");
  }
  deleteQualification(id: number) {
    return this.http.delete<any>(`/backend/qualifications/${id}`).pipe(
      // use catchError to handle errors
      catchError((error) => {
        // return a fallback value or an error message
        return of({ message: "Failed to delete qualification" });
      })
    );
  }
  handleDeleteOfQualification(id: number, skillSet: string) {
    return this.findEmployeeByQualification(id).pipe(
      switchMap((data) => {
        if (data.employees) {
          // create an array of observables for deleting qualifications by employee id
          const deleteObservables = data.employees.map((emp: Employee) =>
            this.deleteQualificationById(emp.id, skillSet).pipe(
              // use defaultIfEmpty to provide a fallback value for empty observables
              defaultIfEmpty(null)
            )
          );

          return forkJoin(deleteObservables).pipe(
            // use defaultIfEmpty to provide a fallback value for empty forkJoin
            defaultIfEmpty([])
          );
        } else {
          console.log("an Error has occured with database");
          return EMPTY;
        }
      }),
      // use switchMap or mergeMap to switch or merge the inner observables
      switchMap(() => {
        return this.deleteQualification(id);
      })
    );
  }

  updateQualification(id: number, skillSet: string) {
    return this.http.put<any>(`/backend/qualifications/${id}`, {
      skill: skillSet,
    });
  }
  createQualification(skillSet: string) {
    return this.http.post<any>(`/backend/qualifications`, { skill: skillSet });
  }
  findEmployeeByQualification(id: number) {
    return this.http.get<SearchedEmployees>(
      `/backend/qualifications/${id}/employees`
    );
  }
  deleteQualificationById(id: number, skillSet: string) {
    const headers = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const body = { skill: skillSet };
    return this.http.delete(`/backend/employees/${id}/qualifications`, {
      body,
      headers,
    });
  }
}
