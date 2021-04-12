import axios from 'axios';
import React, { Component } from 'react'
import { Company } from '../../../models/company';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import ConfirmationModal from '../../modals/confirmationModal';
import "./newCompany.css";

interface INewCompanyState {
    isError: boolean;
    showConfirmationModal: boolean;
}

export default class NewCompany extends Component<any, INewCompanyState> {

    private company: Company;
    private id: number;
    private errorMessage: string;

    public constructor(props: any) {
        super(props);

        this.company = new Company();

        this.state = {
            isError: false,
            showConfirmationModal: false
        };
    }

    public componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        
    }

    private setName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.company.name = event.target.value;
    }

    private setEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.company.email = event.target.value;
    }

    private setPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.company.phone = event.target.value;
    }

    private setAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.company.address = event.target.value;
    }

    private createCompany = async (event: any) => {

        event.preventDefault();
        
        try {
            const response = await axios.post<number>("http://localhost:8080/companies", this.company);
            this.id = response.data;
            this.showConfirmationModal();
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

    private showConfirmationModal = () => {
        this.setState({ showConfirmationModal: true });
    }

    private hideConfirmationModal = () => {
        this.props.history.push('/companies');
    }

    private showCompanyInfo = () => {
        this.props.history.push('/company/' + this.id);
    }

    public render() {
        return (
            <div className="newCompany">
                <form onSubmit={this.createCompany}>
                    <h1>To add a new company please fill the following fields: </h1>
                    <h4>fields marked by * are required</h4>
                    <h2>*<input type="text" required placeholder="Company name" onChange={this.setName} /></h2>
                    <h2>*<input type="text" required placeholder="Email" onChange={this.setEmail} /></h2>
                    <h2>*<input type="text" required placeholder="Phone number" onChange={this.setPhone} /></h2>
                    <input type="text" placeholder="Address " onChange={this.setAddress} /><br />
                    {this.state.isError === true && <p>*{this.errorMessage}</p>}
                    <input type="submit" value="Submit" id="newCompanyButton"/>
                    <ConfirmationModal title="Created succsessfully!" body={ "Company #" + this.id + " was added to companies' list"} show={this.state.showConfirmationModal} handleClose={this.hideConfirmationModal} />
                </form>
            </div>
        );
    }
}