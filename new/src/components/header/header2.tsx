import axios from 'axios';
import React, { Component } from 'react'
import { Unsubscribe } from 'redux';
import { NavLink } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { tokenVerifycation } from '../../sharedFunctions/loginVerification';
import "./header2.css";

interface IHeaderState {
    isLoggedIn: boolean;
    userType: string;
}

export default class Header2 extends Component<any, IHeaderState> {

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

    private home = () => {
        this.props.history.push("/home");
    }

    private about = () => {
        this.props.history.push("/about");
    }

    public render() {
        return (
            <div className="header2">
                {this.state.isLoggedIn === false && <NavLink to="/Home" exact><input className="pink" type="button" value="Home" /></NavLink>}
                {this.state.isLoggedIn === true && <input className="pink" id="profileButton" type="button" value="Profile" />}
                {this.state.isLoggedIn === true && <input className="cyan" id="menuButton" type="button" value="Menu" />}
                <NavLink to="/about" exact><input className="purple" type="button" value="About" /></NavLink>
                <div className="profile">
                    {this.state.isLoggedIn === true && <NavLink to="/account" className="pinkText" exact>My Account</NavLink>}
                    {this.state.isLoggedIn === true && <NavLink to="/home" className="pinkText" exact onClick={this.logout}>Log out</NavLink>}
                </div>
                <div className="headerMenu">
                    {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/couponsAdmin" className="cyanText" exact>Coupons</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "COMPANY" && <NavLink to="/couponsCompany" className="cyanText" exact>Coupons</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "CUSTOMER" && <NavLink to="/couponsCustomer" className="cyanText" exact>Coupons</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/users" className="cyanText" exact>Users</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/companies" className="cyanText" exact>Companies</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "ADMIN" && <NavLink to="/purchasesAdmin" className="cyanText" exact>Purchases</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "COMPANY" && <NavLink to="/purchasesCompany" className="cyanText" exact>Companie's sales</NavLink>}
                    {this.state.isLoggedIn === true && this.state.userType === "CUSTOMER" && <NavLink to="/purchasesCustomer" className="cyanText" exact>My purchases</NavLink>}
                </div>
            </div>
        );
    }
}