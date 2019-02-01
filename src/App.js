import React, { Component } from 'react';
import './App.css';
import { Input, Popover, Button, Tooltip, List, Avatar } from 'antd';
import getCaretCoordinates from 'textarea-caret';
import PromptTextarea from './PromptTextarea'

const { TextArea } = Input;

const base = {
  background: "#fff",
  color: "black",
  width: 200,
  height: 300,
  position: "absolute",
  display: "none",
  cursor: "pointer"
}

const data = [
  {
    title: 'User Name 1',
  },
  {
    title: 'User Name 3',
  },
  {
    title: 'User Name 4',
  },
  {
    title: 'User Name 2',
  },
];


class App extends Component {

  state = {
    visible: false,
    popoverStyle:{},
    value: "",
    v:""
  }

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  showList(v) {
    console.log("showList");
    
    //this.myRef.current.setSelectionRange(0, v.length);
    const element = document.getElementById("ref");
    // console.log(getCaretCoordinates)
    var caret = getCaretCoordinates(element, element.selectionEnd);

    console.log(element.offsetHeight);
    console.log('(top, left, height) = (%s, %s, %s)', caret.top, caret.left, element.height);
    this.setState({
      popoverStyle: {
        display: "block",
        top: caret.top,
        left: caret.left
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" >
          <p>fdsaufdsa</p>
          <p>fdsaufdsa</p>
          <p>fdsaufdsa</p>

          {/*<div style={{position:"relative"}}>
            <TextArea id="ref" 
              value={this.state.value}
              rows={4} onChange={e => {
                //console.log( e.target)
                const last = e.target.value.slice(-1);
                if (last === "@") {
                  this.showList(e.target.value);
                }
                this.setState({
                  value: e.target.value
                })
              }}/>
            
            <ul style={{...base, ...this.state.popoverStyle}}>
              {
                data.map( (item, key) => 
                  <li key={key} onClick={() => {
                    const { popoverStyle } = this.state;
                    this.setState({
                      popoverStyle: {...popoverStyle, display: "none"}
                    })

                    const { value } = this.state;
                    this.setState({
                      value: `${value}${item.title} `
                    })
                    const element = document.getElementById("ref");
                    element.focus();
                  }}>{item.title}</li>)
              }
            </ul>
          </div>*/}

          <PromptTextarea onSelect={item => console.log(item)}
            dataSource={data}
            onChange={v => {
              this.setState({
                v
              })
            }}
            value={this.state.v} />
            
        </header>
      </div>
    );
  }
}

export default App;
