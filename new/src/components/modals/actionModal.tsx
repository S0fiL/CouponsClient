import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "./modalButtons.css";

interface IActionModalProps {
    title: string;
    body: string;
    show: boolean;
    handleCancel: any;
    handleConfirm: any;
}

export default class ActionModal extends Component<IActionModalProps> {
    public constructor(props: IActionModalProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Modal className="myModal" show={this.props.show} onHide={this.props.handleCancel} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.body}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel" variant="primary" onClick={this.props.handleCancel}>
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