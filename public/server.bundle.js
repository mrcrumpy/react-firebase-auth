/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebase = __webpack_require__(12);

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('FB_APIKEY: ', process.env.FB_APIKEY);
console.log('FB_AUTHDOM: ', process.env.FB_AUTHDOM);
console.log('DATA_URL: ', process.env.FB_DATAURL);
console.log('FB_STORAGE: ', process.env.FB_STORAGE);
console.log('FB_MESS_SENDERID: ', process.env.FB_MESS_SENDERID);

var config = {
  apiKey: process.env.FB_APIKEY,
  authDomain: process.env.FB_AUTHDOM,
  databaseURL: process.env.FB_DATAURL,
  storageBucket: process.env.FB_STORAGE,
  messagingSenderId: process.env.FB_MESS_SENDERID
};

_firebase2.default.initializeApp(config);
var ref = _firebase2.default.database().ref();
var auth = _firebase2.default.auth();

var firebaseUtils = {
  createUser: function createUser(user) {
    auth.createUserWithEmailAndPassword(user.email, user.password).then(function (createdUser) {
      createdUser.updateProfile({
        displayName: user.name
      });
      ref = _firebase2.default.database().ref('users').child(createdUser.uid);
      ref.set({
        name: user.name
      });
    });
  },
  loginWithPW: function loginWithPW(user, cb, cbOnRegister) {
    auth.signInWithEmailAndPassword(user.email, user.password).catch(function (error) {
      // Handle Errors here.
      cb(error.code);
    }).then(function (authData) {
      firebaseUtils.onChange(true);
      if (cbOnRegister) {
        cb(authData);
        cbOnRegister(false);
      } else {
        cb(false);
      }
    });
  },
  loginWithGoogle: function loginWithGoogle(cb) {
    var provider = new _firebase2.default.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(function (error) {
      cb(error.code);
    }).then(function (authData) {
      ref = _firebase2.default.database().ref('users').child(authData.user.uid);
      ref.once('value').then(function (snapshot) {
        var isNewUser = !snapshot.exists();
        if (authData && isNewUser) {
          ref.set({
            name: authData.user.displayName
          }).catch(function (error) {
            console.log(error);
          });
        }
      });
      firebaseUtils.onChange(true);
      cb(false);
    });
  },
  loginWithFacebook: function loginWithFacebook(cb) {
    var provider = new _firebase2.default.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).catch(function (error) {
      cb(error.code);
    }).then(function (authData) {
      console.log(authData);
      ref = _firebase2.default.database().ref('users').child(authData.user.uid);
      ref.once('value').then(function (snapshot) {
        var isNewUser = !snapshot.exists();
        if (authData && isNewUser) {
          ref.set({
            name: authData.user.displayName
          }).catch(function (error) {
            console.log(error);
          });
        }
      });
      firebaseUtils.onChange(true);
      cb(false);
    }).catch(function (error) {
      console.log('Error:', error);
    });
  },
  isLoggedIn: function isLoggedIn(cb) {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        cb(true, user);
      } else {
        cb(false, null);
      }
    });
  },
  getCurrentUser: function getCurrentUser(cb) {
    auth.onAuthStateChanged(function (user) {
      cb(user);
    });
    return auth.currentUser;
  },
  logout: function logout() {
    _firebase2.default.auth().signOut().then(function () {
      firebaseUtils.onChange(false);
    }, function (error) {
      console.log(error);
    });
  }
};

exports.default = firebaseUtils;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(2);

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

var _authenticated = __webpack_require__(15);

var _authenticated2 = _interopRequireDefault(_authenticated);

var _Dashboard = __webpack_require__(7);

var _Dashboard2 = _interopRequireDefault(_Dashboard);

var _Login = __webpack_require__(8);

var _Login2 = _interopRequireDefault(_Login);

var _Logout = __webpack_require__(9);

var _Logout2 = _interopRequireDefault(_Logout);

var _Register = __webpack_require__(10);

var _Register2 = _interopRequireDefault(_Register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main(props, context) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props, context));

    _this.state = {
      loggedIn: false,
      currentUser: null,
      receivedData: false
    };
    return _this;
  }

  _createClass(Main, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      _firebaseUtils2.default.onChange = function () {
        _this2.setState({
          loggedIn: false
        });
      };
      _firebaseUtils2.default.isLoggedIn(function (loggedIn, currentUser) {
        _this2.setState({
          loggedIn: loggedIn,
          currentUser: currentUser,
          receivedData: true
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.state.receivedData === false) {
        return false;
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _reactRouter.Switch,
          null,
          _react2.default.createElement(_authenticated2.default, { exact: true, path: '/', authed: this.state.loggedIn, component: _Dashboard2.default, user: this.state.currentUser, setMessage: this.setMessage, sidebar: this.state.sidebar, setSidebarLeft: this.handleSwipeRight, setSidebarRight: this.handleSwipeLeft }),
          _react2.default.createElement(_reactRouter.Route, { path: '/login', render: function render() {
              return _react2.default.createElement(_Login2.default, { authed: _this3.state.loggedIn });
            } }),
          _react2.default.createElement(_reactRouter.Route, { path: '/register', component: _Register2.default }),
          _react2.default.createElement(_reactRouter.Route, { path: '/logout', component: _Logout2.default })
        )
      );
    }
  }]);

  return Main;
}(_react2.default.Component);

