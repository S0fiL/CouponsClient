import axios from 'axios';
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { Purchase } from '../../../models/purchase';
import { createTimestamp } from '../../../sharedFunctions/createTimestamp';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import "./purchasesCompany.css";

interface IPurchaseListCompanyr {
    purchases: Purchase[];

    byIdFilter: string
}

export default class PurchasesCompany extends Component<any, IPurchaseListCompanyr> {

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
            const response = await axios.get<Purchase[]>("http://localhost:8080/purchases/byCompany");
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
                    <td>#{purchase.id}</td>
                    <td>{createTimestamp(purchase.timestamp)}</td>
                    <td><NavLink to={"/coupon/" + purchase.couponId} exact> #{purchase.couponId}</NavLink></td>
                    <td>{purchase.amount}</td>
                    <td>#{purchase.userId}</td>
                </tr>
            )
        });
    }

    public render() {
        return (
            <div className="purchasesCompany">
                <div className="filters">
                <img src={require('../../../resources/loop50.png').default} alt="Search" />
                <input type="number" placeholder="Order number" onChange={this.purchaseIdPipe} />
                </div>
                <div className="tableDiv">
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Timestamp</th>
                                <th>Coupon ID</th>
                                <th>Amount</th>
                                <th>User ID</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderTableData()}</tbody>
                    </table>
                </div>
            </div >
        );
    }
}