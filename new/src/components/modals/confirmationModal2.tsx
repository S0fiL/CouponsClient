import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "./modalButtons.css";

interface IConfirmationModal2Props {
    title: string;
    body: string;
    show: boolean;
    handleClose: any;
    handleForward: any;
    forwardButtonText: string;
}

export default class ConfirmationModal2 extends Component<IConfirmationModal2Props> {
    public constructor(props: IConfirmationModal2Props) {
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
                        <Button className="closeForward" variant="primary" onClick={this.props.handleClose}>
                            Close
                        </Button>
                        <Button className="forward" variant="primary" onClick={this.props.handleForward}>
                            {this.props.forwardButtonText}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}