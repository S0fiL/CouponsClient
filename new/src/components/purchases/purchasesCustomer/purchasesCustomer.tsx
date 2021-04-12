import axios from 'axios';
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { PurchaseInfo } from '../../../models/purchaseInfo';
import { createTimestamp } from '../../../sharedFunctions/createTimestamp';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import "./purchasesCustomer.css";

interface IPurchaseListCustomer {
    purchases: PurchaseInfo[];
    byIdFilter: string
}

export default class PurchasesCustomer extends Component<any, IPurchaseListCustomer> {

    constructor(props: any) {
        super(props);
        this.state = {
            purchases: [],

            byIdFilter: ""
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        try {
            const response = await axios.get<PurchaseInfo[]>("http://localhost:8080/purchases/byUser");
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

    private renderTableData = () => {
        return this.state.purchases.filter(purchase => {
            if (this.state.byIdFilter === "") {
                return true;
            }
            return (String(purchase.id).includes(this.state.byIdFilter));
        }
        ).map(purchase => {
            return (
                <tr key={purchase.id} >
                    <td>{purchase.id}</td>
                    <td>{createTimestamp(purchase.timestamp)}</td>
                    <td><NavLink to={"/coupon/" + purchase.couponId} exact>{purchase.couponTitle}</NavLink></td>
                    <td> #{purchase.couponId}</td>
                    <td>{purchase.companyName}</td>
                    <td>{purchase.price} $</td>
                    <td>{purchase.amount}</td>
                </tr>
            )
        });
    }

    public render() {
        return (
            <div className="purchasesCustomer">
                <div className="filters">
                    <img src={require('../../../resources/loop50.png').default} alt="Search" />
                    <input type="number" placeholder="Order number" onChange={this.purchaseIdPipe} />
                </div>
                <div className="tableDiv">
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Timestamp</th>
                                <th>Coupon Title</th>
                                <th>Coupon ID</th>
                                <th>Supplier</th>
                                <th>Price for one unit</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderTableData()}</tbody>
                    </table>
                </div>
            </div >
        );
    }
}