import React, { Component, ChangeEvent } from 'react'
import axios from "axios";
import { LoginDetails } from '../../../models/loginDetails';
import { UserLoginData } from '../../../models/userLoginData';
import "./login.css";
import { NavLink } from 'react-router-dom';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';

interface ILoginState {
    userName: string,
    password: string,
    isError: boolean
}

export default class Login extends Component<any, ILoginState> {

    private errorMessage: string;

    public constructor(props: any) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            isError: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        
    }

    private setUserName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ isError: false });
        let userName = event.target.value;
        this.setState({ userName });
    }

    private setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        let password = event.target.value;
        this.setState({ password });
        this.setState({ isError: false });
    }

    private login = async (event: any) => {

        event.preventDefault();
        
        try {
            let loginDetails = new LoginDetails(this.state.userName, this.state.password);
            const response = await axios.post<UserLoginData>("http://localhost:8080/users/login", loginDetails);
            const serverResponse = response.data;
            axios.defaults.headers.common['Authorization'] = serverResponse.token;
            sessionStorage.setItem("userType", String(serverResponse.userType));
            sessionStorage.setItem("token", String(serverResponse.token));
            store.dispatch({ type: ActionType.LOGIN, payload: serverResponse.userType });

            if (serverResponse.userType === "ADMIN") {
                this.props.history.push('/couponsAdmin');
            }
            else if (serverResponse.userType === "COMPANY") {
                this.props.history.push('/couponsCompany');
            }
            else {
                this.props.history.push('/couponsCustomer');
            }
        }
        catch (err) {
            if (err.response.data.num > 601 && err.response.data.num < 631) {
                this.errorMessage = err.response.data.message;
                this.setState({ isError: true });
            } else {
                alert(err.response.data.message);
            }
            console.log(err.response.data);
        }
    }

    public render() {
        return (
            <div className="login">
                <form className="loginForm" onSubmit={this.login}>
                    <input type="email" required title="Please enter an email" placeholder="User name" onChange={this.setUserName} /><br />
                    <input type="password" required title="Please enter a password" placeholder="Password" name="password" onChange={this.setPassword} /><br />
                    {this.state.isError === true && <p>*{this.errorMessage}</p>}
                    <input type="submit" value="Login" />
                    <br />
                    <NavLink to="/register" exact>Registration</NavLink>
                </form>
            </div>
        );
    }
}