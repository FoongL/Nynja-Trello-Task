import React, { Component } from 'react';
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import axios from 'axios';
require('dotenv').config();

export default class cardLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      labels: [],
      listToggle: false,
      listName: 'To Do',
      listId: '',
      labelToggle: false,
      labelName: 'Select Label:',
      labelList: [],
      descriptionCount: 1000,
      titleCount: 50,
      toast: false,
      changes: '',
    };
  }

  componentDidMount() {
    this.grabStates();
  }
  grabStates = () => {
    axios
      .get(
        `https://api.trello.com/1/boards/${process.env.REACT_APP_API_BOARD_ID}/lists?key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
      )
      .then((data) => {
        this.setState({ lists: data.data });
      })
      .catch((err) => {
        console.log('something went wrong');
      });
    axios
      .get(
        `https://api.trello.com/1/boards/${process.env.REACT_APP_API_BOARD_ID}/labels?key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
      )
      .then((data) => {
        this.setState({ labels: data.data });
      })
      .then(() => {})
      .catch((err) => {
        console.log('something went wrong');
      });
  };
  toggleList = (e) => {
    this.setState({
      listToggle: !this.state.listToggle,
    });
  };
  toggleLabel = () => {
    this.setState({
      labelToggle: !this.state.labelToggle,
    });
  };
  toastToggle = () => {
    this.setState({
      toast: !this.state.toast,
    });
  };
  chooseList = (e) => {
    if(e.target.innerText !== 'To Do'){
      alert('Beware, you are setting to post list not into "To Do".')
    }
    this.setState({
      listName: e.target.innerText,
      listId: e.target.id,
    });
  };
  addLabel = (e) => {
    let joined = [];
    if (this.state.labelList.length === 0) {
      joined = [e.target.id];
    } else {
      joined = this.state.labelList.concat(e.target.id);
    }
    this.setState({
      labelName: e.target.innerText,
      labelList: joined,
    });
  };

  descriptionCount = (e) => {
    let charLeft = 1000 - e.target.value.length;
    this.setState({
      descriptionCount: charLeft,
    });
  };
  titleCount = (e) => {
    let charLeft = 50 - e.target.value.length;
    this.setState({
      titleCount: charLeft,
    });
  };

  submit = () => {
    this.setState({
      changes: '',
    });
    let idList = this.state.listId;
    let data = {
      name: document.getElementById('cardName').value,
      desc: document.getElementById('cardDesc').value,
      due: document.getElementById('due').value,
      idLabels: this.state.labelList,
    };
    if (idList === '') {
      alert('Please remember to select a list to post to');
    } else {
      if (data.name.includes('DEV')) {
        if (data.idLabels.includes('5eb79eef7669b225494bc374') === false) {
          this.setState({
            changes: 'Dev tag was added to card.',
          });
          data.idLabels.push('5eb79eef7669b225494bc374');
        }
      } else if (data.name.includes('QA')) {
        let date = new Date();
        date.setDate(date.getDate() + 1).toString();
        if (date.due !== date) {
          data.due = date;
          this.setState({
            changes: 'Due date changed to tomorrow.',
          });
        }
      } else {
        if (data.idLabels.includes('5eb79eef7669b225494bc378') === false) {
          this.setState({
            changes: 'General tag was added to card.',
          });
          data.idLabels.push('5eb79eef7669b225494bc378');
        }
      }

      axios
        .post(
          `https://api.trello.com/1/cards?idList=${idList}&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`,
          data
        )
        .then(() => {
          this.setState({
            lists: [],
            labels: [],
            listToggle: false,
            listName: 'To Do',
            listId: '5eb79eefecc831684564d6f8',
            labelToggle: false,
            labelName: 'Select Label:',
            labelList: [],
            descriptionCount: 1000,
            titleCount: 50,
            toast: true,
          });
        })
        .then(() => {
          document.getElementById('cardName').value = '';
          document.getElementById('cardDesc').value = '';
          document.getElementById('due').value = '';
          this.grabStates();
        })
        .catch((err) => {
          alert(
            'Error: Something went wrong when trying to load the Data, make sure required fields are filled'
          );
        });
    }
  };

  render() {
    const showLists = this.state.lists.map((item) => (
      <DropdownItem id={item.id} key={item.id} onClick={this.chooseList}>
        {item.name}
      </DropdownItem>
    ));
    const showLabels = this.state.labels.map((label) => (
      <DropdownItem id={label.id} key={label.id} onClick={this.addLabel}>
        {label.name === '' ? label.color : label.name}
      </DropdownItem>
    ));
    return (
      <div
        style={{
          marginLeft: '10vw',
          width: '500px',
          border: 'solid black 0.5px',
          padding: '25px',
          boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)',
        }}
      >
        <div style={{}}>
          <h3 style={{ width: '100%' }}>Create New Card:</h3>
          <div
            style={{
              width: '400px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '25px',
            }}
          >
            <h5>Card Title:</h5>
            <p style={{ fontSize: '12px', fontStyle: 'italic' }}>
              {this.state.titleCount} amount of char left
            </p>
          </div>
          <input
            id="cardName"
            type="text"
            maxLength="50"
            style={{ width: '400px' }}
            placeholder="Card Title..."
            onChange={this.titleCount}
          ></input>

          <div
            style={{
              width: '400px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div
                style={{
                  width: '200px',
                  marginTop: '25px',
                }}
              >
                <h5>Select List:</h5>
              </div>
              <Dropdown isOpen={this.state.listToggle} toggle={this.toggleList}>
                <DropdownToggle caret className="btn btn-info">
                  {this.state.listName}
                </DropdownToggle>
                <DropdownMenu>{showLists}</DropdownMenu>
              </Dropdown>
            </div>

            <div>
              <div
                style={{
                  width: '200px',
                  marginTop: '25px',
                }}
              >
                <h5>Due Date:</h5>
              </div>
              <input id="due" type="date"></input>
            </div>
          </div>
          <div
            style={{
              width: '400px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '25px',
            }}
          >
            <h5>Card Description:</h5>
            <p style={{ fontSize: '12px', fontStyle: 'italic' }}>
              {this.state.descriptionCount} amount of char left
            </p>
          </div>
          <textarea
            id="cardDesc"
            maxLength="1000"
            style={{ minWidth: '400px', height: '125px' }}
            placeholder="Description..."
            onChange={this.descriptionCount}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: '200px',
                  marginTop: '25px',
                }}
              >
                <h5>Add Label:</h5>
              </div>
              <Dropdown
                isOpen={this.state.labelToggle}
                toggle={this.toggleLabel}
                style={{ width: '50%' }}
              >
                <DropdownToggle caret className="btn btn-info">
                  {this.state.labelName}
                </DropdownToggle>
                <DropdownMenu>{showLabels}</DropdownMenu>
              </Dropdown>
            </div>
            <Button
              color="success"
              style={{ alignSelf: 'flex-end', marginRight: '45px' }}
              onClick={this.submit}
              className="btn-lg"
            >
              Submit Card
            </Button>
          </div>
          <Toast
            isOpen={this.state.toast}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            <ToastHeader icon="success" toggle={this.toastToggle}>
              Card Submitted!
            </ToastHeader>
            <ToastBody>
              <p>
                New card has been added to your Trello Board! Make sure you head
                over to check it out!
              </p>
              {'\n'}
              <p style={{ fontStyle: 'bold' }}>{this.state.changes}</p>
            </ToastBody>
          </Toast>
        </div>
      </div>
    );
  }
}
