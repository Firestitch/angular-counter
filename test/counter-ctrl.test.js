describe('Counter Controller:', function() {
  var $controller, underTest;
  beforeEach(module('Firestitch.angular-counter'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
    underTest = $controller('counterCtrl', { $scope: {} });
  }));

  it('should set the value correctly if input is valid number string', function() {
    expect(underTest.setValue('1')).toBe(1);
  });

  it('should return 0 if the value is not valid', function() {
    expect(underTest.setValue('blah')).toBe(0);
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

});
