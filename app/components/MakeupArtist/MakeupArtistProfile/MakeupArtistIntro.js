import React from 'react'
import Reflux from 'reflux'
import ReactMixin from 'react-mixin'
import { History } from 'react-router'


import UserActions from '../../../actions/UserActions'
import UserStore from '../../../stores/UserStore'

import { ButtonAttention } from '../../UI/Button'
import {imgModifier} from '../../Tools'
import Toaster from '../../Toast'
import WechatShare from '../../Weixin/WechatShare'
import DocumentTitle from 'react-document-title'

import $ from 'jquery'

class MakeupArtistIntro extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      marks: 0,
    }
  }

  componentWillMount() {
    // UserActions.currentUser()
  }
  // 获取登录信息
  // onUserLoad(userData) {
  //   this.setState({ userData })
  // }



  showMessage (content) {
    this.refs.toast.show(content)
  }

  render() {
    const {data} = this.props

    return (
      <section className="grapherIntro">
        <Toaster ref="toast"/>

        <div className="baseInfo">
          <div className="avatar" style={{backgroundImage:`url('${data.avatar}')`}}>

          </div>
          <p className="nickname">{data.cityName}·<strong>{data.nickName}</strong></p>
          <p className="font_small"><i className="icon pencil" />&nbsp;{data.signature}</p>
        </div>

        {/* 化妆师标签 */
          data.tags.length ?
            (
              <ul className="tags">
                {data.tags.slice(0, 3).map((tag, index) => <li key={index}>{tag.Name}</li>)}
              </ul>
            )
          : null
        }

        <div className="order">
          <ul>
            <li><span className="count">{data.totalAlbums}</span>&nbsp;&nbsp;作品</li>
            <li><span className="count">{data.views}</span>&nbsp;&nbsp;访问</li>
            {
              data.marks !== undefined ?
              <li><span className="count">{data.marks + this.state.marks}</span>&nbsp;&nbsp;关注</li>
              :
              null
            }
          </ul>
        </div>
      </section>
    )
  }
}

ReactMixin.onClass(MakeupArtistIntro, History)

export default MakeupArtistIntro
