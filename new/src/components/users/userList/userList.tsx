import axios from 'axios';
import React, { Component } from 'react'
import { UserInfo } from '../../../models/userInfo';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import UserCard from '../userCard/userCard';
import "./userList.css";

interface IUserListState {
    users: UserInfo[];

    ByIdFilter: string;
}

export default class UserList extends Component<any, IUserListState> {

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],

            ByIdFilter: ""
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();

        try {
            const response = await axios.get<UserInfo[]>("http://localhost:8080/users");
            this.setState({ users: response.data });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private userIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let number = event.target.value;
        this.setState({ ByIdFilter: number });
    }

    private addUser = () => {
        this.props.history.push('/newUser');
    }

    public render() {
        return (
            <div className="userList">
                <div className="filters">
                    <img src={require('../../../resources/loop50.png').default} alt="Search" />
                    <input className="search" type="number" placeholder="User ID" onChange={this.userIdPipe} /><br /><br />
                </div>
                <input className="addUserButton" type="button" value="Add a new user" onClick={this.addUser} />
                <div className="users">
                    {this.state.users.filter(user => {
                        if (this.state.ByIdFilter === "") {
                            return true;
                        }
                        return (String(user.id).includes(this.state.ByIdFilter));
                    }
                    ).map(user => <UserCard key={user.id} user={user} history={this.props.history} />
                    )
                    }
                </div>
            </div >
        );
    }
}