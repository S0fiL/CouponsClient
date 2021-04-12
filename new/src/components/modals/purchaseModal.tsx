import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { Coupon } from "../../models/coupon";
import "./modalButtons.css";

interface IPurchaseModalProps {
    show: boolean;
    total: number;
    amount: number;
    coupon: Coupon;
    handleCancel: any;
    handleConfirm: any;
}

export default class PurchaseModal extends Component<IPurchaseModalProps> {
    public constructor(props: IPurchaseModalProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={this.props.handleCancel} animation={false} backdrop="static" keyboard={false}>
                <Modal.Header>
                        <Modal.Title>
                            Please confirm your purchase
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="purchaseBody">
                        <h2>{this.props.coupon.title}</h2>

                        <h3>{this.props.coupon.price} $    x {this.props.amount}</h3>

                        <h1>Total: {this.props.total} $</h1>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel" variant="secondary" onClick={this.props.handleCancel}>
                            Cancel
                        </Button>
                        <Button className="confirm" variant="primary" onClick={this.props.handleConfirm}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}