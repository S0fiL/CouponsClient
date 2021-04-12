import React, { Component } from 'react'
import { Unsubscribe } from 'redux';
import "./menu.css";
import { NavLink } from 'react-router-dom';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import axios from 'axios';
import { tokenVerifycation } from '../../sharedFunctions/loginVerification';

interface IMenuState {
    isLoggedIn: boolean;
    userType: string;
}

export default class Menu extends Component<any, IMenuState>{

    private unsubscribe: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userType: ""
        };
    }

    public componentDidMount() {

        tokenVerifycation();

        this.unsubscribe = store.subscribe(() => {
            this.setState(
                {
                    isLoggedIn: store.getState().isLoggedIn,
                    userType: store.getState().userType
                }
            );
        }
        )
    }

    public componentWillUnmount() {
    this.unsubscribe();
    }

    private logout = async () => {
    store.dispatch({ type: ActionType.LOGOUT });
    try {
        await axios.delete("http://localhost:8080/users/logOut");
    }
    catch (err) {
        alert(err.message);
        console.log(err);
    }
}

    public render() {
    return (
        <div className="menu">
            <div className="links">
                {this.state.isLoggedIn === false && <NavLink to="/home" className="pink" exact>Home</NavLink>}
                {this.state.isLoggedIn === true && <NavLink to="/account" className="pink" exact>My Account</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/couponsAdmin" className="cyan" exact>Coupons</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "COMPANY" && <NavLink to="/couponsCompany" className="cyan" exact>Coupons</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "CUSTOMER" && <NavLink to="/couponsCustomer" className="cyan" exact>Coupons</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/users" className="cyan" exact>Users</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/companies" className="cyan" exact>Companies</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/purchasesAdmin" className="cyan" exact>Purchases</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "COMPANY" && <NavLink to="/purchasesCompany" className="cyan" exact>Sales</NavLink>}
                {this.state.isLoggedIn === true && this.state.userType === "CUSTOMER" && <NavLink to="/purchasesCustomer" className="cyan" exact>Purchases</NavLink>}
                <NavLink to="/about" className="purple" exact>About</NavLink>
                {this.state.isLoggedIn === true && <NavLink to="/home" className="pink" exact onClick={this.logout}>Log out</NavLink>}
            </div>
        </div>
    );
}
}