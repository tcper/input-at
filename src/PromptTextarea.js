import React, {Component} from 'react';
import { Input, Popover, Button, Tooltip, List, Avatar } from 'antd';
import getCaretCoordinates from 'textarea-caret';
import * as PropTypes from 'prop-types';

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

export default class PromptTextarea extends React.Component {
  state = {
    visible: false,
    popoverStyle:{},
    value: ""
  }

  static propTypes = {
    type: PropTypes.string,
    shape: PropTypes.oneOf(ButtonShapes),
    size: PropTypes.oneOf(ButtonSizes),
    htmlType: PropTypes.oneOf(ButtonHTMLTypes),
    onClick: PropTypes.func,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.bool,
  };

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
    return <div style={{position:"relative"}}>
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
          </div>
;
  }
}