Main.propTypes = {};

exports.default = Main;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dashboard = function Dashboard() {
  return _react2.default.createElement(
    'div',
    null,
    ' Secured Route '
  );
};

exports.default = Dashboard;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(13);

var _reactRouterDom = __webpack_require__(14);

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login(props, context) {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props, context));

    _this.handleGoogle = _this.handleGoogle.bind(_this);

    _this.state = {
      error: false,
      redirectToReferrer: false
    };
    return _this;
  }

  _createClass(Login, [{
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this2 = this;

      e.preventDefault();
      var email = this.email.value;
      var pw = this.pw.value;
      _firebaseUtils2.default.loginWithPW({ email: email, password: pw }, function (err) {
        if (!err) {
          _this2.setState({ redirectToReferrer: true });
        } else {
          _this2.setState({ error: err });
        }
      });
    }
  }, {
    key: 'handleGoogle',
    value: function handleGoogle(e) {
      var _this3 = this;

      e.preventDefault();
      _firebaseUtils2.default.loginWithGoogle(function (err) {
        if (!err) {
          _this3.setState({ redirectToReferrer: true });
        } else {
          _this3.setState({ error: err });
        }
      });
    }
  }, {
    key: 'handleFacebook',
    value: function handleFacebook(e) {
      var _this4 = this;

      e.preventDefault();

      _firebaseUtils2.default.loginWithFacebook(function (err) {
        if (!err) {
          _this4.setState({ redirectToReferrer: true });
        } else {
          _this4.setState({ error: err });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      if (this.props.authed === true) return _react2.default.createElement(_reactRouterDom.Redirect, { to: '/' });

      var _ref = this.props.location.state || { from: { pathname: '/' } },
          from = _ref.from;

      var redirectToReferrer = this.state.redirectToReferrer;


      if (redirectToReferrer) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: from });
      }

      var errors = this.state.error ? _react2.default.createElement(
        'p',
        null,
        ' ',
        this.state.error,
        ' '
      ) : '';
      return _react2.default.createElement(
        'div',
        { className: 'grid-block align-center v-align' },
        _react2.default.createElement(
          'div',
          { className: 'grid-content small-12 medium-8 large-6 align-center' },
          _react2.default.createElement(
            'h1',
            { className: 'small-12' },
            ' Einloggen '
          ),
          _react2.default.createElement(
            'p',
            null,
            'Du hast noch kein Konto?'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { to: '/register' },
            'Jetzt registrieren'
          ),
          _react2.default.createElement(
            'div',
            { className: 'grid-block' },
            _react2.default.createElement(
              'div',
              { className: 'small-6 grid-content' },
              _react2.default.createElement(
                'button',
                { className: 'form-submit', onClick: this.handleGoogle },
                'Mit Google einloggen'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'small-6 grid-content text-right' },
              _react2.default.createElement(
                'button',
                { className: 'form-submit', onClick: this.handleFacebook },
                'Mit Facebook einloggen'
              )
            )
          ),
          _react2.default.createElement(
            'form',
            { className: 'small-12', onSubmit: this.handleSubmit },
            _react2.default.createElement('input', { ref: function ref(c) {
                _this5.email = c;
              }, type: 'text', placeholder: 'Email' }),
            _react2.default.createElement('input', { ref: function ref(c) {
                _this5.pw = c;
              }, type: 'password', placeholder: 'Password' }),
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'form-submit float-right' },
              'Einloggen'
            ),
            errors
          )
        )
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

Login.propTypes = {
  authed: _propTypes.bool,
  location: (0, _propTypes.shape)({
    pathname: _propTypes.string,
    state: (0, _propTypes.shape)({
      from: _propTypes.string
    })
  })
};

Login.defaultProps = {
  authed: false,
  location: {}
};

Login.contextTypes = {};

exports.default = Login;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(2);

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Logout = function (_React$Component) {
  _inherits(Logout, _React$Component);

  function Logout() {
    _classCallCheck(this, Logout);

    return _possibleConstructorReturn(this, (Logout.__proto__ || Object.getPrototypeOf(Logout)).apply(this, arguments));
  }

  _createClass(Logout, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _firebaseUtils2.default.logout();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactRouter.Redirect, { to: { pathname: '/login', state: { message: 'you are now logged out!' } } });
    }
  }]);

  return Logout;
}(_react2.default.Component);

