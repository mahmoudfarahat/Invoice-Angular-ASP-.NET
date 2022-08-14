import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",component:MainLayoutComponent , loadChildren:()=>
    import("../app/invoice/invoice.module").then(m=>m.InvoiceModule)
  }
   

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
