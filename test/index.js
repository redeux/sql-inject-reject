const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const request = require('supertest');
const express = require('express');
const sqlInjectReject = require('..');

const expect = chai.expect;

const paranoidApp = express();
const elevatedApp = express();
const typicalApp = express();
const silentApp = express();
const defaultApp = express();
const keywordsApp = express();

describe('Basic Operations', () => {
  it('Is a function', (done) => {
    expect(sqlInjectReject).to.be.a('function');
    done();
  });

  it('Returns function on load', (done) => {
    expect(sqlInjectReject({level: 'typical'})).to.be.a('function');
    done();
  });
});

describe('Integration Tests: Paranoid', () => {
  before((done) => {
    paranoidApp.use(sqlInjectReject({
      level: 'paranoid',
    }));
    paranoidApp.get('/get/:id', (req, res) => {
      res.status(200).send('OK');
    });
    paranoidApp.get('/get', (req, res) => {
      res.status(200).send('OK');
    });
    paranoidApp.post('/post', (req, res) => {
      res.status(200).send('OK');
    });
    done();
  });

  after((done) => {
    done();
  });

  it('Responds to a naked GET request with status code 200', (done) => {
    request(paranoidApp).get('/get').expect(200, done);
  });

  it('Responds to a GET with a querystring containing no sql with status code 200', (done) => {
    request(paranoidApp).get('/get?query=sometext').expect(200, done);
  });

  it('Responds to a GET with parameters and no sql with status code 200', (done) => {
    request(paranoidApp).get('/get/xiv').expect(200, done);
  });

  it('Responds to a POST with a body that doesn\'t contain sql with status code 200', (done) => {
    request(paranoidApp).post('/post').send({
      foo: 'bar',
    }).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' with status code 403', (done) => {
    request(paranoidApp).get('/get?query user\'').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing %27 with status code 403', (done) => {
    request(paranoidApp).get('/get?query  user%27').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing -- with status code 403', (done) => {
    request(paranoidApp).get('/get?query user--').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing # with status code 403', (done) => {
    request(paranoidApp).get('/get?query' + escape('user#')).expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing %23 with status code 403', (done) => {
    request(paranoidApp).get('/get?query user\%23').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by \' with status code 403', (done) => {
    request(paranoidApp).get('/get?query= user\'').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %27 with status code 403', (done) => {
    request(paranoidApp).get('/get?query= user%27').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by -- with status code 403', (done) => {
    request(paranoidApp).get('/get?query= user--').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by ; with status code 403', (done) => {
    request(paranoidApp).get('/get?query= user;').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %3B with status code 403', (done) => {
    request(paranoidApp).get('/get?query= user\%3B').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by upper case OR with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' OR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by lower case or with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' or').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by mixed case oR with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' oR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by o%52 with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' o%52').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by %4Fr with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' %4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by UNION with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' UNION').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by SELECT with status code 403', (done) => {
    request(paranoidApp).get('/get?queryuser\' SELECT').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' with status code 403', (done) => {
    request(paranoidApp).get('/get/ user\'').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing %27 with status code 403', (done) => {
    request(paranoidApp).get('/get/ user%27').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing -- with status code 403', (done) => {
    request(paranoidApp).get('/get/ user--').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing # with status code 403', (done) => {
    request(paranoidApp).get('/get/' + escape('user#')).expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing %23 with status code 403', (done) => {
    request(paranoidApp).get('/get/  user%23').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by \' with status code 403', (done) => {
    request(paranoidApp).get('/get/query= user\'').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %27 with status code 403', (done) => {
    request(paranoidApp).get('/get/query= user%27').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by -- with status code 403', (done) => {
    request(paranoidApp).get('/get/query= user--').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by ; with status code 403', (done) => {
    request(paranoidApp).get('/get/query= user;').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %3B with status code 403', (done) => {
    request(paranoidApp).get('/get/query= user\%3B').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by upper case OR with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' OR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by lower case or with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' or').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by mixed case oR with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' oR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by o%52 with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' o%52').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by %4Fr with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' %4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by UNION with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' UNION').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by SELECT with status code 403', (done) => {
    request(paranoidApp).get('/get/queryuser\' SELECT').expect(403, done);
  });

  it('Responds to a POST with a body containing \' with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '  \'text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing %27 with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '  %27text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing -- with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '  --text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing # with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: ' #text ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing %23 with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: ' %23text ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by \' with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '=  \'text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by %27 with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '=  %27text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by -- with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '=  --text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by ; with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '=  text;  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by %3B with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '=  text %3B ',
    }).expect(403, done);
  });


  it('Responds to a POST with a body containing \' followed by lower case or with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\'  textor  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by upper case OR with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\' textOR  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by mixed case oR with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\'  textoR  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by o%52 with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\'  texto%52  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by %4Fr with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\'  text%4Fr  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by UNION with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\'  textUNION  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by SELECT with status code 403', (done) => {
    request(paranoidApp).post('/post').send({
      input: '\'  textSELECT  ',
    }).expect(403, done);
  });
});

describe('Integration Tests: Elevated', () => {
  before((done) => {
    elevatedApp.use(sqlInjectReject({
      level: 'elevated',
    }));
    elevatedApp.get('/get/:id', (req, res) => {
      res.status(200).send('OK');
    });
    elevatedApp.get('/get', (req, res) => {
      res.status(200).send('OK');
    });
    elevatedApp.post('/post', (req, res) => {
      res.status(200).send('OK');
    });
    elevatedApp.put('/put', (req, res) => {
      res.status(200).send('OK');
    });
    elevatedApp.delete('/delete', (req, res) => {
      res.status(200).send('OK');
    });
    done();
  });

  after((done) => {
    done();
  });

  it('Responds to a naked GET request with status code 200', (done) => {
    request(elevatedApp).get('/get').expect(200, done);
  });

  it('Responds to a GET with a querystring containing no sql with status code 200', (done) => {
    request(elevatedApp).get('/get?query=sometext').expect(200, done);
  });

  it('Responds to a GET with parameters and no sql with status code 200', (done) => {
    request(elevatedApp).get('/get/xiv').expect(200, done);
  });

  it('Responds to a POST with a body that doesn\'t contain sql with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      foo: 'bar',
    }).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' with status code 403', (done) => {
    request(elevatedApp).get('/get?query user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %27 with status code 200', (done) => {
    request(elevatedApp).get('/get?query  user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing -- with status code 200', (done) => {
    request(elevatedApp).get('/get?query user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing # with status code 200', (done) => {
    request(elevatedApp).get('/get?query' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %23 with status code 200', (done) => {
    request(elevatedApp).get('/get?query user\%23').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by \' with status code 403', (done) => {
    request(elevatedApp).get('/get?query= user\'').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %27 with status code 403', (done) => {
    request(elevatedApp).get('/get?query= user%27').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by -- with status code 403', (done) => {
    request(elevatedApp).get('/get?query= user--').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by ; with status code 403', (done) => {
    request(elevatedApp).get('/get?query= user;').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %3B with status code 403', (done) => {
    request(elevatedApp).get('/get?query= user\%3B').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by upper case OR with status code 403', (done) => {
    request(elevatedApp).get('/get?queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by lower case or with status code 403', (done) => {
    request(elevatedApp).get('/get?queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by mixed case oR with status code 403', (done) => {
    request(elevatedApp).get('/get?queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by o%52 with status code 403', (done) => {
    request(elevatedApp).get('/get?queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by %4Fr with status code 403', (done) => {
    request(elevatedApp).get('/get?queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by UNION with status code 200', (done) => {
    request(elevatedApp).get('/get?queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by SELECT with status code 200', (done) => {
    request(elevatedApp).get('/get?queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' with status code 200', (done) => {
    request(elevatedApp).get('/get/ user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %27 with status code 200', (done) => {
    request(elevatedApp).get('/get/ user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing -- with status code 200', (done) => {
    request(elevatedApp).get('/get/ user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing # with status code 200', (done) => {
    request(elevatedApp).get('/get/' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %23 with status code 200', (done) => {
    request(elevatedApp).get('/get/  user%23').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by \' with status code 403', (done) => {
    request(elevatedApp).get('/get/query= user\'').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %27 with status code 403', (done) => {
    request(elevatedApp).get('/get/query= user%27').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by -- with status code 403', (done) => {
    request(elevatedApp).get('/get/query= user--').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by ; with status code 403', (done) => {
    request(elevatedApp).get('/get/query= user;').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %3B with status code 403', (done) => {
    request(elevatedApp).get('/get/query= user\%3B').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by upper case OR with status code 403', (done) => {
    request(elevatedApp).get('/get/queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by lower case or with status code 403', (done) => {
    request(elevatedApp).get('/get/queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by mixed case oR with status code 403', (done) => {
    request(elevatedApp).get('/get/queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by o%52 with status code 403', (done) => {
    request(elevatedApp).get('/get/queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by %4Fr with status code 403', (done) => {
    request(elevatedApp).get('/get/queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by UNION with status code 200', (done) => {
    request(elevatedApp).get('/get/queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by SELECT with status code 200', (done) => {
    request(elevatedApp).get('/get/queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a POST with a body containing \' with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: '  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %27 with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: '  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing -- with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: '  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing # with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: ' #text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %23 with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: ' %23text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by \' with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '=  \'text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by %27 with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '=  %27text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by -- with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '=  --text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by ; with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '=  text;  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing = followed by %3B with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '=  text %3B ',
    }).expect(403, done);
  });


  it('Responds to a POST with a body containing \' followed by lower case or with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'or  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by upper case OR with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'OR text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by mixed case oR with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'oR  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by o%52 with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'o%52  texto  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by %4Fr with status code 403', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'%4Fr  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by UNION with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'UNION  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by SELECT with status code 200', (done) => {
    request(elevatedApp).post('/post').send({
      input: '\'SELECT  text  ',
    }).expect(200, done);
  });
});

describe('Integration Tests: Typical', () => {
  before((done) => {
    typicalApp.use(sqlInjectReject({
      level: 'typical',
    }));
    typicalApp.get('/get/:id', (req, res) => {
      res.status(200).send('OK');
    });
    typicalApp.get('/get', (req, res) => {
      res.status(200).send('OK');
    });
    typicalApp.post('/post', (req, res) => {
      res.status(200).send('OK');
    });
    typicalApp.put('/put', (req, res) => {
      res.status(200).send('OK');
    });
    typicalApp.delete('/delete', (req, res) => {
      res.status(200).send('OK');
    });
    done();
  });

  after((done) => {
    done();
  });

  it('Responds to a naked GET request with status code 200', (done) => {
    request(typicalApp).get('/get').expect(200, done);
  });

  it('Responds to a GET with a querystring containing no sql with status code 200', (done) => {
    request(typicalApp).get('/get?query=sometext').expect(200, done);
  });

  it('Responds to a GET with parameters and no sql with status code 200', (done) => {
    request(typicalApp).get('/get/xiv').expect(200, done);
  });

  it('Responds to a POST with a body that doesn\'t contain sql with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      foo: 'bar',
    }).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' with status code 200', (done) => {
    request(typicalApp).get('/get?query user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %27 with status code 200', (done) => {
    request(typicalApp).get('/get?query  user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing -- with status code 200', (done) => {
    request(typicalApp).get('/get?query user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing # with status code 200', (done) => {
    request(typicalApp).get('/get?query' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %23 with status code 200', (done) => {
    request(typicalApp).get('/get?query user\%23').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by \' with status code 200', (done) => {
    request(typicalApp).get('/get?query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %27 with status code 200', (done) => {
    request(typicalApp).get('/get?query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by -- with status code 200', (done) => {
    request(typicalApp).get('/get?query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by ; with status code 200', (done) => {
    request(typicalApp).get('/get?query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %3B with status code 200', (done) => {
    request(typicalApp).get('/get?query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by upper case OR with status code 403', (done) => {
    request(typicalApp).get('/get?queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by lower case or with status code 403', (done) => {
    request(typicalApp).get('/get?queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by mixed case oR with status code 403', (done) => {
    request(typicalApp).get('/get?queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by o%52 with status code 403', (done) => {
    request(typicalApp).get('/get?queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by %4Fr with status code 403', (done) => {
    request(typicalApp).get('/get?queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by UNION with status code 200', (done) => {
    request(typicalApp).get('/get?queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by SELECT with status code 200', (done) => {
    request(typicalApp).get('/get?queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' with status code 200', (done) => {
    request(typicalApp).get('/get/ user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %27 with status code 200', (done) => {
    request(typicalApp).get('/get/ user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing -- with status code 200', (done) => {
    request(typicalApp).get('/get/ user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing # with status code 200', (done) => {
    request(typicalApp).get('/get/' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %23 with status code 200', (done) => {
    request(typicalApp).get('/get/  user%23').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by \' with status code 200', (done) => {
    request(typicalApp).get('/get/query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %27 with status code 200', (done) => {
    request(typicalApp).get('/get/query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by -- with status code 200', (done) => {
    request(typicalApp).get('/get/query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by ; with status code 200', (done) => {
    request(typicalApp).get('/get/query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %3B with status code 200', (done) => {
    request(typicalApp).get('/get/query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by upper case OR with status code 403', (done) => {
    request(typicalApp).get('/get/queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by lower case or with status code 403', (done) => {
    request(typicalApp).get('/get/queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by mixed case oR with status code 403', (done) => {
    request(typicalApp).get('/get/queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by o%52 with status code 403', (done) => {
    request(typicalApp).get('/get/queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by %4Fr with status code 403', (done) => {
    request(typicalApp).get('/get/queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by UNION with status code 200', (done) => {
    request(typicalApp).get('/get/queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by SELECT with status code 200', (done) => {
    request(typicalApp).get('/get/queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a POST with a body containing \' with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %27 with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing -- with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing # with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: ' #text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %23 with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: ' %23text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by \' with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '=  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %27 with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '=  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by -- with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '=  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by ; with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '=  text;  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %3B with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '=  text %3B ',
    }).expect(200, done);
  });


  it('Responds to a POST with a body containing \' followed by lower case or with status code 403', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'or  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by upper case OR with status code 403', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'OR text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by mixed case oR with status code 403', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'oR  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by o%52 with status code 403', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'o%52  texto  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by %4Fr with status code 403', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'%4Fr  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by UNION with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'UNION  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by SELECT with status code 200', (done) => {
    request(typicalApp).post('/post').send({
      input: '\'SELECT  text  ',
    }).expect(200, done);
  });
});

describe('Integration Tests: Silent', () => {
  before((done) => {
    silentApp.use(sqlInjectReject({
      level: 'silent',
    }));
    silentApp.get('/get/:id', (req, res) => {
      res.status(200).send('OK');
    });
    silentApp.get('/get', (req, res) => {
      res.status(200).send('OK');
    });
    silentApp.post('/post', (req, res) => {
      res.status(200).send('OK');
    });
    silentApp.put('/put', (req, res) => {
      res.status(200).send('OK');
    });
    silentApp.delete('/delete', (req, res) => {
      res.status(200).send('OK');
    });
    done();
  });

  after((done) => {
    done();
  });

  it('Responds to a naked GET request with status code 200', (done) => {
    request(silentApp).get('/get').expect(200, done);
  });

  it('Responds to a GET with a querystring containing no sql with status code 200', (done) => {
    request(silentApp).get('/get?query=sometext').expect(200, done);
  });

  it('Responds to a GET with parameters and no sql with status code 200', (done) => {
    request(silentApp).get('/get/xiv').expect(200, done);
  });

  it('Responds to a POST with a body that doesn\'t contain sql with status code 200', (done) => {
    request(silentApp).post('/post').send({
      foo: 'bar',
    }).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' with status code 200', (done) => {
    request(silentApp).get('/get?query user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %27 with status code 200', (done) => {
    request(silentApp).get('/get?query  user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing -- with status code 200', (done) => {
    request(silentApp).get('/get?query user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing # with status code 200', (done) => {
    request(silentApp).get('/get?query' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %23 with status code 200', (done) => {
    request(silentApp).get('/get?query user\%23').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by \' with status code 200', (done) => {
    request(silentApp).get('/get?query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %27 with status code 200', (done) => {
    request(silentApp).get('/get?query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by -- with status code 200', (done) => {
    request(silentApp).get('/get?query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by ; with status code 200', (done) => {
    request(silentApp).get('/get?query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %3B with status code 200', (done) => {
    request(silentApp).get('/get?query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by upper case OR with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'OR').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by lower case or with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'or').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by mixed case oR with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'oR').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by o%52 with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'o%52').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by %4Fr with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'%4Fr').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by UNION with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by SELECT with status code 200', (done) => {
    request(silentApp).get('/get?queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' with status code 200', (done) => {
    request(silentApp).get('/get/ user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %27 with status code 200', (done) => {
    request(silentApp).get('/get/ user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing -- with status code 200', (done) => {
    request(silentApp).get('/get/ user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing # with status code 200', (done) => {
    request(silentApp).get('/get/' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %23 with status code 200', (done) => {
    request(silentApp).get('/get/  user%23').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by \' with status code 200', (done) => {
    request(silentApp).get('/get/query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %27 with status code 200', (done) => {
    request(silentApp).get('/get/query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by -- with status code 200', (done) => {
    request(silentApp).get('/get/query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by ; with status code 200', (done) => {
    request(silentApp).get('/get/query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %3B with status code 200', (done) => {
    request(silentApp).get('/get/query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by upper case OR with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'OR').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by lower case or with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'or').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by mixed case oR with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'oR').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by o%52 with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'o%52').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by %4Fr with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'%4Fr').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by UNION with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by SELECT with status code 200', (done) => {
    request(silentApp).get('/get/queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a POST with a body containing \' with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %27 with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing -- with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing # with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: ' #text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %23 with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: ' %23text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by \' with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '=  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %27 with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '=  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by -- with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '=  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by ; with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '=  text;  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %3B with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '=  text %3B ',
    }).expect(200, done);
  });


  it('Responds to a POST with a body containing \' followed by lower case or with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'or  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by upper case OR with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'OR text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by mixed case oR with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'oR  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by o%52 with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'o%52  texto  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by %4Fr with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'%4Fr  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by UNION with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'UNION  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by SELECT with status code 200', (done) => {
    request(silentApp).post('/post').send({
      input: '\'SELECT  text  ',
    }).expect(200, done);
  });
});

describe('Integration Tests: Default', () => {
  before((done) => {
    defaultApp.use(sqlInjectReject());
    defaultApp.get('/get/:id', (req, res) => {
      res.status(200).send('OK');
    });
    defaultApp.get('/get', (req, res) => {
      res.status(200).send('OK');
    });
    defaultApp.post('/post', (req, res) => {
      res.status(200).send('OK');
    });
    defaultApp.put('/put', (req, res) => {
      res.status(200).send('OK');
    });
    defaultApp.delete('/delete', (req, res) => {
      res.status(200).send('OK');
    });
    done();
  });

  after((done) => {
    done();
  });

  it('Responds to a naked GET request with status code 200', (done) => {
    request(defaultApp).get('/get').expect(200, done);
  });

  it('Responds to a GET with a querystring containing no sql with status code 200', (done) => {
    request(defaultApp).get('/get?query=sometext').expect(200, done);
  });

  it('Responds to a GET with parameters and no sql with status code 200', (done) => {
    request(defaultApp).get('/get/xiv').expect(200, done);
  });

  it('Responds to a POST with a body that doesn\'t contain sql with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      foo: 'bar',
    }).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' with status code 200', (done) => {
    request(defaultApp).get('/get?query user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %27 with status code 200', (done) => {
    request(defaultApp).get('/get?query  user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing -- with status code 200', (done) => {
    request(defaultApp).get('/get?query user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing # with status code 200', (done) => {
    request(defaultApp).get('/get?query' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %23 with status code 200', (done) => {
    request(defaultApp).get('/get?query user\%23').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by \' with status code 200', (done) => {
    request(defaultApp).get('/get?query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %27 with status code 200', (done) => {
    request(defaultApp).get('/get?query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by -- with status code 200', (done) => {
    request(defaultApp).get('/get?query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by ; with status code 200', (done) => {
    request(defaultApp).get('/get?query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %3B with status code 200', (done) => {
    request(defaultApp).get('/get?query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by upper case OR with status code 403', (done) => {
    request(defaultApp).get('/get?queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by lower case or with status code 403', (done) => {
    request(defaultApp).get('/get?queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by mixed case oR with status code 403', (done) => {
    request(defaultApp).get('/get?queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by o%52 with status code 403', (done) => {
    request(defaultApp).get('/get?queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by %4Fr with status code 403', (done) => {
    request(defaultApp).get('/get?queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by UNION with status code 200', (done) => {
    request(defaultApp).get('/get?queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by SELECT with status code 200', (done) => {
    request(defaultApp).get('/get?queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' with status code 200', (done) => {
    request(defaultApp).get('/get/ user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %27 with status code 200', (done) => {
    request(defaultApp).get('/get/ user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing -- with status code 200', (done) => {
    request(defaultApp).get('/get/ user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing # with status code 200', (done) => {
    request(defaultApp).get('/get/' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %23 with status code 200', (done) => {
    request(defaultApp).get('/get/  user%23').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by \' with status code 200', (done) => {
    request(defaultApp).get('/get/query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %27 with status code 200', (done) => {
    request(defaultApp).get('/get/query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by -- with status code 200', (done) => {
    request(defaultApp).get('/get/query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by ; with status code 200', (done) => {
    request(defaultApp).get('/get/query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %3B with status code 200', (done) => {
    request(defaultApp).get('/get/query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by upper case OR with status code 403', (done) => {
    request(defaultApp).get('/get/queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by lower case or with status code 403', (done) => {
    request(defaultApp).get('/get/queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by mixed case oR with status code 403', (done) => {
    request(defaultApp).get('/get/queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by o%52 with status code 403', (done) => {
    request(defaultApp).get('/get/queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by %4Fr with status code 403', (done) => {
    request(defaultApp).get('/get/queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by UNION with status code 200', (done) => {
    request(defaultApp).get('/get/queryuser\'UNION').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by SELECT with status code 200', (done) => {
    request(defaultApp).get('/get/queryuser\'SELECT').expect(200, done);
  });

  it('Responds to a POST with a body containing \' with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %27 with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing -- with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing # with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: ' #text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %23 with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: ' %23text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by \' with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '=  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %27 with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '=  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by -- with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '=  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by ; with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '=  text;  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %3B with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '=  text %3B ',
    }).expect(200, done);
  });


  it('Responds to a POST with a body containing \' followed by lower case or with status code 403', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'or  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by upper case OR with status code 403', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'OR text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by mixed case oR with status code 403', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'oR  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by o%52 with status code 403', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'o%52  texto  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by %4Fr with status code 403', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'%4Fr  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by UNION with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'UNION  text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing \' followed by SELECT with status code 200', (done) => {
    request(defaultApp).post('/post').send({
      input: '\'SELECT  text  ',
    }).expect(200, done);
  });
});

describe('Integration Tests: Default with keywords UNION and SELECT', () => {
  before((done) => {
    keywordsApp.use(sqlInjectReject({
      keywords: ['union', 'select'],
    }));
    keywordsApp.get('/get/:id', (req, res) => {
      res.status(200).send('OK');
    });
    keywordsApp.get('/get', (req, res) => {
      res.status(200).send('OK');
    });
    keywordsApp.post('/post', (req, res) => {
      res.status(200).send('OK');
    });
    keywordsApp.put('/put', (req, res) => {
      res.status(200).send('OK');
    });
    keywordsApp.delete('/delete', (req, res) => {
      res.status(200).send('OK');
    });
    done();
  });

  after((done) => {
    done();
  });

  it('Responds to a naked GET request with status code 200', (done) => {
    request(keywordsApp).get('/get').expect(200, done);
  });

  it('Responds to a GET with a querystring containing no sql with status code 200', (done) => {
    request(keywordsApp).get('/get?query=sometext').expect(200, done);
  });

  it('Responds to a GET with parameters and no sql with status code 200', (done) => {
    request(keywordsApp).get('/get/xiv').expect(200, done);
  });

  it('Responds to a POST with a body that doesn\'t contain sql with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      foo: 'bar',
    }).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' with status code 200', (done) => {
    request(keywordsApp).get('/get?query user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %27 with status code 200', (done) => {
    request(keywordsApp).get('/get?query  user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing -- with status code 200', (done) => {
    request(keywordsApp).get('/get?query user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing # with status code 200', (done) => {
    request(keywordsApp).get('/get?query' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing %23 with status code 200', (done) => {
    request(keywordsApp).get('/get?query user\%23').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by \' with status code 200', (done) => {
    request(keywordsApp).get('/get?query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %27 with status code 200', (done) => {
    request(keywordsApp).get('/get?query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by -- with status code 200', (done) => {
    request(keywordsApp).get('/get?query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by ; with status code 200', (done) => {
    request(keywordsApp).get('/get?query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing = followed by %3B with status code 200', (done) => {
    request(keywordsApp).get('/get?query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by upper case OR with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by lower case or with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by mixed case oR with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by o%52 with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by %4Fr with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by UNION with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'UNION').expect(403, done);
  });

  it('Responds to a GET with a URL querystring containing \' followed by SELECT with status code 403', (done) => {
    request(keywordsApp).get('/get?queryuser\'SELECT').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' with status code 200', (done) => {
    request(keywordsApp).get('/get/ user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %27 with status code 200', (done) => {
    request(keywordsApp).get('/get/ user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing -- with status code 200', (done) => {
    request(keywordsApp).get('/get/ user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing # with status code 200', (done) => {
    request(keywordsApp).get('/get/' + escape('user#')).expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing %23 with status code 200', (done) => {
    request(keywordsApp).get('/get/  user%23').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by \' with status code 200', (done) => {
    request(keywordsApp).get('/get/query= user\'').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %27 with status code 200', (done) => {
    request(keywordsApp).get('/get/query= user%27').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by -- with status code 200', (done) => {
    request(keywordsApp).get('/get/query= user--').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by ; with status code 200', (done) => {
    request(keywordsApp).get('/get/query= user;').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing = followed by %3B with status code 200', (done) => {
    request(keywordsApp).get('/get/query= user\%3B').expect(200, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by upper case OR with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'OR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by lower case or with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'or').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by mixed case oR with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'oR').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by o%52 with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'o%52').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by %4Fr with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'%4Fr').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by UNION with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'UNION').expect(403, done);
  });

  it('Responds to a GET with a URL parameter containing \' followed by SELECT with status code 403', (done) => {
    request(keywordsApp).get('/get/queryuser\'SELECT').expect(403, done);
  });

  it('Responds to a POST with a body containing \' with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %27 with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing -- with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing # with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: ' #text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing %23 with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: ' %23text ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by \' with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '=  \'text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %27 with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '=  %27text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by -- with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '=  --text  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by ; with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '=  text;  ',
    }).expect(200, done);
  });

  it('Responds to a POST with a body containing = followed by %3B with status code 200', (done) => {
    request(keywordsApp).post('/post').send({
      input: '=  text %3B ',
    }).expect(200, done);
  });


  it('Responds to a POST with a body containing \' followed by lower case or with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'or  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by upper case OR with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'OR text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by mixed case oR with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'oR  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by o%52 with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'o%52  texto  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by %4Fr with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'%4Fr  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by UNION with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'UNION  text  ',
    }).expect(403, done);
  });

  it('Responds to a POST with a body containing \' followed by SELECT with status code 403', (done) => {
    request(keywordsApp).post('/post').send({
      input: '\'SELECT  text  ',
    }).expect(403, done);
  });
});
