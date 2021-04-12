import axios from 'axios';
import React, { Component } from 'react'
import { User } from '../../../models/user';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal2 from '../../modals/confirmationModal2';
import "./newUser.css";

interface INewUserState {
    isCompany: boolean;
    isError: boolean;

    showConfirmationModal: boolean;
}

export default class NewUser extends Component<any, INewUserState> {

    private user: User;
    private id: number;
    private errorMessage: string;
    private passwordConfirm: string;

    public constructor(props: any) {
        super(props);

        this.user = new User();
        this.passwordConfirm = "";

        this.state = {
            isCompany: false,
            isError: false,

            showConfirmationModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

    }

    private setUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.user.userName = event.target.value;
    }

    private setPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        let password = event.target.value;
        if (this.passwordConfirm !== "" && password !== this.passwordConfirm) {
            this.errorMessage = "Password confirmation does not match the password"
            this.setState({ isError: true });
        } else if (this.errorMessage === "Password confirmation does not match the password") {
            this.setState({ isError: false });
        }
        this.user.password = password;
    }

    private setPasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        let passwordConfirm = event.target.value;
        if (passwordConfirm !== "" && passwordConfirm !== this.user.password) {
            this.errorMessage = "Password confirmation does not match the new password"
            this.setState({ isError: true });
        } else if (this.errorMessage === "Password confirmation does not match the new password") {
            this.setState({ isError: false })
        }
        this.passwordConfirm = passwordConfirm;
    }

    private setFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.user.firstName = event.target.value;
    }

    private setLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.user.lastName = event.target.value;
    }

    private setUserType = (event: any) => {
        let userType = event.target.value;
        this.user.userType = userType;
        if (userType === "COMPANY") {
            this.setState({ isCompany: true });
        } else {
            this.setState({ isCompany: false });
        }
    }

    private setCompanyId = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.user.companyId = +event.target.value;
    }

    private createUser = async (event: any) => {

        event.preventDefault();
        
        if (this.passwordConfirm !== this.user.password) {
            return;
        }
        try {
            const response = await axios.post<number>("http://localhost:8080/users", this.user);
            this.id = response.data;
            this.setState({ showConfirmationModal: true });
        }
        catch (err) {
            if (err.response.data.num !== 600 && err.response.data.num !== 601 && err.response.data.num !== 631) {
                this.errorMessage = err.response.data.message;
                this.setState({ isError: true });
            } else {
                alert(err.response.data.message);
            }
            console.log(err.response.data);
        }
    }

    private closeConfirmationModal = () => {
        this.props.history.push('/users');
    }

    private showUserInfo = () => {
        this.props.history.push('/user/' + this.id);
    }

    public render() {
        return (
            <div className="newUser">
                <form onSubmit={this.createUser}>
                    <h1>To create a new user please fill the following fields: </h1>
                    <input type="email" required placeholder="E-mail" onChange={this.setUserName} /><br />
                    <input type="password" required placeholder="Password" onChange={this.setPassword} /><br />
                    <input type="password" required placeholder="Confirm Password" onChange={this.setPasswordConfirm} /><br />
                    <input type="text" required placeholder="First name" onChange={this.setFirstName} /><br />
                    <input type="text" required placeholder="Last name" onChange={this.setLastName} /><br />
                    <select defaultValue={"default"} required onChange={this.setUserType}>
                        <option value="default" disabled hidden>User status</option>
                        <option value="CUSTOMER">Customer</option>
                        <option value="COMPANY">Company user</option>
                        <option value="ADMIN">Admin</option>
                    </select><br />
                    {this.state.isCompany === true &&
                        <input type="number" required placeholder="Company ID" onChange={this.setCompanyId} />
                    }
                    <br />
                    {this.state.isError === true && <p>*{this.errorMessage}</p>}
                    <input type="submit" value="Create user" />
                    <ConfirmationModal2 title="User was created successfully!" body={"Created new user #" + this.id} show={this.state.showConfirmationModal} handleClose={this.closeConfirmationModal} handleForward={this.showUserInfo} forwardButtonText="Show user info"/>
                </form>
            </div>
        );
    }
}