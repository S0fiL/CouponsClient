import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "./modalButtons.css";

interface IConfirmationModalProps {
    title: string;
    body: string;
    show: boolean;
    handleClose: any;
}

export default class ConfirmationModal extends Component<IConfirmationModalProps> {
    public constructor(props: IConfirmationModalProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={this.props.handleClose} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.body}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="close" variant="primary" onClick={this.props.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}