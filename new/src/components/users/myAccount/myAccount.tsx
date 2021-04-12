import axios from 'axios';
import React, { Component } from 'react'
import { User } from '../../../models/user';
import { UserInfo } from '../../../models/userInfo';
import { ActionType } from '../../../redux/action-type';
import { store } from '../../../redux/store';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ActionModal from '../../modals/actionModal';
import ConfirmationModal from '../../modals/confirmationModal';
import "./myAccount.css";

interface IMyAccount {
    user: UserInfo;

    showConfirmationModal: boolean;
    showDeleteModal: boolean;
}

export default class MyAccount extends Component<any, IMyAccount> {

    public constructor(props: any) {
        super(props);
        this.state = {
            user: new UserInfo(),

            showConfirmationModal: false,
            showDeleteModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        try {
            const response = await axios.get<User>("http://localhost:8080/users/myAccount");
            let user = response.data;
            this.setState({ user });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private updateUser = () => {
        this.props.history.push('/updateUser');
    }

    private changePass = () => {
        this.props.history.push('/passChange');
    }

    private deleteAccount = async () => {

        this.hideDeletetModal();
        try {
            await axios.delete("http://localhost:8080/users");
            this.setState({ showConfirmationModal: true });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    }

    private hideDeletetModal = () => {
        this.setState({ showDeleteModal: false });
    }

    private closeConfirmationModal = () => {
        store.dispatch({ type: ActionType.LOGOUT });
        this.props.history.push("/home");
    }

    public render() {
        return (
            <div className="myAccount">
                <h4 className="userId">ID: #{this.state.user.id}</h4>
                <input className="deleteAccountButton" type="button" value="Delete account" onClick={this.showDeleteModal} />
                <ActionModal title="Attention!" body=" You are trying to delete your account, this action is ireversible and all your data will be lost. please confirm your action."
                    show={this.state.showDeleteModal} handleCancel={this.hideDeletetModal} handleConfirm={this.deleteAccount} />
                <ConfirmationModal title="Account deleted" body={"User #" + this.state.user.id + " was deleted, you can no longer accsess our site from this account"} show={this.state.showConfirmationModal} handleClose={this.closeConfirmationModal} />
                <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
                <h2>{this.state.user.userName}</h2>
                {store.getState().userType === "COMPANY" &&
                    <h3>Your company ID: #{this.state.user.companyId}</h3>
                }
                <input className="editAccount" type="button" value="Edit info" onClick={this.updateUser} />
                <input className="editPassword" type="button" value="Change password" onClick={this.changePass} />
            </div>
        );
    }
}