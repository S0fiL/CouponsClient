import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { Coupon } from "../../models/coupon";
import "./modalButtons.css";

interface IpurchaseConfirmationModalProps {
    show: boolean;
    coupon: Coupon;
    amount: number;
    purchaseId: number;
    total: number;
    handleClose: any;
    handleReturn: any;
}

export default class purchaseConfirmationModal extends Component<IpurchaseConfirmationModalProps> {
    public constructor(props: IpurchaseConfirmationModalProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={this.props.handleClose} animation={false} backdrop="static" keyboard={false}>
                <Modal.Header>
                        <Modal.Title>
                            Thanks for your purchase!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="purchaseModal">
                        <p>Order #{this.props.purchaseId} is successfully paid</p>
                        <h3>Purchase details: </h3>
                        <h4>{this.props.coupon.title}</h4>
                        <h4>{this.props.coupon.price} $    x {this.props.amount}</h4>
                        <h1>Total: {this.props.total} $</h1>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="closeReturn" variant="secondary" onClick={this.props.handleClose}>
                            Close
                        </Button>
                        <Button className="return" variant="primary" onClick={this.props.handleReturn}>
                            Back to store
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}