var debug = require('debug')('crowi:lib:middlewares')
  ;

exports.loginChecker = function(app, models) {
  return function(req, res, next) {
    // session に user object が入ってる
    if (req.session.user && '_id' in req.session.user) {
      models.User.findById(req.session.user._id, function(err, userData) {
        if (err) {
          next()
        } else {
          req.user = req.session.user = userData;
          res.locals({user: req.user});
          next();
        }
      });
    } else {
      req.user = req.session.user = false;
      res.locals({user: req.user});
      next();
    }
  };
};

exports.swigFunctions = function(app) {
  return function(req, res, next) {
    res.locals(require('../lib/swigFunctions')(app));
    next();
  };
};

exports.swigFilters = function(app, swig) {
  return function(req, res, next) {

    swig.setFilter('path2name', function(string) {
      return string.replace(/.+\/(.+)?$/, '$1');
    });

    swig.setFilter('datetz', function(input, format) {
      // timezone
      var swigFilters = require('swig/lib/filters')
      return swigFilters.date(input, format, app.get('tzoffset'));
    });

    swig.setFilter('presentation', function(string) {
      // 手抜き
      return string.replace(/[\n]+#/g, '\n\n\n#');
    });

    swig.setFilter('picture', function(user) {
      if (!user) {
        return '';
      }

      user.fbId = user.userId; // migration
      if (user.image && user.image != '/images/userpicture.png') {
        return user.image;
      } else if (user.fbId) {
        return '//graph.facebook.com/' + user.fbId + '/picture?size=square';
      } else {
        return '/images/userpicture.png';
      }
    });

    next();
  };
};

exports.adminRequired = function() {
  return function(req, res, next) {
    if (req.user && '_id' in req.user) {
      if (req.user.admin) {
        next();
        return;
      }
      return res.redirect('/');
    }
    return res.redirect('/login');
  };
};

exports.loginRequired = function() {
  return function(req, res, next) {
    if (req.user && '_id' in req.user) {
      // TODO 移行おわったら削除
      if (req.user.email && !req.user.password && req.route.path != '/me/password') {
        return res.redirect('/me/password');
      }

      return next();
    }
    req.session.jumpTo = req.originalUrl;
    return res.redirect('/login');
  };
};

// this is for Installer
exports.applicationNotInstalled = function() {
  return function(req, res, next) {
    var config = req.config;

    if (Object.keys(config.crowi).length !== 0) {
      return res.render('500', { error: 'Application already installed.' });
    }

    return next();
  };
};

exports.applicationInstalled = function() {
  return function(req, res, next) {
    var config = req.config;

    if (Object.keys(config.crowi).length == 0) {
      return res.redirect('/installer');
    }

    return next();
  };
};
