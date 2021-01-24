import {Component, OnInit} from '@angular/core';
import {IpServiceService} from '../../ip-service.service';
import {CartItem} from '../../model/CartItem';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppModule} from '../../app.module';
import {OrderDetail} from '../../model/OrderDetail';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];

  constructor(private ip: IpServiceService, private http: HttpClient) {
  }

  ngOnInit() {
    if (this.ip.userId != undefined) {
      const headers = new HttpHeaders(({Authorization: 'Basic ' + btoa('user' + ':' + 'password')}));

      this.http.get<any>(`${AppModule.resourceBaseURL}` + 'cartItem/getCartItemListByUserId/' + this.ip.userId, {
        observe: 'response',
        headers
      }).subscribe(response => {
        this.cartItems = response.body;
        this.ip.setCartItems(this.cartItems);
      }, error => {
        console.log(error);
        alert('error a');
      });
    }
    else {
      const headers = new HttpHeaders(({Authorization: 'Basic ' + btoa('user' + ':' + 'password')}));

      this.http.get<any>(`${AppModule.resourceBaseURL}` + 'cartItem/getCartItemListByIp/' + this.ip.ipAddress, {
        observe: 'response',
        headers
      }).subscribe(response => {
        this.cartItems = response.body;
        this.ip.setCartItems(this.cartItems);

      }, error => {
        console.log(error);

        alert('error b');
      });
    }
    this.ip.getUserById(this.ip.userId);
  }

  placeOrder() {

    let orderDetail = new OrderDetail();
    orderDetail.user = this.ip.userDetails;

    orderDetail.cartItems = this.ip.cartItems;
    orderDetail.purchaseDate = new Date();
    console.log('#################################################');
    console.log(orderDetail);
    console.log('#################################################');


    const headers = new HttpHeaders(({Authorization: 'Basic ' + btoa('user' + ':' + 'password')}));
    this.http.post<any>(`${AppModule.resourceBaseURL}` + 'orderDetails/addOrderDetails', orderDetail, {
      observe: 'response',
      headers
    }).subscribe(response => {
      this.ip.setOrderId(response.body);
      this.ip.setCartItems(this.cartItems);

    }, error => {
      console.log(error);

      alert('error 2');
    });

  }
}
