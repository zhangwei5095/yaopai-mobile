import Reflux from 'reflux'
import {
  storeIsDefined,
  storeHasData,
  storeHasMethod,
  storeCheckCommonUsage,
  storeHasDefaultValue,
  makeCheckStoreData,
  makeStoreHasMethod
}
from '../refluxTestHelpers'
import {
  expect
}
from 'chai'

import UserStore from '../../app/stores/UserStore'
import UserActions from '../../app/actions/UserActions'

describe('User Store Test', () => {
  const successfulRes = {
    Success: true,
    Result: [1, 2, 3]
  }

  const errorMsg = 'error message'

  const failedRes = {
    Success: false,
    ErrorMsg: errorMsg
  }

  const checkUserStoreData = makeCheckStoreData(UserStore)
  const userStoreHasMethod = makeStoreHasMethod(UserStore)

  const currentUserKey = 'yaopai_user'

  beforeEach(() => {
    UserStore.data = {
      hintMessage: '',
      flag: '',
      userId: '',
      userName: '',
      loginToken: '', //用户选择rememberme的时候返回
      userType: '',
      userState: '',
      isLogin: false,
      loginDate: '',
      userKey: currentUserKey
    }
  })

  it('has store', () => {
    storeIsDefined(UserStore)
    storeHasData(UserStore)
  })



  it('store has methods', () => {
    const methods = [
      'getTokenToLogin',
      'onLoginSuccess',
      'onLoginFailed',
      'onCurrentUser',
      'onGetCurrentUser',
      'onGetCurrentUserFailed',
      'onLoginWithTokenSuccess',
      'onLoginWithTokenFailed',
      'onRegisterSuccess',
      'onRegisterFailed',
      'onLogoutSuccess',
      'onModifyPasswordSuccess',
      'setCurrentUser',
      'onTelResetPassWordSuccess',
      'onTelResetPassWordFailed',
      'onreceiveTelResetPassWordSuccess',
      'onreceiveTelResetPassWordFailed'
    ]
    methods.forEach((method) => {
      userStoreHasMethod(method)
    })
  })

  describe('onreceiveTelResetPassWordFailed', () => {

    storeHasDefaultValue(UserStore)

    it('has right value after run', () => {
      UserStore.onreceiveTelResetPassWordFailed()
      expect(UserStore.data.hintMessage).to.equal('网络出错啦！')
      expect(UserStore.data.flag).to.equal('resetPassword')
    })
  })

  storeCheckCommonUsage(UserStore, 'onreceiveTelResetPassWordSuccess', 'resetPassword')

  describe('onTelResetPassWordFailed', () => {
    storeHasDefaultValue(UserStore)
    UserStore.onTelResetPassWordFailed()
    expect(UserStore.data.hintMessage).to.equal('网络出错啦！')
    expect(UserStore.data.flag).to.equal('check')
  })

  storeCheckCommonUsage(UserStore, 'onTelResetPassWordSuccess', 'check')

  describe('setCurrentUser', () => {
    it('set default vars when data is false', () => {

      const data = false
      storeHasData(UserStore, 'userId')

      expect(!data).to.equal(true)
      UserStore.setCurrentUser(data)

      const datas = {
        userId: '',
        userName: '',
        local: true,
        isLogin: false,
        userType: '',
        avatar: '',
        loginDate: ''
      }

      const keys = Object.keys(datas)
      keys.map(function(key) {
        checkUserStoreData(key, datas[key])
      })
    })

    describe('set data when data is true', () => {
      let data = {
        Id: '12',
        Name: 'fox',
        Type: 'user',
        Local: 'beijing'
      }

      it('will set normal props', () => {
        const datas = {
          userId: '12',
          userName: 'fox',
          userType: 'user',
          local: 'beijing',
          isLogin: true,
        }

        expect(!data).to.equal(false)
        UserStore.setCurrentUser(data)

        const keys = Object.keys(datas)
        keys.map((key) => {
          checkUserStoreData(key, datas[key])
        })

        storeHasData(UserStore, 'loginDate')
      })

      it('will give default avatar when does not return Avatar ', () => {
        expect(!data).to.equal(false)
        UserStore.setCurrentUser(data)

        expect(UserStore.data.avatar).to.match(/_randomAvatar/)
      })

      it('will load avatar when has Avatar', () => {
        data.Avatar = 'fox.png'
        expect(!data).to.equal(false)
        UserStore.setCurrentUser(data)

        checkUserStoreData('avatar', 'fox.png')
      })

    })
  })

  describe('onModifyPasswordSuccess', () => {
    it('works on successfulRes', () => {
      UserStore.onModifyPasswordSuccess(successfulRes)
      checkUserStoreData('hintMessage', '修改密码成功')
      checkUserStoreData('flag', 'modifyPassword')
    })

    it('works on failedRes', () => {
      UserStore.onModifyPasswordSuccess(failedRes)
      checkUserStoreData('hintMessage', errorMsg)
      checkUserStoreData('flag', 'modifyPassword')
    })
  })

  it('onLogoutSuccess', () => {
    // 设定虚拟LS的数据
    localStorage.setItem(currentUserKey, JSON.stringify({
      userName: 'fox name'
    }))
    expect(localStorage.getItem(currentUserKey)).to.exist
    // 运行方法
    UserStore.onLogoutSuccess()
    checkUserStoreData('isLogin', false)
    expect(localStorage.getItem(currentUserKey)).to.not.exist
    checkUserStoreData('flag', 'logout')
  })

  it('onRegisterFailed', () => {
    UserStore.onRegisterFailed()
    checkUserStoreData('hintMessage', '网络出错啦！')
    checkUserStoreData('flag', 'register')
  })

  storeCheckCommonUsage(UserStore, 'onRegisterSuccess', 'register')

  it('onLoginWithTokenFailed', () => {
    UserStore.onLoginWithTokenFailed()
    checkUserStoreData('hintMessage', '网络出错啦！')
    checkUserStoreData('flag', 'loginToken')
  })

  describe('onLoginWithTokenSuccess', () => {
    it('works on successfulRes', () => {
      expect(localStorage.getItem(currentUserKey)).to.not.exist
      UserStore.onLoginWithTokenSuccess(successfulRes)
      expect(localStorage.getItem(currentUserKey)).to.exist
    })

    it('works on failedRes', () => {
      expect(localStorage.getItem(currentUserKey)).to.exist

      UserStore.onLoginWithTokenSuccess(failedRes)
      checkUserStoreData('isLogin', false)
      checkUserStoreData('loginToken', '')
      expect(localStorage.getItem(currentUserKey)).to.not.exist
    })
  })

  it('onGetCurrentUserFailed', () => {
    UserStore.onGetCurrentUserFailed()
    checkUserStoreData('hintMessage', '网络出错啦！')
    checkUserStoreData('flag', 'currentUser')
  })

  it('onGetCurrentUser', () => {
    let spy = sinon.spy(UserStore, 'getTokenToLogin')
    expect(spy.callCount).to.equal(0)

    UserStore.onGetCurrentUser(successfulRes)
    checkUserStoreData('isLogin', true)
    checkUserStoreData('flag', 'currentUser')

    UserStore.onGetCurrentUser(failedRes)
    expect(spy.callCount).to.equal(1)
  })

  describe('onCurrentUser', () => {
    let spy = sinon.spy(UserStore, 'setCurrentUser')
    UserStore.setCurrentUser(successfulRes)
    const orgTime = new Date()

    // 6分钟后
    const sixMinsBefore = new Date().setTime(orgTime.getTime() - 6 * 60 * 1000)
    UserStore.data.loginDate = sixMinsBefore
    expect(parseInt((orgTime - sixMinsBefore) / 60000) <= 10).to.equal(true)
    checkUserStoreData('flag', 'check')
    UserStore.onCurrentUser()
    checkUserStoreData('flag', 'currentUser')
    expect(spy.callCount).to.equal(1)

    // 15分钟后
    const fifteenMinsBefore = new Date().setTime(orgTime.getTime() - 15 * 60 * 1000)
    UserStore.data.loginDate = fifteenMinsBefore
    UserStore.onCurrentUser()
    expect(spy.callCount).to.equal(1)
  })

  it('onLoginFailed', () => {
    UserStore.onLoginFailed()
    checkUserStoreData('hintMessage', '网络出错啦！')
    checkUserStoreData('flag', 'login')
  })

  describe('onLoginSuccess', () => {
    it('works on successfulRes', () => {
      expect(localStorage.getItem(currentUserKey)).to.equal(null)
      UserStore.onLoginSuccess(successfulRes)
      expect(localStorage.getItem(currentUserKey)).to.not.equal(null)
      checkUserStoreData('hintMessage', '')
    })

    it('works on failedRes', () => {
      UserStore.onLoginSuccess(failedRes)
      checkUserStoreData('hintMessage', errorMsg)
      checkUserStoreData('flag', 'login')
    })
  })

  describe('getTokenToLogin', () => {
    it('works on no localStorage', () => {
      localStorage.removeItem(currentUserKey)
      UserStore.getTokenToLogin()

      checkUserStoreData('isLogin', false)
      checkUserStoreData('hintMessage', '没有登录！')
      checkUserStoreData('flag', 'currentUser')
    })

    describe('works on has localStorage', () => {
      it('works on loginToken exist', () => {
        let spy = sinon.spy(UserActions, 'loginWithToken')
        checkUserStoreData('loginToken', '')
        checkUserStoreData('flag', '')
        UserStore.data.loginToken = ''
        // 没有想到如何测试成功的情况，只测失败的情况
        UserStore.getTokenToLogin()
        checkUserStoreData('flag', 'currentUser')
        checkUserStoreData('isLogin', false)

        // 成功情况
        // UserStore.data.loginToken = 'asdfwefds';
        // expect(spy.callCount).to.equal(0);
        
        // UserStore.getTokenToLogin();
        // expect(spy.callCount).to.equal(1);
      })
    })
  })
})