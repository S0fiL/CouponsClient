import axios from 'axios';
import React, { Component } from 'react'
import { Coupon } from '../../../models/coupon';
import defaultImg from '../../../resources/soon.png';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal2 from '../../modals/confirmationModal2';
import "./newCoupon.css";

interface INewCouponState {
    image: string;
    isError: boolean;

    showConfirmationModal: boolean;
}

export default class NewCoupon extends Component<any, INewCouponState> {

    private errorMessage: string;

    private coupon: Coupon;
    private id: number;
    private categories: string[];
    
    public constructor(props: any) {
        super(props);

        this.coupon = new Coupon();
        this.id = null;
        this.categories = ["SHOWS_AND_ENTERTEINMENT", "TECH", "SERVICES", "DROIDS_AND_ANDROIDS", "HEALTH", "WEAPONS", "CARS"];

        this.state = {
            image: "",
            isError: false,

            showConfirmationModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        
    }

    private setTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.coupon.title = event.target.value;
    }

    private setPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.coupon.price = +event.target.value;
    }

    private setDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.coupon.description = event.target.value;
    }

    private setStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.coupon.startDate = new Date(event.target.value);
    }

    private setEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.coupon.endDate = new Date(event.target.value);
    }

    private setAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.coupon.amount = +event.target.value;
    }

    private setCategory = (event: any) => {
        this.coupon.category = event.target.value;
    }

    private setImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        let image = event.target.value;
        this.coupon.image = image;
        this.setState({ image });
    }

    private createCoupon = async (event: any) => {

        event.preventDefault();
        
        try {
            const response = await axios.post<number>("http://localhost:8080/coupons", this.coupon);
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
    
    private showCouponInfo = () => {
        this.props.history.push('/coupon/' + this.id);
    }

    private hideConfirmationModal = () => {
        this.props.history.push('/couponsCompany');
    }

    public render() {
        return (
            <div className="newCoupon">
                <form onSubmit={this.createCoupon}>
                    <h1>To create a new coupon please fill the following fields: </h1>
                    <h4>fields marked by * are required</h4>
                    <h2>*<input type="text" required placeholder="Coupon title" onChange={this.setTitle} /></h2>
                    <input type="text" placeholder="Upload an image" onChange={this.setImage} />
                    <br/><br/>
                    {this.coupon.image == null && <img src={defaultImg} alt="Default pic" />}
                    {this.coupon.image != null && <img src={this.state.image} alt="Not found" />}
                    <br/><br/>
                    <h2>*<input type="number" step=".01" required placeholder='Price in dollars' onChange={this.setPrice}></input></h2>
                    <input type="text" placeholder="Description" onChange={this.setDescription}></input>
                    <h2>*<input type="number" required placeholder="Amount in stock" onChange={this.setAmount}></input> </h2>

                    *<select className="categories" defaultValue={"default"} required onChange={this.setCategory}>
                        <option value="default" disabled hidden>Category</option>
                        {this.categories.map((category, index) => <option key={index} value={category}>{category.charAt(0) + category.slice(1).toLocaleLowerCase().replaceAll("_", " ")}</option>)}
                    </select>
                    <br/>
                    <br/>
                    <h3>The coupon is valid</h3>
                    <p>* From: <input className="dates" type="date" required onChange={this.setStartDate} /></p> <p>* Until: <input className="dates" type="date" required onChange={this.setEndDate} /></p>
                    {this.state.isError === true && <p>*{this.errorMessage}</p>}
                    <br/>
                    <input type="submit" value="Create coupon" />
                    <ConfirmationModal2 show={this.state.showConfirmationModal} title="Created succsessfully!" body={"Coupon #" + this.id + " was added to your companie's coupons list"} handleClose={this.hideConfirmationModal} handleForward={this.showCouponInfo} forwardButtonText="Show coupon info" />
                </form>
            </div>
        );
    }
}