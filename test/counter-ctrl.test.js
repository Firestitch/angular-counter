describe('Counter Controller:', function() {
  var $controller, underTest;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
    underTest = $controller('counterCtrl', { $scope: {} });
  }));

  describe('The `parse` method', function () {
    it('should convert a string to number and return an integer', function () {
      expect(underTest.parse('1')).toBe(1);
      expect(underTest.parse('1.5')).toBe(1);
      expect(underTest.parse('-1.1')).toBe(-1);
      expect(underTest.parse('0')).toBe(0);
      expect(underTest.parse('0.0000005')).toBe(0);
    });
    it('should return NaN if the input is not a valid number string', function () {
      expect(isNaN(underTest.parse('0xa'))).toBe(true);
      expect(isNaN(underTest.parse('2x'))).toBe(true);
      expect(isNaN(underTest.parse([]))).toBe(true);
      expect(isNaN(underTest.parse(' '))).toBe(true);
      expect(isNaN(underTest.parse('\t\n\r'))).toBe(true);
      expect(isNaN(underTest.parse(''))).toBe(true);
      expect(isNaN(underTest.parse(undefined))).toBe(true);
      expect(isNaN(underTest.parse(null))).toBe(true);
      expect(isNaN(underTest.parse({}))).toBe(true);
      expect(isNaN(underTest.parse([]))).toBe(true);
      expect(isNaN(underTest.parse(/[0-9]/))).toBe(true);
      expect(isNaN(underTest.parse('00000s0'))).toBe(true);
      expect(isNaN(underTest.parse('blah'))).toBe(true);
    });
  });

  describe('The `isValidNumString` method', function () {

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

    it('should not set min if the value is invalid', function() {
      expect(underTest.setValue('5', NaN)).toBe(5);
    });

    it('should not set max if the value is invalid', function() {
      expect(underTest.setValue('5', 0, NaN)).toBe(5);
    });
  });
});
