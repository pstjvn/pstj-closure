goog.provide('pstj.math.CyclicNumberGenerator');
goog.provide('pstj.math.LinearNumberGenerator');



/**
 * Provides means to generate linear number sequence with regular increments.
 * @constructor
 * @param {number} max The maximum number in the range to generate.
 * @param {number=} opt_min The minimum number in the range to generate.
 * @param {number=} opt_step The step to use to move from value to value.
 */
pstj.math.LinearNumberGenerator = function(max, opt_min, opt_step) {
  /**
   * The maximum number in the generator.
   * @type {number}
   * @protected
   */
  this.max = max;
  /**
   * The minimum number in the generator.
   * @type {number}
   * @protected
   */
  this.min = goog.isNumber(opt_min) ? opt_min : 0;
  /**
   * The step to use in the generator.
   * @type {number}
   * @protected
   */
  this.step = goog.isNumber(opt_step) ? opt_step : 1;
  /**
   * The current value in the generator
   * @type {number}
   */
  this.value = 0;
  this.reset();
};


/**
 * Getter for the next number in the generator sequence.
 * @return {number}
 */
pstj.math.LinearNumberGenerator.prototype.next = function() {
  this.value += this.step;
  if (this.value > this.max) this.value = this.min;
  return this.value;
};


/**
 * Reset the sequence of generation, starting from the minimum value.
 */
pstj.math.LinearNumberGenerator.prototype.reset = function() {
  this.value = this.min;
};



/**
 * Provides means to generate number ranges in sequence.
 * @constructor
 * @extends {pstj.math.LinearNumberGenerator}
 * @param {number} max The maximum number in the range to generate.
 * @param {number=} opt_min The minimum number in the range to generate.
 * @param {number=} opt_step The step to use to move from value to value.
 */
pstj.math.CyclicNumberGenerator = function(max, opt_min, opt_step) {
  /**
   * Flag if we are currently goin up generation or down. By default
   * we start with an 'up' generation.
   * @type {boolean}
   * @private
   */
  this.increment_ = true;
  goog.base(this, max, opt_min, opt_step);
};
goog.inherits(pstj.math.CyclicNumberGenerator, pstj.math.LinearNumberGenerator);


/** @inheritDoc */
pstj.math.CyclicNumberGenerator.prototype.next = function() {
  if (this.increment_) {
    if (this.value >= this.max) {
      this.increment_ = false;
    }
  } else {
    if (this.value <= this.min) {
      this.increment_ = true;
    }
  }

  if (this.increment_) this.value += this.step;
  else this.value -= this.step;

  return this.value;
};


/**
 * Resets the generator so it would start from the beginning of the
 * number generation process, the middle of the sequence for the
 * rotation.
 * @override
 */
pstj.math.CyclicNumberGenerator.prototype.reset = function() {
  this.increment_ = true;
  this.value = (this.min + this.max) / 2;
};
