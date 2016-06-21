describe('Counter Directive:', function() {
  var $compile, $rootScope;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe('when initialized with invalid values', function () {
    it('should throw error if the value is not set', function() {
      expect(function() {
        var element = $compile('<div fs-counter value=""></div>')($rootScope);
        $rootScope.$digest();
      }).toThrow('Missing the value attribute on the counter directive.');
    });

    it('should throw error if the value is not valid', function() {
      expect(function() {
        var element = $compile('<div fs-counter value="blah"></div>')($rootScope);
        $rootScope.$digest();
      }).toThrow('Missing the value attribute on the counter directive.');
    });
  });

  describe('when initialized with correct value:', function () {
    var element, input, $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: 5
      };
      element = $compile('<div fs-counter value="sample.value"></div>')($scope);
      $rootScope.$digest();
      input = element[0].querySelectorAll("[data-test-id=counter-input]");
    });

    it('should be set with the given value.', function() {
      expect(input[0].value).toBe('5');
    });

    it('should set the value model as a Number', function() {
      var elmScope = element.isolateScope();
      expect(elmScope.value).toBe(5);
      expect(elmScope.value).toEqual(jasmine.any(Number));
    });
  });

  describe('when initialized when value is less than min or larger than max:', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: 5
      };
    });

    it('should set the value to min if value > min', function() {
      var element = $compile('<div fs-counter value="sample.value" min="6"></div>')($scope);
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(6);
    });

    it('should set the value to the max if value > max', function() {
      var element = $compile('<div fs-counter value="sample.value" max="4"></div>')($scope);
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(4);
    });

  });

  describe('changing the value functions', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: 5
      };
    });

    it('should increase the value by one if the plus is clicked', function() {
      var element = $compile('<div fs-counter value="sample.value"></div>')($scope);
      var incButton = element[0].querySelectorAll("[data-test-id=inc-button]");
      angular.element(incButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(6);
    });

    it('should decrement the value by one if the minus is clicked', function() {
      var element = $compile('<div fs-counter value="sample.value"></div>')($scope);
      var decButton = element[0].querySelectorAll("[data-test-id=dec-button]");
      angular.element(decButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(4);
    });

  });

});