exports.default = Logout;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Register = function (_React$Component) {
  _inherits(Register, _React$Component);

  function Register(props, context) {
    _classCallCheck(this, Register);

    var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, props, context));

    _this.handleSubmit = _this.handleSubmit.bind(_this);

    _this.state = {
      error: false
    };
    return _this;
  }

  _createClass(Register, [{
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this2 = this;

      e.preventDefault();
      var email = this.email.value;
      var pw = this.pw.value;
      var prename = this.prename.value;
      var name = this.name.value;
      _firebaseUtils2.default.createUser({ name: prename + ' ' + name, email: email, password: pw }, function (err) {
        if (!err) {
          _this2.context.router.replace('/');
        } else {
          _this2.setState({ error: err });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var errors = this.state.error ? _react2.default.createElement(
        'p',
        null,
        ' ',
        this.state.error,
        ' '
      ) : '';
      return _react2.default.createElement(
        'div',
        { className: 'grid-block align-center v-align' },
        _react2.default.createElement(
          'div',
          { className: 'grid-content small-12 medium-8 large-6 align-center' },
          _react2.default.createElement(
            'h1',
            null,
            ' Register '
          ),
          _react2.default.createElement(
            'p',
            null,
            'Du hast schon ein CookSpace Konto?'
          ),
          _react2.default.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement(
                'label',
                { htmlFor: 'vorname' },
                ' Vorname '
              ),
              _react2.default.createElement('input', { id: 'vorname', type: 'text', className: 'form-control', ref: function ref(c) {
                  _this3.prename = c;
                }, placeholder: 'Vorname', required: true })
            ),
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement(
                'label',
                { htmlFor: 'nachname' },
                ' Nachname '
              ),
              _react2.default.createElement('input', { id: 'nachname', type: 'text', className: 'form-control', ref: function ref(c) {
                  _this3.name = c;
                }, placeholder: 'Nachname', required: true })
            ),
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement(
                'label',
                { htmlFor: 'email' },
                ' Email '
              ),
              _react2.default.createElement('input', { id: 'email', type: 'text', className: 'form-control', ref: function ref(c) {
                  _this3.email = c;
                }, placeholder: 'Email', required: true })
            ),
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement(
                'label',
                { htmlFor: 'password' },
                'Password'
              ),
              _react2.default.createElement('input', { id: 'password', ref: function ref(c) {
                  _this3.pw = c;
                }, type: 'password', className: 'form-control', placeholder: 'Password', required: true })
            ),
            errors,
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'form-submit float-right' },
              'Register'
            )
          )
        )
      );
    }
  }]);

  return Register;
}(_react2.default.Component);

exports.default = Register;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _http = __webpack_require__(5);

var _express = __webpack_require__(4);

var _express2 = _interopRequireDefault(_express);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(6);

var _reactRouter = __webpack_require__(2);

var _Main = __webpack_require__(3);

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = ['/', '/login', '/register'];

var app = new _express2.default();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(_express2.default.static('public'));

app.get('*', function (req, res) {
  var match = routes.reduce(function (acc, route) {
    return (0, _reactRouter.matchPath)(req.url, route, { exact: true }) || acc;
  }, null);
  var context = {};
  if (!match) {
    return res.status(404).send((0, _server.renderToString)(_react2.default.createElement(NotFoundPage, null)));
  }
  var markup = (0, _server.renderToString)(_react2.default.createElement(
    _reactRouter.StaticRouter,
    { context: context, location: req.url },
    _react2.default.createElement(_Main2.default, null)
  ));
  if (context.url) {
    return res.redirect(302, context.url);
  }
  return res.render('index', { markup: markup });
});

var port = process.env.PORT || 3000;
var server = new _http.Server(app);

server.listen(port, function (err) {
  if (err) {
    return false;
  }
  return true;
});

var NotFoundPage = function NotFoundPage() {
  return _react2.default.createElement(
    'div',
    { className: 'not-found' },
    _react2.default.createElement(
      'h1',
      null,
      '404'
    ),
    _react2.default.createElement(
      'h2',
      null,
      'Page not found!'
    ),
    _react2.default.createElement(
      'p',
      null,
      _react2.default.createElement(
        _reactRouter.Link,
        { to: '/' },
        'Go back to the main page'
      )
    )
  );
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("firebase");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function PrivateRoute(_ref) {
  var Component = _ref.component,
      authed = _ref.authed,
      rest = _objectWithoutProperties(_ref, ['component', 'authed']);

  return _react2.default.createElement(_reactRouter.Route, _extends({}, rest, {
    render: function render(props) {
      return authed ? _react2.default.createElement(Component, _extends({}, props, rest)) : _react2.default.createElement(_reactRouter.Redirect, { to: { pathname: '/login', state: { from: props.location } } });
    }
  }));
}

exports.default = PrivateRoute;

/***/ })
/******/ ]);
//# sourceMappingURL=server.bundle.js.map