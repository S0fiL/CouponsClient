import axios from 'axios';
import React, { Component } from 'react';
import { CouponInfo } from '../../../models/couponInfo';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ActionModal from '../../modals/actionModal';
import ConfirmationModal from '../../modals/confirmationModal';
import CouponCard from '../couponCard/couponCard';
import "./couponsCompany.css";

interface ICompanyState {
    coupons: CouponInfo[];

    ByTitleFilter: string;
    ByIdFilter: string;
    ByCategoryFilter: string;

    showDeleteModal: boolean;
    showConfirmationModal: boolean;
}

export default class CouponsCompany extends Component<any, ICompanyState> {

    private categories: string[];
    private deleteCouponId: number;
    private deleteCouponIndex: number;

    constructor(props: any) {
        super(props);
        this.categories = ["SHOWS_AND_ENTERTEINMENT", "TECH", "SERVICES", "DROIDS_AND_ANDROIDS", "HEALTH", "WEAPONS", "CARS"];
        this.state = {
            coupons: [],

            ByTitleFilter: "",
            ByIdFilter: "",
            ByCategoryFilter: "All",

            showDeleteModal: false,
            showConfirmationModal: false,
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        try {
            const response = await axios.get<CouponInfo[]>("http://localhost:8080/coupons/byCompany");
            this.setState({ coupons: response.data });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private couponsTitlePipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let text = event.target.value.toLowerCase();
        this.setState({ ByTitleFilter: text });
    }

    private couponsIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let number = event.target.value;
        this.setState({ ByIdFilter: number });
    }

    private couponsCategoryPipe = (event: any) => {
        let category = event.target.value;
        this.setState({ ByCategoryFilter: category });
    }

    private addCoupon = () => {
        this.props.history.push('/newCoupon');
    }

    private deleteCoupon = async () => {
        try {
            this.hideDeleteCouponModal();
            await axios.delete("http://localhost:8080/coupons/" + this.deleteCouponId);
            let newState = { ...this.state };
            newState.coupons.splice(this.deleteCouponIndex, 1);
            this.setState(newState);
            this.setState({ showConfirmationModal: true });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private showDeleteCouponModal = (id: number, index: number) => {
        this.deleteCouponId = id;
        this.deleteCouponIndex = index;
        this.setState({ showDeleteModal: true });
    }

    private hideDeleteCouponModal = () => {
        this.setState({ showDeleteModal: false });
    }

    private hideConfirmationModal = () => {
        this.setState({ showConfirmationModal: false })
    }

    public render() {
        return (
            <div className="couponsCompany">
                <div className="search">
                    <div className="filters">
                        <img src={require('../../../resources/loop50.png').default} alt="Search" />
                        <p>Category:</p>
                        <select className="categoriesSearch" defaultValue="All" required onChange={this.couponsCategoryPipe}>
                            <option value="All">All</option>
                            {this.categories.map((category, index) => <option key={index} value={category}>{category.charAt(0) + category.slice(1).toLocaleLowerCase().replaceAll("_", " ")}</option>)}
                        </select>
                        <input className="titleSearch" placeholder="Title" type="text" onChange={this.couponsTitlePipe} />
                        <input className="couponIdSearch" placeholder="Coupon ID" type="number" onChange={this.couponsIdPipe} />
                    </div>
                </div>

                <div className="coupons">
                    <div className="add" onClick={this.addCoupon}>
                        <span></span>
                        <h1>+</h1>
                    </div>

                    {this.state.coupons.filter(coupon => {
                        if (this.state.ByTitleFilter === "") {
                            return true;
                        }
                        return coupon.title.toLowerCase().includes(this.state.ByTitleFilter)
                    }
                    ).filter(coupon => {
                        if (this.state.ByIdFilter === "") {
                            return true;
                        }
                        return (String(coupon.id).includes(this.state.ByIdFilter))
                    }
                    ).filter(coupon => {
                        if (this.state.ByCategoryFilter === "All") {
                            return true;
                        }
                        return (coupon.category === this.state.ByCategoryFilter);
                    }
                    ).map((coupon, index) => <CouponCard key={coupon.id} coupon={coupon} history={this.props.history} action={this.showDeleteCouponModal} index={index} />
                    )
                    }
                </div>
                <ActionModal title="Please confirm your action" body={"Are you sure you want to delete coupon #" + this.deleteCouponId} show={this.state.showDeleteModal} handleCancel={this.hideDeleteCouponModal} handleConfirm={this.deleteCoupon} />
                <ConfirmationModal title="Deleted Successfuly!" body={"Deleted coupon #" + this.deleteCouponId} show={this.state.showConfirmationModal} handleClose={this.hideConfirmationModal} />
            </div >
        );
    }
}