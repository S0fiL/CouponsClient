import axios from 'axios';
import React, { Component } from 'react'
import { Passwords } from '../../../models/passwordChange';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal from '../../modals/confirmationModal';
import "./passwordChange.css";

interface IPasswordChangeState {
    showConfirnationModal: boolean;
    isError: boolean;
}

export default class PasswordChange extends Component<any, IPasswordChangeState> {

    private newPassword: string;
    private passwordConfirm: string;
    private oldPassword: string;
    private errorMessage: string;

    public constructor(props: any) {
        super(props);

        this.passwordConfirm = "";

        this.state = {
            isError: false,
            showConfirnationModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        
    }

    private setOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.oldPassword = event.target.value;
    }

    private setNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newPassword = event.target.value;
        if (this.passwordConfirm !== "" && newPassword !== this.passwordConfirm) {
            this.errorMessage = "Password confirmation does not match the new password"
            this.setState({ isError: true });
        } else if (this.errorMessage === "Password confirmation does not match the new password") {
            this.setState({ isError: false });
        }
        this.newPassword = newPassword;
    }

    private setPasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        let passwordConfirm = event.target.value;
        if (passwordConfirm !== "" && passwordConfirm !== this.newPassword) {
            this.errorMessage = "Password confirmation does not match the new password"
            this.setState({ isError: true });
        } else if (this.errorMessage === "Password confirmation does not match the new password") {
            this.setState({ isError: false })
        }
        this.passwordConfirm = passwordConfirm;
    }

    private update = async (event: any) => {

        event.preventDefault();
        
        if (this.passwordConfirm !== this.newPassword) {
            return;
        }
        try {
            let passwords = new Passwords(this.oldPassword, this.newPassword);
            await axios.put("http://localhost:8080/users/password", passwords);
            this.setState({ showConfirnationModal: true });
        }
        catch (err) {
            if (err.response.data.num !== 600 && err.response.data.num !== 601 && err.response.data.num !== 631) {
                this.errorMessage = err.response.data.message;
                this.setState({ isError: true });
            } else {
                alert(err.response.data.message);
            }
        }
    }

    private closeConfirmationModal = () => {
        this.props.history.push('/account');
    }

    public render() {
        return (
            <div className="passwordChange">
                <form onSubmit={this.update}>
                    <input type="password" placeholder="Old password" onChange={this.setOldPassword} />
                    <br />
                    <input type="password" placeholder="New password" onChange={this.setNewPassword}></input>
                    <br />
                    <input type="password" placeholder="Confirm new password" onChange={this.setPasswordConfirm}></input>
                    {this.state.isError === true && <p>*{this.errorMessage}</p>}
                    <br/>
                    <input id="passChangeButton" type="submit" value="Confirm" />
                    <ConfirmationModal title="Updated succsessfully!" body="Your password was changed" show={this.state.showConfirnationModal} handleClose={this.closeConfirmationModal}/>
                </form>
            </div>
        );
    }
}