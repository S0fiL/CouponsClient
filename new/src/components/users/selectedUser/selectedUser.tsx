import axios from 'axios';
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { Purchase } from '../../../models/purchase';
import { UserInfo } from '../../../models/userInfo';
import { createTimestamp } from '../../../sharedFunctions/createTimestamp';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ActionModal from '../../modals/actionModal';
import ConfirmationModal from '../../modals/confirmationModal';
import "./selectedUser.css";

interface ISelectedUserState {
    user: UserInfo;
    purchases: Purchase[];
    showPurchases: boolean;
    purchasesButtonText: string;

    showUserConfirmationModal: boolean;
    showDeleteUserModal: boolean;
    showPurchaseConfirmationModal: boolean;
    showDeletePurchaseModal: boolean;
}

export default class SelectedUser extends Component<any, ISelectedUserState> {

    private deletePurchaseId: number;
    private deletePurchaseIndex: number;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: new UserInfo(),
            purchases: [],
            purchasesButtonText: "Show purchase history",

            showUserConfirmationModal: false,
            showDeleteUserModal: false,
            showPurchaseConfirmationModal: false,
            showDeletePurchaseModal: false,
            showPurchases: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        let id = this.props.match.params.id;
        try {
            const response = await axios.get<UserInfo>("http://localhost:8080/users/" + id);
            let user = response.data;
            this.setState({ user });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private deleteUser = async () => {
        this.setState({ showDeleteUserModal: false });
        try {
            await axios.delete("http://localhost:8080/users/" + this.state.user.id);
            this.setState({ showUserConfirmationModal: true });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private showPurchases = async () => {
        if (this.state.showPurchases === true) {
            this.setState({ showPurchases: false });
            this.setState({ purchasesButtonText: "Show purchase history" });
        } else {
            try {
                let id = this.props.match.params.id;
                const response = await axios.get<Purchase[]>("http://localhost:8080/purchases/byUserForAdmin?userId=" + id);
                let purchases = response.data;
                this.setState({ purchases });
                this.setState({ showPurchases: true });
                this.setState({ purchasesButtonText: "Hide purchase history" });
            }
            catch (err) {
                alert(err.response.data.message);
                console.log(err.response.data);
            }
        }
    }

    private deletePurchase = async () => {

        this.setState({ showDeletePurchaseModal: false });
        try {
            await axios.delete("http://localhost:8080/purchases/" + this.deletePurchaseId);
            let newState = { ...this.state };
            newState.purchases.splice(this.deletePurchaseIndex, 1);
            this.setState(newState);
            this.setState({ showPurchaseConfirmationModal: true });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private showDeleteUserModal = () => {
        this.setState({ showDeleteUserModal: true });
    }

    private closeDeleteUserModal = () => {
        this.setState({ showDeleteUserModal: false });
    }

    private closeUserConfirmationModal = () => {
        this.props.history.push("/users");
    }

    private showDeletePurchaseModal = (id: number, index: number) => {
        this.deletePurchaseId = id;
        this.deletePurchaseIndex = index;
        this.setState({ showDeletePurchaseModal: true });
    }

    private closeDeletePurchaseModal = () => {
        this.setState({ showDeletePurchaseModal: false });
    }

    private closePurchaseConfirmationModal = () => {
        this.setState({ showPurchaseConfirmationModal: false })
    }

    private renderTableData = () => {
        return this.state.purchases.map((purchase, index) => {
            return (
                <tr key={purchase.id} >
                    <td className="deletePurchaseButton" onClick={() => this.showDeletePurchaseModal(purchase.id, index)}>Delete</td>
                    <td>#{purchase.id}</td>
                    <td>{createTimestamp(purchase.timestamp)}</td>
                    <td>#<NavLink to={"/coupon/" + purchase.couponId} exact>{purchase.couponId}</NavLink></td>
                    <td>{purchase.amount}</td>
                </tr>
            )
        });
    }

    public render() {
        return (
            <div className="selectedUser">
                <h6>#{this.state.user.id}</h6>
                <h5>{this.state.user.userType}
                    {this.state.user.userType === "COMPANY" &&
                        <div>
                            #{this.state.user.companyId}
                        </div>
                    }
                </h5>
                <input className="deleteButton" type="button" value="Delete user" onClick={this.showDeleteUserModal} />
                <ActionModal title="Please confirm your action" body={"Are you sure you want to delete user #" + this.state.user.id} show={this.state.showDeleteUserModal} handleCancel={this.closeDeleteUserModal} handleConfirm={this.deleteUser} />
                <ConfirmationModal title=" Deleted succsessfully!" body={"Deleted user #" + this.state.user.id} show={this.state.showUserConfirmationModal} handleClose={this.closeUserConfirmationModal} />
                <h2>Email: {this.state.user.userName}</h2>
                <h3>First name: {this.state.user.firstName}</h3>
                <h3>Last name: {this.state.user.lastName}</h3>
                {this.state.user.userType === "CUSTOMER" && <input className="purchasesButton" type="button" value={this.state.purchasesButtonText} onClick={this.showPurchases} />}
                {this.state.showPurchases === true && this.state.purchases.length === 0 &&
                    <p>This user has not made any purchases</p>}
                {this.state.showPurchases === true && this.state.purchases.length !== 0 &&
                    <div className="tableDiv">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Order</th>
                                    <th>Timestamp</th>
                                    <th>Coupon ID</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderTableData()}</tbody>
                        </table>
                    </div>
                }
                <ActionModal title="Please confirm your action" body={"Are you sure you want to delete order #" + this.deletePurchaseId} show={this.state.showDeletePurchaseModal} handleCancel={this.closeDeletePurchaseModal} handleConfirm={this.deletePurchase} />
                <ConfirmationModal title=" Deleted succsessfully!" body={"Deleted order #" + this.deletePurchaseId} show={this.state.showPurchaseConfirmationModal} handleClose={this.closePurchaseConfirmationModal} />
            </div>
        );
    }
}