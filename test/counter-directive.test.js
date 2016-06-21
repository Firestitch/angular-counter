describe('Counter Directive:', function() {
  var $compile, $rootScope, $timeout;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
    // window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
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

  describe('when initialized with invalid number that parses to 0', function () {
    var element, input, $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: '0xa'
      };
    });

    it('should set the value to 0 if not min is given', function() {
      element = $compile('<div fs-counter value="sample.value"></div>')($scope);
      $rootScope.$digest();
      input = element[0].querySelectorAll("[data-test-id=counter-input]");
      expect(input[0].value).toBe('0');
    });

    it('should set the value to min if invalid input parses to 0 and min is given', function() {
      element = $compile('<div fs-counter value="sample.value" min="10"></div>')($scope);
      $rootScope.$digest();
      input = element[0].querySelectorAll("[data-test-id=counter-input]");
      expect(input[0].value).toBe('10');
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

  describe('when initialized with value less than min or larger than max:', function () {
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

    it('should set the value to value if min is invalid', function() {
      var element = $compile('<div fs-counter value="sample.value" min="blah"></div>')($scope);
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(5);
    });

  });

  describe('when using the plus or minus button', function () {
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

    it('should not decrement the value beyond the min value', function() {
      var element = $compile('<div fs-counter value="sample.value" min="4"></div>')($scope);
      var decButton = element[0].querySelectorAll("[data-test-id=dec-button]");
      angular.element(decButton).triggerHandler('click');
      angular.element(decButton).triggerHandler('click');
      angular.element(decButton).triggerHandler('click');
      angular.element(decButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(4);
    });

    xit('should not define a min value if the min value is invalid', function() {
      $scope.sample.value = 1;
      var element = $compile('<div fs-counter value="sample.value" min="0xa"></div>')($scope);
      var decButton = element[0].querySelectorAll("[data-test-id=dec-button]");
      angular.element(decButton).triggerHandler('click');
      angular.element(decButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(-1);
    });

    it('should not inc the value beyond the max value', function() {
      var element = $compile('<div fs-counter value="sample.value" max="6"></div>')($scope);
      var incButton = element[0].querySelectorAll("[data-test-id=inc-button]");
      angular.element(incButton).triggerHandler('click');
      angular.element(incButton).triggerHandler('click');
      angular.element(incButton).triggerHandler('click');
      angular.element(incButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(6);
    });

  });

  describe('when the input is editable or not:', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: 5
      };
    });

    it('should set the value given by the user if editable', function() {
      var element = $compile('<div fs-counter value="sample.value" editable></div>')($scope);
      var input = element[0].querySelectorAll("[data-test-id=counter-input]");
      angular.element(input).val('25').triggerHandler('input');
      $rootScope.$digest();
      $timeout.flush();
      expect(element.isolateScope().value).toBe(25);
    });

    it('should be readonly if not editable', function() {
      var element = $compile('<div fs-counter value="sample.value"></div>')($scope);
      var input = element[0].querySelectorAll("[data-test-id=counter-input]");
      $rootScope.$digest();
      expect(input[0].readonly).toBe(true);
    });

  });

  describe('when addClass options is specified with class names:', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: 5
      };
    });

    it('should add the classes to the wrapper', function() {
      var element = $compile('<div><div fs-counter value="sample.value" addClass="some-class other-class"></div></div>')($scope);
      var wrapper = element[0].querySelectorAll("[data-test-id=counter-wrapper]");
      $rootScope.$digest();
      expect(angular.element(wrapper).hasClass('some-class')).toBe(true);
      expect(angular.element(wrapper).hasClass('other-class')).toBe(true);
    });

  });

  describe('when step option is specified:', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.sample = {
        value: 5
      };
    });

    it('should increment with the step value', function() {
      var element = $compile('<div fs-counter value="sample.value" step="2"></div>')($scope);
      var incButton = element[0].querySelectorAll("[data-test-id=inc-button]");
      angular.element(incButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(7);
    });

    it('should decrement with the step value', function() {
      var element = $compile('<div fs-counter value="sample.value" step="2"></div>')($scope);
      var incButton = element[0].querySelectorAll("[data-test-id=dec-button]");
      angular.element(incButton).triggerHandler('click');
      $rootScope.$digest();
      expect(element.isolateScope().value).toBe(3);
    });

  });

});
