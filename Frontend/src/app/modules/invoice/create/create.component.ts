
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms'

import { invoiceNumberValidator } from 'src/app/validators/async.valdiator';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import * as pdfMake from "pdfMake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {
x:any ;
docDefinition:any;
  employees:any = []
  customers:any = []
  productList:any = []
  employelist :[] =[]
  customerlist :[] = []
  productlist: []= []
  selectedCar: any = null;
  selectedCustomer: any =null
  selectedEmployee:any = null
  subTotal:any
  value: any ='';
   productForm = new FormGroup({
    InvoiceNumber:new FormControl('', [Validators.required]),
    Date:new FormControl('', [Validators.required ]),
    CustomerName:new FormControl('', [Validators.required ]),
    EmployeeName:new FormControl('', [Validators.required ]),
    Products:new FormArray([],[Validators.required ])
  })
  imageForm = new FormGroup({
    myName:new FormControl('',)
  })

 public get InvoiceNumber() {
     return this.productForm.get("InvoiceNumber");
  }

  ngOnInit(): void {
    this.getEmployees();
    this.getcustomers();
    this.getProducts();


    this.productForm.get("InvoiceNumber")?.addAsyncValidators(invoiceNumberValidator())



  }
// imageSrc :any
//   onSubmit2()
//   {

//     this.service.getimage(this.imageForm.value?.myName).subscribe(res => {

//       this.imageSrc = res

//     })
//   }




  constructor(public datepipe: DatePipe,private fb:FormBuilder , private service :InvoiceService, private router:Router) {}


 get   products() : FormArray {

    return this.productForm.get("Products") as FormArray
  }







  addProduct() {


  (this.productForm.get("Products") as FormArray).push(new FormGroup({
    ProductName:new FormControl('', [Validators.required ]),
    Price:new FormControl('', [Validators.required ]),
    Quantity:new FormControl(1, [Validators.required ]),
    Total:new FormControl(0, [Validators.required ]),
    Tax:new FormControl(0),
    Discount:new FormControl(0)
  }));


  }

  removeProduct(i:number) {
    this.products.removeAt(i);

    console.log(this.productForm.get("Products")?.value.length)
  }





  getEmployees()
  {
this.service.getEmployess().subscribe(response =>{
  // console.log(response)
  this.employees = response


  this.employelist = this.employees.map((a:any) =>  {
    return {
      id : a.Id,
      name : a.Name
    }
  } )
})
  }
getcustomers()
{this.service.getCustomers().subscribe(response =>{
  this.customers = response
  this.customerlist = this.customers.map((a:any) =>  {
    return {
      id : a.Id,
      name : a.Name
    }
  } )

  console.log(this.customerlist)
})}
getProducts()
{
  this.service.getProducts().subscribe(response =>{
    // console.log(response)
    this.productList = response
    this.productlist = this.productList.map((a:any) =>  {
      return {
        id : a.Id,
        name : a.Name
      }
    } )
  })
}

onPriceChange(event:any,ab :AbstractControl)
{

   const price =this.productList.find((a:any) => a.id === +event.id ).price;
  (ab as FormGroup).get("Price")?.setValue(price);



}


getRowTotal(ab :AbstractControl , quantity:any , price:any)
{
  let calculatedRow = quantity * price;
   (ab as FormGroup).get("Total")?.setValue(calculatedRow)

   this.subTotalSum()

}


onSubmit()
{
  this.service.createInvocie(this.productForm.value).subscribe(res => {
   this.router.navigate(["/"]);
  })
}


generatePDF() {

    let InvoiceNum:any =this.productForm.get("InvoiceNumber")?.value
    let customer:any =this.productForm.get("CustomerName")?.value
    let employee:any =this.productForm.get("EmployeeName")?.value
    let getdate:any =this.productForm.get("Date")?.value
    let date = this.datepipe.transform(getdate, 'yyyy-MM-dd')


    this.docDefinition = {

    content: [


      { text:  `Invoice Number: ${InvoiceNum}` , fontSize: 15 },
      { text:  ` ` , fontSize: 15 },
      { text:  `Customer Name: ${this.customers.find((d:any)=> d.Id == customer).Name}` , fontSize: 15 },
      { text:  ` ` , fontSize: 15 },
      { text:  `Employee Name: ${this.employees.find((d:any)=> d.Id == employee).Name}` , fontSize: 15 },
      { text:  ` ` , fontSize: 15 },
      { text:  `Date: ${date}` , fontSize: 15 },
      { text:  ` ` , fontSize: 15 },
      {

        layout: 'lightHorizontalLines', // optional

        table: {

          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ '*', '*', '*', '*' ],

          body: [
            [ 'Product', 'Price', 'Quantity', 'Total' ],

            ...(this.products.value as any[]).map(a=> [this.productList.find((d:any)=> d.Id == a.ProductName).Name , a.Price, a.Quantity, a.Total])

          ]
        }
      }
    ]
  };


}


getrowTotal(g: FormArray)
{
  console.log(g)
}


openPdf()
{
  this.generatePDF()
  pdfMake.createPdf(this.docDefinition).open();

}
printPdf()
{
  this.generatePDF()

  pdfMake.createPdf(this.docDefinition).print();
}



cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];


subTotalSum() {
  let total = 0;

  this.products.value.map((product: any) => {
    total += parseFloat(product.Price);
  });

  console.log(total,4444444);
}


// subTotalSum(){


//   let total
//   console.log(this.products.value.map((a:any) =>{
//     total  = a.Price
//     total = +a.Price


//   }

//   ))

//   console.log(total,222222)
// }


}
