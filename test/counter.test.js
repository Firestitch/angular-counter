describe('Counter Directive:', function() {
  var $compile, $rootScope, $scope;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  describe('when initialized:', function () {
    var element, input;
    beforeEach(function () {
      element = $compile('<div fs-counter value="5"></div>')($scope);
      $rootScope.$digest();
      input = element[0].querySelectorAll("[data-test-id=counter-input]");
    });

    it('should bet set with the given value.', function() {
      expect(input[0].value).toBe('5');
    });

    it('should set the value model as a Number', function() {
      var elmScope = element.isolateScope();
      expect(elmScope.value).toBe(5);
      expect(elmScope.value).toEqual(jasmine.any(Number));
    });

    it('should throw error if the value is not valid', function() {
      expect(function() {
        var element = $compile('<div fs-counter value="blah"></div>')($scope);
        $rootScope.$digest();
        var input = element[0].querySelectorAll("[data-test-id=counter-input]");
      }).toThrow('Missing the value attribute on the counter directive.');
    });
  });



});
