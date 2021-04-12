import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { UserInfo } from '../../../models/userInfo';
import "./userCard.css";


interface IUserCardProps {
    user: UserInfo;
    history: RouteComponentProps["history"];
}

export default class UserCard extends Component<IUserCardProps> {
    public constructor(props: IUserCardProps) {
        super(props);
    }

    public getUserInfo = async () => {
        let id = this.props.user.id;
        this.props.history.push('/user/' + id);
    }

    public render() {
        return (
            <div className="userCard" onClick={this.getUserInfo}>
                <div className="userContent">
                    <div className="identifiers">
                        <h6>#{this.props.user.id}</h6>
                        <div className="status">
                            <h6>{this.props.user.userType}</h6>
                            {this.props.user.userType === "COMPANY" &&
                                <h6>
                                    #{this.props.user.companyId}
                                </h6>
                            }
                        </div>
                    </div>
                    <h4 className="mail">Email: <br />{this.props.user.userName}</h4><br />
                    <h5 className="first">First name: {this.props.user.firstName}</h5><br />
                    <h5 className="last">Last name: {this.props.user.lastName}</h5>
                </div>
            </div>
        );
    }
}