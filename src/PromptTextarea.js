import React, {Component} from 'react';
import * as PropTypes from 'prop-types';
// import classNames from 'classnames';
import getCaretCoordinates from 'textarea-caret';
import keycodes from 'keycodes';
import { Input, Popover, Button, Tooltip, List, Avatar } from 'antd';
import './index.css'

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
    value: "",
    currentSelectIndex: -1
  }

  static propTypes = {
    onSelect: PropTypes.func,
    onShowSelect: PropTypes.func,
    onChange: PropTypes.func,
    row: PropTypes.number,
    autosize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    dataSource: PropTypes.array,
    value: PropTypes.any
  }

  static getDerivedStateFromProps(props, state) {
    //console.log(props, state);
    if ('value' in props) {
      const { value } = props
      return {...state, value}
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.menuRef = React.createRef();
  }

  getClassName() {
    const { className } = this.props;
    return className;
  }

  getItemClassName(index) {
    const { currentSelectIndex } = this.state;
    //console.log(index, currentSelectIndex);

    if (index === currentSelectIndex) {
      return `item itemSelected`
    }
    return "item";
  }

  showList(v) {
    // console.log("showList");
    // const element = document.getElementById(this.state.elementId);
    this.menuRef.current.focus();

    const { onShowSelect } = this.props;
    if (onShowSelect) {
      onShowSelect();
    }

    const { textAreaRef } = this.ref.current;
    //textAreaRef.blur();
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

  validateIndex(index) {
    const { dataSource = [] } = this.props;
    const max = dataSource.length;
    const min = 0;
    return Math.max(Math.min(index, max), min);
  }

  onKeyHandle(e) {
    // console.log(e)
    // console.log(e.keyCode, keycodes('down'));
    console.log(e, this.state)
    const { currentSelectIndex } = this.state;
    
    let newIndex;
    if (e.keyCode === keycodes('down')) {
      newIndex = currentSelectIndex + 1;
      newIndex = this.validateIndex(newIndex);
      this.setState({
        currentSelectIndex: newIndex
      })
    }

    if (e.keyCode === keycodes('up')) {
      newIndex = currentSelectIndex - 1;
      newIndex = this.validateIndex(newIndex);
      this.setState({
        currentSelectIndex: newIndex
      })
    }

    if (e.keyCode === keycodes('enter')) {
      const { dataSource = [] } = this.props;
      const selectedItem = dataSource[currentSelectIndex];
      if (!selectedItem) {
        return;
      }
      this.choosePromptItem(selectedItem);
    }
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      value
    });
  }

  choosePromptItem(item) {
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
  }

  applyText(text) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(text);
    } else {
      this.setState({
        value: text
      })
    }
  }
  renderSelectList() {
    const { dataSource = [] } = this.props;

    return <div ref={this.menuRef}
       style={{...base, ...this.state.popoverStyle}}>
      <ul>
      {
        dataSource.map( (item, key) => 
          <li className={this.getItemClassName(key)}
            key={key} onClick={() => {
              this.choosePromptItem(item);
            }}>{item.title}</li>)
      }
    </ul>
    </div>
  }

  render() {
    return <div style={{position:"relative"}} onKeyDown={this.onKeyHandle.bind(this)}>
            <TextArea ref={this.ref} 
              value={this.state.value}
              rows={4} onChange={e => {
                //console.log( e.target)
                const last = e.target.value.slice(-1);
                if (last === "@") {
                  this.showList(e.target.value);
                }
                if (last === '\n') {
                  const text = e.target.value;
                  const removeTailText = text.substring(0, text.length - 1);                  
                  this.applyText(removeTailText);
                  return;
                }
                this.applyText(e.target.value);
              }}/>
            
            {this.renderSelectList()}
          </div>
  }
}
