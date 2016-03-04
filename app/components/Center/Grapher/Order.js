'use strict';
import React from 'react';

import WeuiNavbar from '../../UI/WeuiNavbar';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      navList: [{
        text: '待付款',
        href: '/center/g/order/unpayed'
      },{
        text: '待确认',
        href: '/center/g/order/unconfirmed'
      },{
        text: '进行中',
        href: '/center/g/order/ongoing'
      },{
        text: '已完成',
        href: '/center/g/order/completed'
      },{
        text: '已关闭',
        href: '/center/g/order/closed'
      }]
    }
  }
  render() {
    return (
      <div className="weui_tab">
        <WeuiNavbar list={this.state.navList}>
        </WeuiNavbar>
        <div className="weui_tab_bd">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export { Order as default };