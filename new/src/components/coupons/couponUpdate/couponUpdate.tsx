import axios from 'axios';
import React, { Component } from 'react'
import { Coupon } from '../../../models/coupon';
import defaultImg from '../../../resources/soon.png';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal from '../../modals/confirmationModal';
import "./couponUpdate.css";

interface ICouponUpdateState {
    coupon: Coupon;
    isError: boolean;

    showConfirmationModal: boolean;
}

export default class CouponUpdate extends Component<any, ICouponUpdateState> {

    private categories: string[];
    private errorMessage: string;

    public constructor(props: any) {
        super(props);
        this.categories = ["SHOWS_AND_ENTERTEINMENT", "TECH", "SERVICES", "DROIDS_AND_ANDROIDS", "HEALTH", "WEAPONS", "CARS"];
        this.state = {
            coupon: new Coupon(null, "", "", new Date(), new Date()),
            isError: false,

            showConfirmationModal: false
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

    private setTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        let title = event.target.value;
        this.setState({ coupon: { ...this.state.coupon, title: title } });
    }

    private setPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        let price = +event.target.value;
        this.setState({ coupon: { ...this.state.coupon, price: price } });
    }

    private setDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        let description = event.target.value;
        this.setState({ coupon: { ...this.state.coupon, description: description } });
    }

    private setStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        let startDate = new Date(event.target.value);
        this.setState({ coupon: { ...this.state.coupon, startDate: startDate } });
    }

    private setEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        let endDate = new Date(event.target.value);
        this.setState({ coupon: { ...this.state.coupon, endDate: endDate } });
    }

    private setAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        let amount = +event.target.value;
        this.setState({ coupon: { ...this.state.coupon, amount: amount } });
    }

    private setCategory = (event: any) => {
        let category = event.target.value;
        this.setState({ coupon: { ...this.state.coupon, category: category } });
    }

    private setImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        let image = event.target.value;
        this.setState({ coupon: { ...this.state.coupon, image: image } });
    }

    private update = async (event: any) => {
        event.preventDefault();
        try {
            await axios.put("http://localhost:8080/coupons", this.state.coupon);
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
        this.props.history.push('/coupon/' + this.state.coupon.id);
    }

    public render() {
        return (
            <div className="couponUpdate">
                <form onSubmit={this.update}>
                    <div className="updateLabels">
                        <label>Title:</label><br />
                        <label>Price: </label><br />
                        <label>Description: </label><br />
                        <label>Start date: </label><br />
                        <label>End date: </label><br />
                        <label>Amount: </label><br />
                        <label>Category: </label><br />
                        <label>Image: </label><br />
                    </div>

                    <div className="updateFields">
                        <input type="text" defaultValue={this.state.coupon.title} onChange={this.setTitle} /><br />
                        <input type="number" step=".01" defaultValue={this.state.coupon.price} onChange={this.setPrice}></input><br />
                        <input type="text" defaultValue={this.state.coupon.description} onChange={this.setDescription}></input><br />
                        <input type="date" defaultValue={this.state.coupon.startDate.toString()} onChange={this.setStartDate}></input><br />
                        <input type="date" defaultValue={this.state.coupon.endDate.toString()} onChange={this.setEndDate}></input><br />
                        <input type="number" defaultValue={this.state.coupon.amount} onChange={this.setAmount}></input><br />
                        <select className="categories" defaultValue={this.state.coupon.category} required onChange={this.setCategory}>
                            <option value={this.state.coupon.category} hidden>{this.state.coupon.category.charAt(0) + this.state.coupon.category.slice(1).toLowerCase().replaceAll("_", " ")}</option>
                            {this.categories.map((category, index) => <option key={index} value={category}>{category.charAt(0) + category.slice(1).toLowerCase().replaceAll("_", " ")}</option>)}
                        </select>
                        <input type="text" defaultValue={this.state.coupon.image} onChange={this.setImage} /><br />
                        {this.state.coupon.image != null && <img src={this.state.coupon.image} alt="Not found" />}
                        {this.state.coupon.image == null && <img src={defaultImg} alt="default pic" />}<br />
                        {this.state.isError === true && <p>*{this.errorMessage}</p>}
                        <br/>
                        <input type="submit" value="Update"/>
                        <ConfirmationModal title=" Updated succsessfully!" body={"Updated coupon #" + this.state.coupon.id + ", your changes have been saved."} show={this.state.showConfirmationModal} handleClose={this.closeConfirmationModal} />
                    </div>
                </form>
            </div>
        );
    }
}