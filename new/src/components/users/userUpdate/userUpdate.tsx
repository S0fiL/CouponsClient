import axios from 'axios';
import React, { Component } from 'react'
import { User } from '../../../models/user';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal from '../../modals/confirmationModal';
import "./userUpdate.css";

interface IUserUpdateState {
    user: User;
    isError: boolean;

    showConfirmationModal: boolean;
}

export default class UserUpdate extends Component<any, IUserUpdateState> {

    private errorMessage: string;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: new User(),
            isError: false,

            showConfirmationModal: false
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

    private setUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
        let userName = event.target.value;
        this.setState({ user: { ...this.state.user, userName: userName } });
    }

    private setFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        let firstName = event.target.value;
        this.setState({ user: { ...this.state.user, firstName: firstName } });
    }

    private setLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        let lastName = event.target.value;
        this.setState({ user: { ...this.state.user, lastName: lastName } });
    }

    private update = async (event: any) => {
        event.preventDefault();
        try {
            await axios.put("http://localhost:8080/users", this.state.user);
            this.setState({ showConfirmationModal: true });
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

    private closeConfirmationModal = () => {
        this.props.history.push('/account');
    }

    public render() {
        return (
            <div className="userUpdate">
                <form className="userUpdate" onSubmit={this.update}>
                    <div className="userUpdateLabels">
                        <label>Email: </label><br />
                        <label>First name: </label><br />
                        <label>Last name: </label><br />
                    </div>
                    <div className="userUpdateInput">
                        <input type="text" required defaultValue={this.state.user.userName} onChange={this.setUserName} /><br />
                        <input type="text" required defaultValue={this.state.user.firstName} onChange={this.setFirstName} /><br />
                        <input type="text" required defaultValue={this.state.user.lastName} onChange={this.setLastName} /><br />
                        {this.state.isError === true && <p>*{this.errorMessage}</p>}
                        <br/>
                        <input id="updateAccountButton" type="submit" value="Update" />
                        <ConfirmationModal title="Updated succsessfully!" body="Your new account information was saved" show={this.state.showConfirmationModal} handleClose={this.closeConfirmationModal}/>
                    </div>
                </form>
            </div>
        );
    }
}