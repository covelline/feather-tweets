'use strict';

var fs = require("fs");
var glob = require("glob");
var _ = require("underscore");
var async = require("async");
var Twitter = require("twitter");

var twitter_config = {
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET,
};

if (_.some(_.values(twitter_config), function(v) {
  return _.negate(_.isString(v)) && _.isEmpty(v);
}) ) {

  console.error("Twitter の認証情報が設定されていません.");
  process.exit(1);
}

var client = new Twitter(twitter_config);

/// `tweets` ディレクトリの中からランダムに1つディレクトリを選ぶ
var selectDirectory = function(cb) {
  // `tweets/*/` で `tweets` の中にあるディレクトリにだけマッチ
  glob("tweets/*/", {realpath: true}, function(err, dirs) {

    if (err) {
      cb(err);
    } else {
      var dir = _.sample(dirs);
      console.log("select: " + dir);
      cb(null, dir);
    }
  });
}

// `dir` の中の情報を使って Tweet する
var uploadImages = function(dir, cb) {

  glob(dir + "/*.{jpg,png}", {realpath: true}, function(err, files) {

    var tasks = _.map(files, function(f) {

      return async.apply(function(callback) {

        console.log("Upload image: " + f);
        var data = require('fs').readFileSync(f);
        client.post('media/upload',  {media: data},  function(error,  media,  response){
          if (error) {
            console.error("error:", error, ", file:", f);
          } else {
            console.log("success: media_id_string =", media.media_id_string, ", file:" , f);
          }
          callback(error, media.media_id_string);
        });
      });
    });

    async.series(tasks, function(err, results){
      cb(err, dir, results);
    });
  });
}

var tweet = function(dir, media_ids,  cb) {
  glob(dir + "/tweet.txt", {realpath: true}, function(err, files) {
    if (err) {
      return cb(err, null);
    }

    var media_ids_string =  media_ids.join(",");
    var text = "";

    if (_.isEmpty(files) === false) {
      text = fs.readFileSync(_.head(files), "utf-8");
    }

    var status = {
      status: text
    }

    if (_.isEmpty(media_ids) === false) {
      status["media_ids"] = media_ids_string;
    }

    console.log("tweet:", status);

    client.post('statuses/update', status, function(error, tweet, response){
      if (error) {
        console.error(error);
      } else {
        console.log("success:", tweet);
      }
      cb(error, tweet);
    });
  });
}

async.waterfall([
  function(cb) {
    selectDirectory(cb);
  },
  function(dir, cb) {
    uploadImages(dir, cb);
  },
  function(dir, ids, cb) {
    tweet(dir, ids, cb);
  }

], function(err, result) {
});


