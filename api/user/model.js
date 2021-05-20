const db = require('../../data/dbConfig.js')

module.exports = {
  insert,
  remove,
  getAll,
}

function getAll() {
  return db('user')
}

function insert(user) {
    return db('user').insert(user).then(id =>{
        return db('user').where('id',...id).first()
    })
}

function remove(id) {
  return db('user').where({id}).del()
}
