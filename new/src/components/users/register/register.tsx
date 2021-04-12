import React, { ChangeEvent, Component } from 'react'
import axios from 'axios';
import { User } from '../../../models/user';
import "./register.css";
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal from '../../modals/confirmationModal';

interface IRegisterState {
    isError: boolean;

    showConfirmationModal: boolean
}

export default class Register extends Component<any, IRegisterState>{

    private user: User;
    private userId: number;
    private passwordConfirm: string;
    private errorMessage: string;

    public constructor(props: any) {
        super(props);

        this.user = new User();
        this.passwordConfirm = "";

        this.state = {
            isError: false,

            showConfirmationModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

    }

    private setUserName = (event: ChangeEvent<HTMLInputElement>) => {
        this.user.userName = event.target.value;
    }

    private setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        let password = event.target.value;
        if (this.passwordConfirm !== "" && password !== this.passwordConfirm) {
            this.errorMessage = "Password confirmation does not match the password"
            this.setState({ isError: true });
        } else if (this.errorMessage === "Password confirmation does not match the password") {
            this.setState({ isError: false });
        }
        this.user.password = password;
    }

    private setPasswordConfirm = (event: ChangeEvent<HTMLInputElement>) => {
        let passwordConfirm = event.target.value;
        if (passwordConfirm !== "" && passwordConfirm !== this.user.password) {
            this.errorMessage = "Password confirmation does not match the password"
            this.setState({ isError: true });
        } else if (this.errorMessage === "Password confirmation does not match the password") {
            this.setState({ isError: false })
        }
        this.passwordConfirm = passwordConfirm;
    }

    private setFirstName = (event: ChangeEvent<HTMLInputElement>) => {
        this.user.firstName = event.target.value;
    }

    private setLastName = (event: ChangeEvent<HTMLInputElement>) => {
        this.user.lastName = event.target.value;
    }

    private register = async (event: any) => {

        event.preventDefault();

        if (this.passwordConfirm !== this.user.password) {
            return;
        }
        this.user.userType = "CUSTOMER";
        try {
            const serverResponse = await axios.post<number>("http://localhost:8080/users", this.user);
            this.userId = serverResponse.data;
            this.setState({ showConfirmationModal: true });
        }
        catch (err) {
            if (err.response.data.num > 601 && err.response.data.num < 631) {
                this.errorMessage = err.response.data.message;
                this.setState({ isError: true });
            } else {
                alert(err.response.data.message);
            }
        }
    }

    private closeConfirmationModal = () => {
        this.props.history.push("/home");
    }

    public render() {
        return (
            <div className="register">
                <form onSubmit={this.register}>
                    <h1>Welcome to our site!!!</h1>
                    <h2>to create your own new account please enter your details:</h2>
                    <input type="email" required pattern="^[a-zA-Z0-9_.-]+@[a-zA-Z-]+\.[a-zA-Z]+[a-zA-Z]+$" title="Please enter a valid email" placeholder="Email" name="username" onChange={this.setUserName} /><br />
                    <input type="password" required pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$" title="Password has to contain 8-18 characters, at least one letter, one number and no special characters" placeholder="Password" name="password" onChange={this.setPassword} /><br />
                    <input type="password" required pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$" title="Password has to contain 8-18 characters, at least one letter, one number and no special characters" placeholder="Confirm Password" onChange={this.setPasswordConfirm} /><br />
                    <input type="text" required pattern="[A-Za-z-']{2,45}$" title="Please enter a valid name" placeholder="First Name" name="firstName" onChange={this.setFirstName} /><br />
                    <input type="text" required pattern="[A-Za-z-']{2,45}$" title="Please enter a valid name" placeholder="Last Name" name="lastName" onChange={this.setLastName} /><br />
                    {this.state.isError === true && <p>*{this.errorMessage}</p>}
                    <input id="registerButton" type="submit" value="Submit" />
                </form>
                <ConfirmationModal title="Wellcome!" body={"Your account, #" + this.userId + ", was created successfully"} show={this.state.showConfirmationModal} handleClose={this.closeConfirmationModal} />
            </div>
        );
    }
}