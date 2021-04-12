import axios from 'axios';
import React, { Component } from 'react'
import { Company } from '../../../models/company';
import { tokenVerifycation } from '../../../sharedFunctions/loginVerification';
import "./companiesList.css";

interface ICompanyListState {
    companies: Company[];

    byIdFilter: string;
    byNameFilter: string;
}

export default class CompaniesList extends Component<any, ICompanyListState> {

    constructor(props: any) {
        super(props);
        
        this.state = {
            companies: [],

            byIdFilter: "",
            byNameFilter: "",
        };
    }

    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        
        try {
            const response = await axios.get<Company[]>("http://localhost:8080/companies");
            this.setState({ companies: response.data });
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    }

    private companyIdPipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let number = event.target.value;
        this.setState({ byIdFilter: number });
    }

    private companyNamePipe = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.value;
        this.setState({ byNameFilter: name });
    }

    private addNewCompany = () => {
        this.props.history.push("/newCompany");
    }

    private companyInfo = (companyId: number) => {
        this.props.history.push("/company/" + companyId);
    }

    private renderTableData = () => {
        return this.state.companies.filter(company => {
            if (this.state.byNameFilter === "") {
                return true;
            }
            return (company.name.includes(this.state.byNameFilter));
        }
        ).filter(company => {
            if (this.state.byIdFilter === "") {
                return true;
            }
            return (String(company.id).includes(this.state.byIdFilter));
        }
        ).map(company => {
            return (
                <tr onClick={() =>this.companyInfo(company.id)} key={company.id} >
                    <td>#{company.id}</td>
                    <td>{company.name}</td>
                    <td>{company.email}</td>
                    <td>{company.phone}</td>
                    <td>{company.address}</td>
                </tr>
            )
        });
    }

    public render() {
        return (
            <div className="companiesList">
                <div className="filters">
                <img src={require('../../../resources/loop50.png').default} alt="Search"/>
                <input type="number" placeholder="Company ID" onChange={this.companyIdPipe} /><br /><br />
                <input type="text" className="companySearch" placeholder="Company name" onChange={this.companyNamePipe} /><br /><br />
                </div>
                <input type="button" value="Add company" onClick={this.addNewCompany}/>
                <div className="tableDiv">
                    <table>
                        <thead>
                            <tr>
                                <th>Company ID</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            </div >
        );
    }
}