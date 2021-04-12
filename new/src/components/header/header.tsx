import React, { Component } from 'react'
import "./header.css";

export default class Header extends Component {
  public render() {
    return (
      <div className = "header">
        <img className="headerImg" src={require("../../resources/header.png").default} alt="header"/>
      </div>
    );
  }
}