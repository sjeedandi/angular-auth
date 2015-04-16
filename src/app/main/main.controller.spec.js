'use strict';

describe('Angular Authentication', function(){
  
  var $ngAuth, $httpBackend, authRequestHandler, uid, invalidUid, expiredUid;

  beforeEach(module('ngAuth'));

  beforeEach(inject(function($injector) {
    
    $ngAuth = $injector.get('$ngAuth');
    $httpBackend = $injector.get('$httpBackend');
    
    uid = {
      id: 1,
      email: 'you@domain.com',
      username: 'Piet',
      password: 'secretPassword',
      token: 'xxx',
      expires: Date.now() + (1000 * 60 * 60 * 24) 
    };
    invalidUid = {
      id: 1,
      email: null,
      username: 'Piet',
      password: 'secretPassword',
      token: 'xxx',
      expires: Date.now() - (1000 * 60 * 60 * 24) 
    };
    expiredUid = {
      id: 1,
      email: 'you@domain.com',
      username: 'Piet',
      password: 'secretPassword',
      token: 'xxx',
      expires: Date.now() - (1000 * 60 * 60 * 24) 
    };
    

    authRequestHandler = $httpBackend.when('POST', '/authentication')
      .respond(uid);

  }));

  afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
  });


  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////


  // Test if all properties and methods are there
  it('should have a method called isAuthenticated', inject(function() {
    expect($ngAuth.isAuthenticated).toEqual(jasmine.any(Function));
  }));
  
  it('should have a method called authenticate', inject(function() {
    expect($ngAuth.authenticate).toEqual(jasmine.any(Function));
    
  }));

  it('should have a method called deauthenticate', inject(function() {
    expect($ngAuth.deauthenticate).toEqual(jasmine.any(Function));
  }));



  // Test authentication method
  it('should return a promise when authenticate() is called', inject(function() {
    expect($ngAuth.authenticate()).toEqual(jasmine.any(Object));
  }));

  it('should reject the promise when authenticate() is called without uid', inject(function() {
    $ngAuth.authenticate().catch(function (error) {
      expect(error).toEqual(false);
    });
  }));

  it('should resolve the promise when authenticate() is called with an uid', inject(function() {
    $httpBackend.expectPOST('/authentication');
    $ngAuth.authenticate(uid).then(function (response) {
      expect(response).toEqual(jasmine.any(Object));
      expect(response.username).toBe('Piet');
      expect(response.token).toBe('xxx');
      expect(response.id).toBe(1);
      expect(new Date(response.expires)).toEqual(jasmine.any(Date));
      console.log('uid', response);
    });
    $httpBackend.flush();

  }));

  it('should reject the promise when authenticate() is called with an expired uid', inject(function() {
    $ngAuth.authenticate(invalidUid).catch(function (error) {
      expect(error).toBe(false);
      console.log('invalid uid', error);
    });
  }));

  it('should resolve the promise when isAuthenticate() is called with valid uid', inject(function() {
    $httpBackend.expectPOST('/authentication');
    $ngAuth.set(uid);
    $ngAuth.isAuthenticated().then(function (response) {
      expect(response).toEqual(jasmine.any(Object));
      expect(response).toEqual(uid);
    });
    $httpBackend.flush();
  }));

   it('should resolve the promise when isAuthenticate() is called with valid uid', inject(function() {
    $httpBackend.expectPOST('/authentication');
    $ngAuth.set(expiredUid);
    $ngAuth.isAuthenticated().then(function (response) {
      expect(response).toEqual(jasmine.any(Object));
      expect(response).toEqual(uid);
    });
    $httpBackend.flush();
  }));

});
