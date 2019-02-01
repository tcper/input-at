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
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    dataSource: PropTypes.array,
    value: PropTypes.any
  }

  static getDerivedStateFromProps(props, state) {
    //console.log(props, state);
    if ('value' in props) {
      const { value } = props;
      return {...state, value}
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  getClassName() {
    const { className } = this.props;
    return className;
  }

  showList(v) {
    // console.log("showList");
    // const element = document.getElementById(this.state.elementId);
    const { textAreaRef } = this.ref.current;
    var caret = getCaretCoordinates(textAreaRef, textAreaRef.selectionEnd);
    // console.log(element.offsetHeight);
    // console.log('(top, left, height) = (%s, %s, %s)', caret.top, caret.left, element.height);
    this.setState({
      popoverStyle: {
        display: "block",
        top: caret.top,
        left: caret.left
      }
    })
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      value
    });
  }

  renderSelectList() {
    const { dataSource = [] } = this.props;

    return <ul style={{...base, ...this.state.popoverStyle}}>
      {
        dataSource.map( (item, key) => 
          <li key={key} onClick={() => {
            const { popoverStyle, value } = this.state;
            this.setState({
              popoverStyle: {...popoverStyle, display: "none"}
            })
            const { onChange, onSelect } = this.props;
            if (onSelect) {
              onSelect(item);
            }

            const newText = `${value}${item.title} `;
            if (onChange) {
              onChange(newText);
            } else {
              const { value } = this.state;
              this.setState({
                value: newText
              })
            }
            
            this.ref.current.focus();
          }}>{item.title}</li>)
      }
    </ul>
  }

  render() {
    return <div style={{position:"relative"}}>
            <TextArea ref={this.ref} 
              value={this.state.value}
              rows={4} onChange={e => {
                //console.log( e.target)
                const last = e.target.value.slice(-1);
                if (last === "@") {
                  this.showList(e.target.value);
                }
                const { onChange } = this.props;
                if (onChange) {
                  onChange(e.target.value);
                } else {
                  this.setState({
                    value: e.target.value
                  })
                }
              }}/>
            
            {this.renderSelectList()}
          </div>
  }
}
