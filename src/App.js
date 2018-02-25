import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";

import {Navbar, Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Table, Well} from "react-bootstrap";

function FieldGroup({id, label, ...props}) {
  return (
    <FormGroup controlId={id} md={1}
               sm={1}>
      <FormControl {...props} />
    </FormGroup>
  );
}

class App extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      activePlace: 0,
      earning: 0.00017,
      rate: 10000,
      rePurchase: 40,
      poolsCount: 1,
      poolPrice: 1000,
      poolLife: 0,
      maxEarning: 0,
      days: [],
      mainPoints: []
    };
  }

  handleChange() {
    this.setState({earning: this.earning.value});
    this.setState({rate: this.rate.value});
    this.setState({rePurchase: this.rePurchase.value});
    this.setState({poolPrice: this.poolPrice.value});
    this.setState({poolsCount: this.poolsCount.value});
    this.updateValues();
  }

  updateValues() {
    let earning = this.earning.value;
    let rate = this.rate.value;
    let rePurchase = this.rePurchase.value;
    let poolPrice = this.poolPrice.value;
    let poolSharePrice = this.poolPrice.value * 0.05 / rate;
    let rePurchaseAccumulator = 0;
    let days = [];
    let currentEarning = 0;
    let poolShare = Number(this.poolsCount.value);
    let pools = [];
    let realEarning = 0;
    let rePurchaseShare = 0;
    let mainPoints = [];
    pools[0] = {
      lastDay: 1000,
      share: this.poolsCount.value
    };
    let i = 1;
    let maxI = 2000;
    let gotPoolPrice = false;
    while (i <= 7300 && poolShare.toFixed(2) > 0) {
      if (pools.length > 0 && pools[0].lastDay < i) {
        let pool = pools.shift();
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
      if (i === 365) {
        mainPoints.push({
          i: i,
          name: 'First year'
        });
      }
      if (i === 1000) {
        mainPoints.push({
          i: i,
          name: '1000 days'
        });
      }
      if (i === 2000) {
        mainPoints.push({
          i: i,
          name: '2000 days'
        });
      }
      if (!gotPoolPrice && poolPrice <= currentEarning * rate) {
        gotPoolPrice = true;
        mainPoints.push({
          i: i,
          name: i + ' days'
        });
      }
      realEarning = poolShare * earning;
      rePurchaseShare = realEarning * rePurchase / 100;
      rePurchaseAccumulator += rePurchaseShare;
      currentEarning += realEarning - rePurchaseShare;

      if (i <= maxI) {
        days[i] = {
          number: i,
          earning: currentEarning,
          rePurchaseAccumulator: rePurchaseAccumulator,
          poolShare: poolShare
        };
      }
      i++;
    }
    ;
    this.setState({poolLife: i - 1});
    this.setState({mainPoints: mainPoints});
    this.setState({maxEarning: currentEarning});
    this.setState({days: days});
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
            <Col md={6} sm={6}>
              <Form>
                <FormGroup>
                  <ControlLabel><strong>Daily earning</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => {
                      this.earning = ref;
                    }}
                    value={this.state.earning}
                    type="text"
                    placeholder=""
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel><strong>BTC price $</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => {
                      this.rate = ref;
                    }}
                    value={this.state.rate}
                    type="text"
                    placeholder=""
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel><strong>re-purchase %</strong></ControlLabel>
                  <FormControl
                    inputRef={ref => {
                      this.rePurchase = ref;
                    }}
                    value={this.state.rePurchase}
                    type="number"
                    placeholder=""
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="pool1Count">
                  <ControlLabel>Pool#1</ControlLabel>{' '}
                  <FormControl
                    componentClass="select"
                    inputRef={ref => {
                      this.poolPrice = ref;
                    }}
                    value={this.state.poolPrice}
                    placeholder=""
                    onChange={this.handleChange}
                  >
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="2000">2000</option>
                  </FormControl>
                </FormGroup>{' '}
                <FormGroup controlId="pool2Count">
                  <ControlLabel>Pools count</ControlLabel>{' '}
                  <FormControl
                    inputRef={ref => {
                      this.poolsCount = ref;
                    }}
                    value={this.state.poolsCount}
                    type="text"
                    placeholder=""
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col md={6} sm={6}>
              <Well>
                {this.state.mainPoints.map((point, i) => {
                  return (
                    <span key={i}>
                      {point.name} ({(point.i / 365).toFixed(2)} year)
                      / {this.state.days.length >= point.i ? (this.state.days[point.i].earning).toFixed(6) + ' BTC ' : ''}
                      / {this.state.days.length >= point.i ? (this.state.days[point.i].earning * this.rate.value).toFixed(2) + ' $' : ''}
                      <br/>
                    </span>
                  );
                })}
                {this.state.poolLife} days ({(this.state.poolLife / 365).toFixed(2)} year)
                / {(this.state.maxEarning).toFixed(6) + ' BTC'}
                / {(this.state.maxEarning * this.state.rate).toFixed(2) + ' $'}
              </Well>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={12}>
              <Table striped bordered condensed hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Pool share</th>
                  <th>rePurchase acc</th>
                  <th>Earning BTC</th>
                  <th>Earning $</th>
                </tr>
                </thead>
                <tbody>
                {this.state.days.map((day, i) => {
                  return (
                    <tr key={i}>
                      <td>{day.number} ({(day.number / 365).toFixed(2)})</td>
                      <td>{(day.poolShare).toFixed(2)}</td>
                      <td>{(day.rePurchaseAccumulator * this.rate.value).toFixed(2)}</td>
                      <td>{(day.earning).toFixed(9)}</td>
                      <td>{(day.earning * this.rate.value).toFixed(2)}</td>
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
