import axios from 'axios';
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { Purchase } from '../../../models/purchase';
import { createTimestamp } from '../../../sharedFunctions/createTimestamp';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ActionModal from '../../modals/actionModal';
import ConfirmationModal from '../../modals/confirmationModal';
import "./purchasesAdmin.css";

interface IPurchaseListAdminState {
    purchases: Purchase[];

    byIdFilter: string;

    showPurchaseConfirmationModal: boolean;
    showDeletePurchaseModal: boolean;
}

export default class PurchasesAdmin extends Component<any, IPurchaseListAdminState> {

    private deletePurchaseId: number;
    private deletePurchaseIndex: number;

    constructor(props: any) {
        super(props);
        this.state = {
            purchases: [],

            byIdFilter: "",

            showPurchaseConfirmationModal: false,
            showDeletePurchaseModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        try {
            const response = await axios.get<Purchase[]>("http://localhost:8080/purchases");
            this.setState({ purchases: response.data });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private purchaseIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let byIdFilter = event.target.value;
        this.setState({ byIdFilter });
    }

    private deletePurchase = async () => {
        this.hideDeletePurhaseModal();
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

    private showDeletePurchaseModal = (id: number, index: number) => {
        this.deletePurchaseId = id;
        this.deletePurchaseIndex = index;
        this.setState({ showDeletePurchaseModal: true });
    }

    private hideDeletePurhaseModal = () => {
        this.setState({ showDeletePurchaseModal: false });
    }

    private hidePurchaseConfirmationModal = () => {
        this.setState({ showPurchaseConfirmationModal: false })
    }

    private renderTableData = () => {
        return this.state.purchases.filter(purchase => {
            if (this.state.byIdFilter === "") {
                return true;
            }
            return (String(purchase.id).includes(this.state.byIdFilter));
        }
        ).map((purchase, index) => {
            return (
                <tr key={purchase.id} >
                    <td className="deletePurchaseButton" onClick={() => this.showDeletePurchaseModal(purchase.id, index)}>Delete</td>
                    <td>#{purchase.id}</td>
                    <td>{createTimestamp(purchase.timestamp)}</td>
                    <td><NavLink to={"/user/" + purchase.userId} exact>#{purchase.userId}</NavLink></td>
                    <td><NavLink to={"/coupon/" + purchase.couponId} exact>#{purchase.couponId}</NavLink></td>
                    <td>{purchase.amount}</td>
                </tr>
            )
        });
    }

    public render() {
        return (
            <div className="purchasesAdmin">
                <div className="filters">
                    <img src={require('../../../resources/loop50.png').default} alt="Search" />
                    <input type="number" placeholder="Order number" onChange={this.purchaseIdPipe} />
                </div>
                <div className="tableDiv">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Order</th>
                                <th>Timestamp</th>
                                <th>User ID</th>
                                <th>Coupon ID</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderTableData()}</tbody>
                    </table>
                </div>
                <ActionModal title="Please confirm your action" body={"Are you sure you want to delete order #" + this.deletePurchaseId} show={this.state.showDeletePurchaseModal} handleCancel={this.hideDeletePurhaseModal} handleConfirm={this.deletePurchase} />
                <ConfirmationModal title=" Deleted succsessfully!" body={"Deleted order #" + this.deletePurchaseId} show={this.state.showPurchaseConfirmationModal} handleClose={this.hidePurchaseConfirmationModal} />
            </div >
        );
    }
}