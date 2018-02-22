import React, { Component } from 'react';
import ReactBootstrap from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import "./bootswatch/Flatly/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.css";

import { Navbar, NavItem, Nav, Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, HelpBlock, Table, Well } from "react-bootstrap";

class App extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      activePlace: 0,
      earning: 0.00017107,
      rate: 11000,
      rePurchase: 40,
      poolPrice: 1000,
      days: [],
    };
  }

  handleChange() {
    this.setState({ earning: this.earning.value });
    this.setState({ rate: this.rate.value });
    this.setState({ rePurchase: this.rePurchase.value });
    this.setState({ poolPrice: this.poolPrice.value });
    this.updateValues();
  }

  updateValues() {
    var earning = this.earning.value;
    var rate = this.rate.value;
    var rePurchase = this.rePurchase.value;
    var poolPrice = this.poolPrice.value;
    var poolSharePrice = this.poolPrice.value*0.05/rate;
    var rePurchaseAccumulator = 0;
    var days = [];
    var currentEarning = 0;
    var poolShare = 1;
    var pools = [];
    var realEarning = 0;
    var rePurchaseShare = 0;
    pools[0] = {
      lastDay: 1000,
      share: 1
    };
    var i = 1;
    while (i <= 100000 && poolShare.toFixed(2) > 0) {
      if (pools.length > 0 && pools[0].lastDay < i) {
        var pool = pools.shift();
        poolShare -= pool.share;
      }
      if (rePurchaseAccumulator > poolSharePrice) {
        poolShare += 0.05;
        rePurchaseAccumulator -= poolSharePrice;
        pools[Number(pools.length)] = {
          lastDay: i + 1000,
          share: 0.05
        };
      }
      realEarning = poolShare*earning;
      rePurchaseShare = realEarning*rePurchase/100;
      rePurchaseAccumulator += rePurchaseShare;
      currentEarning += realEarning - rePurchaseShare;
      days[i] = {
        number: i,
        earning: currentEarning,
        rePurchaseAccumulator: rePurchaseAccumulator,
        poolShare: poolShare
      };
      i++;
    };
    this.setState({ days: days });
  }

  componentDidMount() {
    this.updateValues();
  }

  render() {
    const activePlace = this.state.activePlace;
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              BitClub Calculator
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>
          <Row>
            <Col md={4} sm={4}>
              <Form>
                <FormGroup>
                  <ControlLabel><strong>Daily earning</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => { this.earning = ref; }}
                    value={this.state.earning}
                    type="text"
                    placeholder="Enter text"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                  <ControlLabel><strong>BTC price $</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => { this.rate = ref; }}
                    value={this.state.rate}
                    type="text"
                    placeholder="Enter text"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                  <ControlLabel><strong>re-purchase %</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => { this.rePurchase = ref; }}
                    value={this.state.rePurchase}
                    type="text"
                    placeholder="Enter text"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                  <ControlLabel><strong>poolPrice</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => { this.poolPrice = ref; }}
                    value={this.state.poolPrice}
                    type="text"
                    placeholder="Enter text"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Form>
              <Well>
                <p>{this.state.days.length-1}</p>
                <p>{this.state.days.length > 0 ? (this.state.days[this.state.days.length-1].earning).toFixed(2) : ''}</p>
                <p>{this.state.days.length > 0 ? (this.state.days[this.state.days.length-1].earning*this.rate.value).toFixed(2) : ''}</p>
              </Well>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={12}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Earning BTC</th>
                    <th>Pool share</th>
                    <th>rePurchase acc</th>
                    <th>Earning $</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.days.map((day, i) => {
                    return (
                      <tr key={i}>
                        <td>{day.number} ({(day.number/365).toFixed(2)})</td>
                        <td>{(day.earning).toFixed(9)}</td>
                        <td>{(day.poolShare).toFixed(2)}</td>
                        <td>{(day.rePurchaseAccumulator*this.rate.value).toFixed(2)}</td>
                        <td>{(day.earning*this.rate.value).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;