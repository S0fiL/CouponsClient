import React, { Component } from 'react'
import "./layout.css";
import Header from "../header/header";
import Menu from '../menu/menu';
import Login from '../users/login/login';
import Footer from '../footer/footer';
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import CouponsAdmin from '../coupons/couponsAdmin/couponsAdmin';
import CouponsCustomer from '../coupons/couponsCustomer/couponsCustomer';
import CouponsCompany from '../coupons/couponsCompany/couponsCompany';
import Register from '../users/register/register';
import About from '../about/about';
import SelectedCoupon from '../coupons/selectedCoupon.tsx/selectedCoupon';
import CouponUpdate from '../coupons/couponUpdate/couponUpdate';
import NewCoupon from '../coupons/newCoupon/newCoupon';
import MyAccount from '../users/myAccount/myAccount';
import UserUpdate from '../users/userUpdate/userUpdate';
import PasswordChange from '../users/passwordChange/passwordChange';
import UserList from '../users/userList/userList';
import SelectedUser from '../users/selectedUser/selectedUser';
import NewUser from '../users/newUser/newUser';
import PurchasesAdmin from '../purchases/purchasesAdmin/purchasesAdmin';
import PurchasesCustomer from '../purchases/purchasesCustomer/purchasesCustomer';
import PurchasesCompany from '../purchases/purchasesCompany/purchasesCompany';
import CompaniesList from '../companies/companiesList/companiesList';
import NewCompany from '../companies/newCompany/newCompany';
import SelectedCompany from '../companies/selectedCompany/selectedCompany';
import UpdateCompany from '../companies/updateCompany/updateCompany';
import Header2 from '../header/header2';

interface ILayoutState {
  tokenChecked: boolean;
}

export default class Layout extends Component<any, ILayoutState>{

  public render() {
    return (
      <BrowserRouter>
        <section className="layout">

          <header>
            <Header />
            <Header2 />
          </header>
          <main>
            <aside className="left">
              <Menu />
            </aside>
            <aside className="right">
              <Switch>
                <Route path="/home" component={Login} exact />
                <Redirect from="/" to="/home" exact />
                <Route path="/register" component={Register} exact />
                <Route path="/about" component={About} exact />
                <Route path="/couponsAdmin" component={CouponsAdmin} exact />
                <Route path="/couponsCustomer" component={CouponsCustomer} exact />
                <Route path="/couponsCompany" component={CouponsCompany} exact />
                <Route path="/coupon/:id" component={SelectedCoupon} exact />
                <Route path="/couponUpdate/:id" component={CouponUpdate} exact />
                <Route path="/newCoupon" component={NewCoupon} exact />
                <Route path="/account" component={MyAccount} exact />
                <Route path="/updateUser" component={UserUpdate} exact />
                <Route path="/passChange" component={PasswordChange} exact />
                <Route path="/users" component={UserList} exact />
                <Route path="/user/:id" component={SelectedUser} exact />
                <Route path="/newUser" component={NewUser} exact />
                <Route path="/purchasesAdmin" component={PurchasesAdmin} exact />
                <Route path="/purchasesCompany" component={PurchasesCompany} exact />
                <Route path="/purchasesCustomer" component={PurchasesCustomer} exact />
                <Route path="/companies" component={CompaniesList} exact />
                <Route path="/newCompany" component={NewCompany} exact />
                <Route path="/company/:id" component={SelectedCompany} exact />
                <Route path="/companyUpdate/:id" component={UpdateCompany} exact />
                {/* <Route component={PageNotFound} /> */}
              </Switch>
            </aside>
          </main>
          <footer>
            <Footer />
          </footer>
        </section >
      </BrowserRouter>
    );
  }
}