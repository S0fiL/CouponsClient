import axios from 'axios';
import React, { Component } from 'react'
import { CouponInfo } from '../../../models/couponInfo';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import CouponCard from '../couponCard/couponCard';
import "./couponsAdmin.css";

interface IAdminState {
    coupons: CouponInfo[];

    ByTitleFilter: string;
    ByIdFilter: string;
    byCompanyIdFilter: string;
}

export default class CouponsAdmin extends Component<any, IAdminState> {
    constructor(props: any) {
        super(props);
        this.state = {
            coupons: [],
            ByTitleFilter: "",
            ByIdFilter: "",
            byCompanyIdFilter: ""
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
        this.setState({ ByTitleFilter: text });
    }

    private couponsIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let couponId = event.target.value;
        this.setState({ byCompanyIdFilter: couponId });
    }

    private couponsCompanyIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let companyId = event.target.value;
        console.log(companyId);
        this.setState({ ByIdFilter: companyId });
    }

    public render() {
        return (
            <div className="couponsAdmin">

                <div className="filters">
                    <img src={require('../../../resources/loop50.png').default} alt="Search" />
                    <input placeholder="Title" type="text" onChange={this.couponsTitlePipe} />
                    <input placeholder="Coupon ID" type="number" onChange={this.couponsIdPipe} />
                    <input placeholder="Company ID" type="number" onChange={this.couponsCompanyIdPipe} />
                </div>
                <div className="coupons">
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
                        return (String(coupon.companyId).includes(this.state.ByIdFilter));
                    }
                    ).filter(coupon => {
                        if (this.state.byCompanyIdFilter === "") {
                            return true;
                        }
                        return (String(coupon.id).includes(this.state.byCompanyIdFilter));
                    }
                    ).map(coupon => <CouponCard key={coupon.id} coupon={coupon} history={this.props.history} />
                    )
                    }
                </div>
            </div >
        );
    }
}