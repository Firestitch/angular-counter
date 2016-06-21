describe('Counter Controller:', function() {
  var $controller, underTest;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
    underTest = $controller('counterCtrl', { $scope: {} });
  }));

  describe('The `isValidNumString` method', function () {
    it('should be valid for valid inputs', function () {
      expect(underTest.isValidNumString('1')).toBe(true);
      expect(underTest.isValidNumString('-1')).toBe(true);
      expect(underTest.isValidNumString(1)).toBe(true);
      expect(underTest.isValidNumString(-1)).toBe(true);
      expect(underTest.isValidNumString(0)).toBe(true);
      expect(underTest.isValidNumString(3.4)).toBe(true);
    });
    it('should return false for invalid input', function () {
      expect(underTest.isValidNumString()).toBe(false);
      expect(underTest.isValidNumString(undefined)).toBe(false);
      expect(underTest.isValidNumString('')).toBe(false);
      expect(underTest.isValidNumString(false)).toBe(false);
      expect(underTest.isValidNumString(NaN)).toBe(false);
      expect(underTest.isValidNumString('0xa')).toBe(false);
      expect(underTest.isValidNumString([])).toBe(false);
      expect(underTest.isValidNumString({})).toBe(false);
      expect(underTest.isValidNumString(null)).toBe(false);
      expect(underTest.isValidNumString('blabla')).toBe(false);
      expect(underTest.isValidNumString('2x')).toBe(false);
    });
    it('should return false if input is false positive', function () {
      expect(underTest.isValidNumString('0xa')).toBe(false);
    });
    it('should return true if all input values are valid', function () {
      expect(underTest.isValidNumString('1', '2', '3')).toBe(true);
      expect(underTest.isValidNumString('1', 2, '3', -1, 0, 5, 100, '15902')).toBe(true);
    });
    it('should return false if at least of input is invalid', function () {
      expect(underTest.isValidNumString('1', '2', NaN)).toBe(false);
      expect(underTest.isValidNumString('1', 2, '0xa')).toBe(false);
      expect(underTest.isValidNumString(1, 5, NaN)).toBe(false);
      expect(underTest.isValidNumString(1, NaN, 2)).toBe(false);
      expect(underTest.isValidNumString('blah', '0.5', 2)).toBe(false);
    });
  });
  describe('The `setValue` method', function () {
    it('should set the value correctly if input is valid number string', function() {
      expect(underTest.setValue('1')).toBe(1);
    });

    it('should return 0 if the value is not valid', function() {
      expect(underTest.setValue('blah')).toBe(0);
    });

    it('should return 0 if the parsed value is 0 but input wasnt 0', function() {
      expect(underTest.setValue('0xa')).toBe(0);
    });

    it('should set value to min if input is invalid', function() {
      expect(underTest.setValue('0xa', 5)).toBe(5);
    });

    it('should set value to min if value < min', function() {
      expect(underTest.setValue('2', 3)).toBe(3);
    });

    it('should set value to max if value > max', function() {
      expect(underTest.setValue('6', 0, 5)).toBe(5);
    });

    /* different cases */
    it('should set value as integer if input is floating point string', function() {
      expect(underTest.setValue('6.1')).toBe(6);
    });

    it('should set to 0 if input not valid', function() {
      expect(underTest.setValue('0xa')).toBe(0);
    });

    it('should set to min if input not valid and a min value is given', function() {
      expect(underTest.setValue('0xa', 1, 100)).toBe(1);
    });

    xit('should do ... if min is NaN', function() {
      expect(underTest.setValue('5', NaN)).toBe(1);
    });

  });
});
