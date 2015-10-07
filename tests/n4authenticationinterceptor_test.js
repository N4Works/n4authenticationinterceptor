"use strict";

describe('n4AuthenticationInterceptor', function() {
    describe('provider', function () {
        var provider;

        beforeEach(module('n4AuthenticationInterceptor', function (n4AuthenticationInterceptorProvider) {
            provider = n4AuthenticationInterceptorProvider;
        }));

        describe('provider', function () {
            it('should have redirectURL undefined', inject(function () {
                expect(provider.redirectURL).toBeUndefined();
            }));

            it('should have HTTP status 401 by default', inject(function () {
                expect(provider.statusHttp).toEqual(401);
            }));

            it('should have authentication message as "Usuário não autenticado." by default', inject(function () {
                expect(provider.notAuthenticatedMessage).toEqual('Usuário não autenticado.');
            }));

            it('should have cb as an empty function', inject(function () {
                expect(provider.cb).toEqual(angular.noop);
            }));
        });
    });

    describe('responseError', function () {
        var _http, _httpBackend, _windowMock;
        var provider;

        beforeEach(module('n4AuthenticationInterceptor', function ($provide, n4AuthenticationInterceptorProvider) {
            $provide.constant('$window', {
                location: {
                    replace: angular.noop
                }
            });

            provider = n4AuthenticationInterceptorProvider;

            provider.called = false;

            provider.cb = function() {
              this.called = true;
            };
        }));

        beforeEach(inject(function ($injector) {
            _http = $injector.get('$http');
            _httpBackend = $injector.get('$httpBackend');
            _windowMock = $injector.get('$window');

            spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);
            spyOn(provider, 'cb').and.callThrough();
        }));

        describe('responseError', function () {
            var URL = '/api/something';

            it('should not redirect when HTTP status is not 401', function () {
                _httpBackend.expectGET(URL).respond(400);

                _http.get(URL);

                _httpBackend.flush();

                expect(provider.cb).not.toHaveBeenCalled();
                expect(provider.called).toBe(false);
                expect(_windowMock.location.replace).not.toHaveBeenCalled();
            });

            it('should redirect when HTTP status is 401', function () {
                _httpBackend.expectGET(URL).respond(401);

                _http.get(URL);

                _httpBackend.flush();

                expect(provider.cb).toHaveBeenCalled();
                expect(provider.called).toBe(true);
                expect(_windowMock.location.replace).toHaveBeenCalled();
            });
        });
    });
});
