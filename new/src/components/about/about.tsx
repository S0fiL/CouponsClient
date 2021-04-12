import React, { Component } from 'react'
import { tokenVerifycation } from '../../sharedFunctions/loginVerification';
import "./about.css";

export default class About extends Component {
    
    public async componentDidMount() {

        window.scrollTo(0, 0);
        tokenVerifycation();
        
    }

    public render() {
        return (
            <div className="about">
                <h1>We are happy to see you on our site!</h1>
                <h2>Here is everything you need to know about us</h2>
                <p>About Us page story template
                [FOUNDERS] started [COMPANY] because [EXPLAIN PROBLEM IN YOUR INDUSTRY].

                That's why [DESCRIBE JOURNEY TO SOLUTION].

                Along the way, [SHARE MILESTONES AND WINS].

                We want to be [STATE YOUR MISSION GOING FORWARD].

                Keep in mind that writing your actual copy in the first person (e.g. I, We) will help build a more personal connection with your audience. Your About Us page is About YOU, so don't shy away from that.</p>
            </div>
        );
    }
}