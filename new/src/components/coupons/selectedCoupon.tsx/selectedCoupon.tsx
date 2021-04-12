import axios from 'axios';
import React, { Component } from 'react'
import { Coupon } from '../../../models/coupon';
import { Purchase } from '../../../models/purchase';
import { store } from '../../../redux/store';
import defaultImg from '../../../resources/soon.png';
import "./selectedCoupon.css";
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import { createDate } from '../../../sharedFunctions/createDate';
import PurchaseModal from '../../modals/purchaseModal';
import PurchaseConfirmationModal from '../../modals/purchaseConfirmationModal';

interface ISelectedCouponState {
    coupon: Coupon;

    showPurchaseModal: boolean;
    showConfirmation: boolean;
}

export default class SelectedCoupon extends Component<any, ISelectedCouponState> {

    private purchaseAmount: number;
    private total: number;
    private purchaseId: number;

    public constructor(props: any) {
        super(props);
        this.state = {
            coupon: new Coupon(null, "", ""),

            showPurchaseModal: false,
            showConfirmation: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        let id = this.props.match.params.id;

        try {
            const response = await axios.get<Coupon>("http://localhost:8080/coupons/" + id);
            let coupon = response.data;
            this.setState({ coupon });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }


    private setPurchaseAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.purchaseAmount = +event.target.value;
        this.total = this.state.coupon.price * this.purchaseAmount;
    }

    private createPurchase = async (event: any) => {

        event.preventDefault();
        try {
            this.hidePurchaseModal();
            let purchase = new Purchase(this.purchaseAmount, this.state.coupon.id);
            const response = await axios.post<number>("http://localhost:8080/purchases", purchase);
            this.purchaseId = response.data;
            this.setState({ showConfirmation: true });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private updateCoupon = () => {
        let id = this.state.coupon.id;
        this.props.history.push('/couponUpdate/' + id);
    }

    private returnToStore = () => {
        this.props.history.push('/couponsCustomer');
    }

    private showPurchaseModal = (event: any) => {
        event.preventDefault();
        this.setState({ showPurchaseModal: true });
    }

    private hidePurchaseModal = () => {
        this.setState({ showPurchaseModal: false });
    }

    private closeConfirmationModal = async () => {

        this.setState({ showConfirmation: false });
        try {
            const response2 = await axios.get<Coupon>("http://localhost:8080/coupons/" + this.state.coupon.id);
            let coupon = response2.data;
            this.setState({ coupon });
        } catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    public render() {
        return (
            <div className="selectedCoupon">
                <div className="selectedCouponInfo">
                    <h6>#{this.state.coupon.id}</h6>
                    <h1>{this.state.coupon.title}</h1>
                    <h2 className="price">For: {this.state.coupon.price} $</h2>
                    <h3 className="dates">Available for use :<br /><span>from {createDate(this.state.coupon.startDate)}</span><br /><span>until {createDate(this.state.coupon.endDate)}</span></h3>
                    {this.state.coupon.image != null && <img src={this.state.coupon.image} alt="coupon pic" />}
                    {this.state.coupon.image == null && <img src={defaultImg} alt="deafult pic" />}
                    {store.getState().userType === "CUSTOMER" && this.state.coupon.amount > 0 &&

                        <div className="forPurchase">
                            <form onSubmit={this.showPurchaseModal}>
                                <input type="number" required placeholder="Amount" min="1" max={this.state.coupon.amount} onChange={this.setPurchaseAmount} />
                                <input type="submit" value="buy" />
                                <PurchaseModal show={this.state.showPurchaseModal} coupon={this.state.coupon} amount={this.purchaseAmount} total={this.total} handleCancel={this.hidePurchaseModal} handleConfirm={this.createPurchase} />
                                <PurchaseConfirmationModal show={this.state.showConfirmation} coupon={this.state.coupon} amount={this.purchaseAmount} total={this.total} purchaseId={this.purchaseId} handleClose={this.closeConfirmationModal} handleReturn={this.returnToStore} />
                            </form>
                        </div>
                    }
                    {store.getState().userType === "CUSTOMER" && this.state.coupon.amount === 0 &&

                        <div className="forPurchase">
                            <input type="number" id="inactive" disabled />
                            <input id="inactive" type="submit" value="buy" />
                        </div>
                    }
                    {store.getState().userType === "COMPANY" && <input className="editButton" type="button" value="Edit info" onClick={this.updateCoupon} />}
                    {this.state.coupon.amount !== 0 && this.state.coupon.amount <= 10 && <h2 className="amount">ONLY {this.state.coupon.amount} LEFT IN STOCK!</h2>}
                    {this.state.coupon.amount > 10 && <h3 className="amount">{this.state.coupon.amount} more available in stock</h3>}
                    {this.state.coupon.amount === 0 && <h2 className="amount" id="soldOut" >SOLD OUT</h2>}
                    <h3 className="description">{this.state.coupon.description}</h3>
                    <h5>category: {this.state.coupon.category.charAt(0) + this.state.coupon.category.slice(1).toLowerCase().replaceAll("_", " ")}</h5>
                    <h4>Seller: {this.state.coupon.companyName}  #{this.state.coupon.companyId}</h4>
                </div>
            </div >
        );
    }
}