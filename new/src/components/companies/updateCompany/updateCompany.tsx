import axios from 'axios';
import React, { Component } from 'react'
import { Company } from '../../../models/company';
import { User } from '../../../models/user';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal from '../../modals/confirmationModal';
import "./updateCompany.css";

interface ICompanyUpdateState {
    company: Company;
    isError: boolean;

    showConfirmationModal: boolean;
}

export default class UpdateCompany extends Component<any, ICompanyUpdateState> {

    private errorMessage: string;

    public constructor(props: any) {
        super(props);
        this.state = {
            company: new Company(),
            isError: false,

            showConfirmationModal: false
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        let id = this.props.match.params.id;

        try {
            const response = await axios.get<User>("http://localhost:8080/companies/" + id);
            let company = response.data;
            this.setState({ company });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private setName = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.value;
        this.setState({ company: { ...this.state.company, name: name } });
    }

    private setEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        let email = event.target.value;
        this.setState({ company: { ...this.state.company, email: email } });
    }

    private setPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        let phone = event.target.value;
        this.setState({ company: { ...this.state.company, phone: phone } });
    }

    private setAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        let address = event.target.value;
        this.setState({ company: { ...this.state.company, address: address } });
    }

    private update = async (event: any) => {
        event.preventDefault();
        try {
            await axios.put("http://localhost:8080/companies", this.state.company);
            this.setState({ showConfirmationModal: true });
        }
        catch (err) {
            if (err.response.data.num > 601 &&  err.response.data.num < 631) {
                this.errorMessage = err.response.data.message;
                this.setState({ isError: true });
            } else {
                alert(err.response.data.message);
            }
            console.log(err.response.data);
        }
    }

    private hideConfirmationModal = () => {
        this.props.history.push('/company/' + this.state.company.id);
    }

    public render() {
        return (
            <div className="companyUpdate">
                <form onSubmit={this.update}>
                    <div className="companyUpdateLabels">
                        <label>Name: </label><br />
                        <label>Email: </label><br />
                        <label>Phone: </label><br />
                        <label>Address: </label><br />
                    </div>
                    <div className="companyUpdateInput">
                        <input type="text" defaultValue={this.state.company.name} onChange={this.setName} /><br />
                        <input type="text" defaultValue={this.state.company.email} onChange={this.setEmail} /><br />
                        <input type="text" defaultValue={this.state.company.phone} onChange={this.setPhone} /><br />
                        <input type="text" defaultValue={this.state.company.address} onChange={this.setAddress} /><br />
                        <br />
                        {this.state.isError === true && <p>*{this.errorMessage}</p>}
                        <input type="submit" value="Update" id="updateCompanyButton"/>
                        <ConfirmationModal title="Updated succsessfully!" body="New company information was saved" show={this.state.showConfirmationModal} handleClose={this.hideConfirmationModal} />
                    </div>
                </form>
            </div>
        );
    }
}