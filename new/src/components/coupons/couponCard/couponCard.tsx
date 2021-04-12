import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { CouponInfo } from '../../../models/couponInfo';
import { store } from '../../../redux/store';
import "./couponCard.css";
import defaultImg from '../../../resources/soon.png';
import { createDate } from '../../../sharedFunctions/createDate';


interface ICouponCardProps {
    coupon: CouponInfo;
    history: RouteComponentProps["history"];
    action?: any;
    index?: number;
}

export default class CouponCard extends Component<ICouponCardProps> {
    public constructor(props: ICouponCardProps) {
        super(props);
    }

    public getCouponInfo = () => {
        this.props.history.push('/coupon/' + this.props.coupon.id);
    }

    public getTitle = () => {
        let title = this.props.coupon.title;
        if (title.length > 45) {
            return (title.substring(0, 42) + "...");
        }
        return this.props.coupon.title;
    }

    private deleteCoupon = (event: any) => {
        event.cancelBubble = true;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        this.props.action(this.props.coupon.id, this.props.index);
    }

    public render() {
        return (
            <div className="container">
                <div className="couponCard" onClick={this.getCouponInfo}>
                    <span></span>
                    <div className="content">
                        <h6>#{this.props.coupon.id}</h6>
                        {store.getState().userType === "COMPANY" && <img onClick={this.deleteCoupon} className="delete" src={require('../../../resources/X.png').default} alt="X" />}
                        <h1 className="title">{this.getTitle()}</h1>
                        {this.props.coupon.image != null && <img className="couponImg" src={this.props.coupon.image} alt="coupon img" />}
                        {this.props.coupon.image == null && <img className="couponImg" src={defaultImg} alt="deafult img" />}
                        <div className="couponInfo">
                            <h3>Available until <br />{createDate(this.props.coupon.endDate)}!</h3>
                            <h2>{this.props.coupon.price} $</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}