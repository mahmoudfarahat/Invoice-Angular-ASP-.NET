import { InvoiceService } from './../../services/invoice.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { setTheme } from 'ngx-bootstrap/utils';
import { invoiceNumberValidator } from 'src/app/async.valdiator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {

  employees:any = []
  customers:any = []
  productList:any = []
  value: any ='';
   productForm = new FormGroup({
    InovoiceNumber:new FormControl('', [Validators.required]),
    Date:new FormControl('', [Validators.required ]),
    CustomerName:new FormControl('', [Validators.required ]),
    EmployeeName:new FormControl('', [Validators.required ]),
    Products:new FormArray([

    ])
  })


 public get InvoiceNumber() {
     return this.productForm.get("InovoiceNumber");
  }

  ngOnInit(): void {
    this.getEmployees();
    this.getcustomers();
    this.getProducts();


    this.productForm.get("InovoiceNumber")?.addAsyncValidators(invoiceNumberValidator())


  }

 




  constructor(private fb:FormBuilder , private service :InvoiceService, private router:Router) {}


 get   products() : FormArray {

    return this.productForm.get("Products") as FormArray
  }







  addProduct() {


  (this.productForm.get("Products") as FormArray).push(new FormGroup({
    ProductName:new FormControl('', [Validators.required ]),
    Price:new FormControl('', [Validators.required ]),
    Quantity:new FormControl(1, [Validators.required ]),
    Total:new FormControl(0, [Validators.required ]),

  }));


  }

  removeProduct(i:number) {
    this.products.removeAt(i);
  }





  getEmployees()
  {
this.service.getEmployess().subscribe(response =>{
  console.log(response)
  this.employees = response
})
  }
getcustomers()
{this.service.getCustomers().subscribe(response =>{
  console.log(response)
  this.customers = response
})}
getProducts()
{
  this.service.getProducts().subscribe(response =>{
    console.log(response)
    this.productList = response
  })
}

onPriceChange(event:any,ab :AbstractControl)
{
   const price =this.productList.find((a:any) => a.Id === +event.target.value ).Price;
  (ab as FormGroup).get("Price")?.setValue(price);
}


getRowTotal(ab :AbstractControl , quantity:any , price:any)
{
  let calculatedRow = quantity * price;
   (ab as FormGroup).get("Total")?.setValue(calculatedRow)

}


onSubmit()
{
  this.service.createInvocie(this.productForm.value).subscribe(res => {
   this.router.navigate(["/"]);
  })
}
}
