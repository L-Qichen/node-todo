// this method use to find the home directory
const homedir = require('os').homedir();
// this method use to find the home variable (not only use to find home), 
// sometimes users may change their environment. SO, recommend to use the following one
const home = process.env.HOME || homedir;
const p = require('path'); // 操作系统不一样路径斜杠写法不一样，nodejs 提供path module根据系统自动拼接路径
const fs = require('fs');
const dbPath = p.join(home, '.todo');

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      // flag: a+ 参数会在 node.js 发现 home 目录没有相对应的文件时自动创建该文件
      // 更多详情请看 node.js 官网 fs 的 flag 参数文档    
      fs.readFile(dbPath, { flag: 'a+' }, (error, data) => {
        if (error) {
          return reject(error);
        }
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (NoDataErr) {
          list = [];
        };
        resolve(list);
      });
    });
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list);
      fs.writeFile(dbPath, string + '\n', (cannotStoreErr) => {
        if (cannotStoreErr) {
          return reject(cannotStoreErr);
        }
        resolve();
      });
    });
  }
}

module.exports = db;