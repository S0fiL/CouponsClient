import axios from 'axios';
import React, { Component } from 'react'
import { CouponInfo } from '../../../models/couponInfo';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import CouponCard from '../couponCard/couponCard';
import "./couponsCustomer.css";

interface ICustomerState {
    coupons: CouponInfo[];

    byTitleFilter: string;
    byIdFilter: string;
    byCategoryFilter: string;
    byMaxPriceFilter: number;
    byMinPriceFilter: number;
}

export default class CouponsCustomer extends Component<any, ICustomerState> {

    private categories: string[];

    constructor(props: any) {
        super(props);
        this.categories = ["SHOWS_AND_ENTERTEINMENT", "TECH", "SERVICES", "DROIDS_AND_ANDROIDS", "HEALTH", "WEAPONS", "CARS"];
        this.state = {
            coupons: [],

            byTitleFilter: "",
            byIdFilter: "",
            byCategoryFilter: "All",
            byMaxPriceFilter: null,
            byMinPriceFilter: null
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        try {
            const response = await axios.get<CouponInfo[]>("http://localhost:8080/coupons");
            this.setState({ coupons: response.data });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private couponsTitlePipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let text = event.target.value.toLowerCase();
        this.setState({ byTitleFilter: text });
    }

    private couponsIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let number = event.target.value;
        this.setState({ byIdFilter: number });
    }

    private couponsCategoryPipe = (event: any) => {
        let category = event.target.value;
        this.setState({ byCategoryFilter: category });
    }

    private couponsMaxPricePipe = (event: any) => {
        let maxPrice = event.target.value;
        this.setState({ byMaxPriceFilter: maxPrice });
    }

    private couponsMinPricePipe = (event: any) => {
        let minPrice = event.target.value;
        this.setState({ byMinPriceFilter: minPrice });
    }

    public render() {
        return (
            <div className="couponsCustomer">
                <div className="filters">
                    <img src={require('../../../resources/loop50.png').default} alt="Search" />
                    <p>Category:</p>
                    <select className="categories" defaultValue="All" required onChange={this.couponsCategoryPipe}>
                        <option value="All">All</option>
                        {this.categories.map((category, index) => <option key={index} value={category}>{category.charAt(0) + category.slice(1).toLocaleLowerCase().replaceAll("_", " ")}</option>)}
                    </select>
                    <input type="text" placeholder="Title" onChange={this.couponsTitlePipe} />
                    <input type="number" placeholder="Couopn ID" onChange={this.couponsIdPipe} />
                    <input type="number" step=".01" placeholder="Lowest price" onChange={this.couponsMinPricePipe} />
                    <input type="number" step=".01" placeholder="Highest price" onChange={this.couponsMaxPricePipe} />
                </div>
                <div className="coupons">
                    {this.state.coupons.filter(coupon => {
                        if (this.state.byTitleFilter === "") {
                            return true;
                        }
                        return coupon.title.toLowerCase().includes(this.state.byTitleFilter)
                    }
                    ).filter(coupon => {
                        if (this.state.byIdFilter === "") {
                            return true;
                        }
                        return (String(coupon.id).includes(this.state.byIdFilter));
                    }
                    ).filter(coupon => {
                        if (this.state.byCategoryFilter === "All") {
                            return true;
                        }
                        return (coupon.category === this.state.byCategoryFilter);
                    }
                    ).filter(coupon => {
                        if (this.state.byMaxPriceFilter === null || this.state.byMaxPriceFilter < 1) {
                            return true;
                        }
                        return (coupon.price < this.state.byMaxPriceFilter);
                    }
                    ).filter(coupon => {
                        if (this.state.byMinPriceFilter === 0) {
                            return true;
                        }
                        return (coupon.price > this.state.byMinPriceFilter);
                    }
                    ).map(coupon => <CouponCard key={coupon.id} coupon={coupon} history={this.props.history} />
                    )
                    }
                </div>
            </div >
        );
    }
}