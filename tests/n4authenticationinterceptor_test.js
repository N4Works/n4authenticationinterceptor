"use strict";

describe('n4AuthenticationInterceptor', function() {
    describe('provider', function () {
        var provider;

        beforeEach(module('n4AuthenticationInterceptor', function (n4AuthenticationInterceptorProvider) {
            provider = n4AuthenticationInterceptorProvider;
        }));

        describe('provider', function () {
            it('should have HTTP status 401 by default', inject(function () {
                expect(provider.statusHttp).toEqual(401);
            }));

            it('should have not authentication message as "Usuário não autenticado." by default', inject(function () {
                expect(provider.notAuthenticatedMessage).toEqual('Usuário não autenticado.');
            }));
        });
    });

    describe('responseError', function () {
        var _http, _httpBackend, _windowMock;
        var n4AuthenticationInterceptor;

        beforeEach(module('n4AuthenticationInterceptor', function ($provide) {
            $provide.constant('$window', {
                location: {
                    replace: angular.noop
                }
            });
        }));

        beforeEach(inject(function ($injector) {
            n4AuthenticationInterceptor = $injector.get('n4AuthenticationInterceptor');
            _http = $injector.get('$http');
            _httpBackend = $injector.get('$httpBackend');
            _windowMock = $injector.get('$window');

            spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);
        }));

        describe('responseError', function () {
            var URL = '/api/something';

            it('should not redirect when HTTP status is not 401', function () {
                _httpBackend.expectGET(URL).respond(400);

                _http.get(URL)

                _httpBackend.flush();

                expect(_windowMock.location.replace).not.toHaveBeenCalled();
            });

            it('should redirect when HTTP status is 401', function () {
                _httpBackend.expectGET(URL).respond(401);

                _http.get(URL);

                _httpBackend.flush();

                expect(_windowMock.location.replace).toHaveBeenCalled();
            });
        });
    });
});
