const app = require('../server')
const chai = require('chai')
const chaiHttp = require('chai-http')
const spies = require('chai-spies')
const expect = chai.expect
chai.use(spies)
chai.use(chaiHttp)

describe('Express static', function () {
  it('Get request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(res => {
        expect(res).to.exist
        expect(res).to.have.status(200)
        expect(res).to.be.html
      })
  })
})

describe('404 handler', function () {
  it('should response with 404 when given a bad path', function () {
    const spy = chai.spy()
    return chai.request(app)
      .get('/bad/path')
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called()
      })
      .catch(err => {
        expect(err.response).to.have.status(404)
      })
  })
})

describe('Testing RESTful API endpoints', function () {
  it('should list all notes on GET "/v1/notes"', function () {
    const requiredKeys = ['id', 'title', 'content']
    return chai.request(app)
      .get('/v1/notes')
      .then(res => {
        expect(res).to.exist
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('array')
        res.body.forEach(note => {
          expect(note).to.have.keys(requiredKeys)
        })
      })
  })
  it('should list filtered notes based on search terms on GET "/v1/notes', function(){
    const query = {searchTerm:'about'}
    const requiredKeys = ['id','title','content']
    return chai.request(app)
      .get('/v1/notes')
      .query(query)
      .then(res => {
        expect(res).to.be.exist
        expect(res).to.be.json
        expect(res).to.have.status(200)
        res.body.forEach( note => {
          expect(note).to.have.keys(requiredKeys)
        })
      })
  })
  it('should retrive matched note on GET "/v1/notes/:id"', function() {
    const requiredKeys = ['id','title','content']
    const exampleId = 1000
    return chai.request(app)
      .get(`/v1/notes/${exampleId}`)
      .then(res => {
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body).to.have.keys(requiredKeys)
      })
  })
  it('should add item on POST', function(){
    const dummyItem = {title:'newItem', content:'newContent'}
    return chai.request(app)
      .post('/v1/notes')
      .send(dummyItem)
      .then(function(res){
        expect(res).to.have.status(201)
        expect(res).to.be.json
      })
  })
  it('shuld not be able to add an invalid item on POST', function() {
    const dummyItem = {title:'newItem'}
    return chai.request(app)
      .post('/v1/notes')
      .send(dummyItem)
      .catch(function(err){
        expect(err).to.have.status(400)
      })
  })
  it('should update item on PUT', function(){
    const updateData = {content:'newItem'}
    return chai.request(app)
      .get('/v1/notes')
      .then(res => {
        const mockReqData = res.body[0]
        return chai.request(app)
          .put(`/v1/notes/${mockReqData.id}`)
          .send(updateData)
      })
      .then(res => {
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('id')
        expect(res.body.content).to.equal('newItem')
      })
  })
  it('should response status 400 with invalid request on PUT', function(){
    const updateData ={yapooo: 'mybadf'}
    return chai.request(app)
      .get('/v1/notes')
      .then(res => {
        const mockReqData = res.body[0]
        return chai.request(app)
          .put(`/v1/notes/${mockReqData.id}`)
          .send(updateData)
      })
      .catch(err => {
        expect(err).to.have.status(400)
      })
  })

  it('should delete item on DELETE',function() {
    return chai.request(app)
      .get('/v1/notes')
      .then(res => {
        const id = res.body[0]
        return chai.request(app)
          .delete(`/v1/notes/${id}`)
      })
      .then(res => {
        expect(res).to.have.status(200)
      })
  })
})