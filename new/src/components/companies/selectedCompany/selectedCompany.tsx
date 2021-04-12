import React, { Component } from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Company } from '../../../models/company';
import { Purchase } from '../../../models/purchase';
import { createTimestamp } from '../../../sharedFunctions/createTimestamp';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ActionModal from '../../modals/actionModal';
import ConfirmationModal from '../../modals/confirmationModal';
import "./selectedCompany.css";

interface ISelectedCompanyState {
    company: Company;
    purchases: Purchase[];
    showPurchases: boolean;
    purchasesButtonText: string;

    showCompanyConfirmationModal: boolean;
    showDeleteCompanyModal: boolean;
    showPurchaseConfirmationModal: boolean;
    showDeletePurchaseModal: boolean;
}

export default class SelectedCompany extends Component<any, ISelectedCompanyState> {

    private deletePurchaseId: number;
    private deletePurchaseIndex: number;

    public constructor(props: any) {
        super(props);

        this.state = {
            company: new Company(),
            purchases: [],
            showPurchases: false,
            purchasesButtonText: "Show company sales",

            showCompanyConfirmationModal: false,
            showDeleteCompanyModal: false,
            showPurchaseConfirmationModal: false,
            showDeletePurchaseModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        let id = this.props.match.params.id;
        try {
            const response = await axios.get<Company>("http://localhost:8080/companies/" + id);
            let company = response.data;
            this.setState({ company });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private updateCompany = () => {
        let id = this.props.match.params.id;
        this.props.history.push("/companyUpdate/" + id);
    }

    private deleteCompany = async () => {
        try {
            this.hideDeleteCompanyModal();
            await axios.delete("http://localhost:8080/companies/" + this.state.company.id);
            this.setState({ showCompanyConfirmationModal: true });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private showPurchases = async () => {
        if (this.state.showPurchases === true) {
            this.setState({ showPurchases: false });
            this.setState({ purchasesButtonText: "Show company sales" });
        } else {
            let id = this.props.match.params.id;
            try {
                const response = await axios.get<Purchase[]>("http://localhost:8080/purchases/byCompanyForAdmin?companyId=" + id);
                let purchases = response.data;
                this.setState({ purchases });
                this.setState({ showPurchases: true });
                this.setState({ purchasesButtonText: "Hide company sales" });
            }
            catch (err) {
                alert(err.response.data.message);
                console.log(err.response.data);
            }
        }
    }

    private deletePurchase = async () => {
        try {
            this.hideDeletePurhaseModal();
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

    private showDeleteCompanyModal = () => {
        this.setState({ showDeleteCompanyModal: true });
    }

    private hideDeleteCompanyModal = () => {
        this.setState({ showDeleteCompanyModal: false });
    }

    private closeCompanyConfirmationModal = () => {
        this.props.history.push("/companies");
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
        return this.state.purchases.map((purchase, index) => {
            return (
                <tr key={purchase.id} >
                    <td className="deletePurchaseButton" onClick={() => this.showDeletePurchaseModal(purchase.id, index)}>Delete</td>
                    <td>#{purchase.id}</td>
                    <td>{createTimestamp(purchase.timestamp)}</td>
                    <td>#<NavLink to={"/coupon/" + purchase.couponId} exact>{purchase.couponId}</NavLink></td>
                    <td>{purchase.amount}</td>
                    <td>#<NavLink to={"/user/" + purchase.userId} exact>{purchase.userId}</NavLink></td>
                </tr>
            )
        });
    }

    public render() {
        return (
            <div className="selectedCompany">
                <h6>#{this.state.company.id}</h6>
                <input className="editCompany" type="button" value="Edit info" onClick={this.updateCompany} />
                <input className="deleteCompanyButton" type="button" value="Delete company" onClick={this.showDeleteCompanyModal} />
                <ActionModal title="Please confirm your action" body={  "Are you sure you want to delete company #" + this.state.company.id} show={this.state.showDeleteCompanyModal} handleCancel={this.hideDeleteCompanyModal} handleConfirm={this.deleteCompany}/>
                <ConfirmationModal title="Deleted Successfuly!" body={ "Deleted company #" + this.state.company.id} show={this.state.showCompanyConfirmationModal} handleClose={this.closeCompanyConfirmationModal} />
                <h2>Company name: {this.state.company.name}</h2>
                <h2 className="mail">Email: {this.state.company.email}</h2>
                <h3>Phone number: {this.state.company.phone}</h3>
                <h3>Address: {this.state.company.address}</h3>
                <input className="purchasesButton" type="button" value={this.state.purchasesButtonText} onClick={this.showPurchases} />
                {this.state.showPurchases === true && this.state.purchases.length === 0 &&
                    <p>No coupons were purchased from this company</p>
                }

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
                                    <th>User ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                }
                <ActionModal title="Please confirm your action" body={ "Are you sure you want to delete order #" + this.deletePurchaseId} show={this.state.showDeletePurchaseModal} handleCancel={this.hideDeletePurhaseModal} handleConfirm={this.deletePurchase}/>
                <ConfirmationModal title="Deleted Successfuly!" body={"Deleted order #" + this.deletePurchaseId} show={this.state.showPurchaseConfirmationModal} handleClose={this.hidePurchaseConfirmationModal} />
            </div>
        );
    }
}