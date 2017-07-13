const Dropbox = require('dropbox');
const log = require('~/utils/log');

function DropboxHelper(accessToken) {
  this.accessToken = accessToken || DropboxHelper.accessToken;
  this.dropbox = new Dropbox({ accessToken: this.accessToken });
}

DropboxHelper.prototype.save = function(path, contents, onResponse, onError) {
  this.dropbox.filesUpload({ path: '/' + path, contents: contents, mode: { ".tag":"overwrite" } })
    .then(response => {
      if(onResponse) onResponse(response);
    })
    .catch(err => {
      if(onError) onError(err);
    });
}

DropboxHelper.prototype.load = function(path, onResponse, onError) {
  this.dropbox.filesDownload({ path: '/' + path })
    .then(response => {
      if(onResponse) onResponse(response.fileBinary, response);
    })
    .catch(err => {
      if(onError) onError(err);
    });
}

module.exports = DropboxHelper;