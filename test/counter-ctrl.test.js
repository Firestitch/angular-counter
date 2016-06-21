describe('Counter Controller:', function() {
  var $controller, underTest;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
    underTest = $controller('counterCtrl', { $scope: {} });
  }));

  describe('The `isValidNum` method', function () {
    it('should be valid for valid inputs', function () {
      expect(underTest.isValidNum('1')).toBe(true);
      expect(underTest.isValidNum('-1')).toBe(true);
      expect(underTest.isValidNum(1)).toBe(true);
      expect(underTest.isValidNum(-1)).toBe(true);
      expect(underTest.isValidNum(0)).toBe(true);
    });
    it('should return false for invalid input', function () {
      expect(underTest.isValidNum()).toBe(false);
      expect(underTest.isValidNum(undefined)).toBe(false);
      expect(underTest.isValidNum('')).toBe(false);
      expect(underTest.isValidNum(false)).toBe(false);
      expect(underTest.isValidNum(NaN)).toBe(false);
      expect(underTest.isValidNum('0xa')).toBe(false);
      expect(underTest.isValidNum([])).toBe(false);
      expect(underTest.isValidNum({})).toBe(false);
      expect(underTest.isValidNum(null)).toBe(false);
      expect(underTest.isValidNum('blabla')).toBe(false);
    });
    it('should return false if input is false positive', function () {
      expect(underTest.isValidNum('0xa')).toBe(false);
    });
    it('should return true if all input values are valid', function () {
      expect(underTest.isValidNum('1', '2', '3')).toBe(true);
    });
    it('should return false if at least of input is invalid', function () {
      expect(underTest.isValidNum('1', '2', NaN)).toBe(false);
      expect(underTest.isValidNum('1', 2, NaN)).toBe(false);
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
