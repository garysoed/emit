package com.emit.common;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import static com.google.common.truth.Truth.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class ValidatorTest {
  Validator validator;

  @Before
  public void setUp() throws Exception {
    validator = Validator.newInstance();
  }

  @Test
  public void getException_normal() {
    String error1 = "error1";
    String error2 = "error2";
    validator.check(null).isNotNull().orError(error1);
    validator.check("").isNotEmpty().orError(error2);

    ValidationException exception = validator.getException();
    assertThat(exception).hasMessage(error1 + "\n" + error2);
  }

  @Test
  public void getException_empty() {
    ValidationException exception = validator.getException();
    assertThat(exception).hasMessage("");
  }

  //
  // Tests for general validations
  //
  @Test
  public void orError_fail() {
    String error = "error";
    assertThat(validator.check(null).isNotNull().orError(error)).isEqualTo(null);
    assertThat(validator.getException()).hasMessage(error);
  }

  @Test
  public void orError_pass() {
    String error = "error";
    assertThat(validator.check("").isNotNull().orError(error)).isEqualTo("");
    assertThat(validator.hasError()).isFalse();
  }

  @Test
  public void orUse_fail() {
    String newValue = "newValue";
    assertThat(validator.check(null).isNotNull().orUse(newValue)).isEqualTo(newValue);
  }

  @Test
  public void orUse_pass() {
    String oldValue = "oldValue";
    assertThat(validator.check(oldValue).isNotNull().orUse("")).isEqualTo(oldValue);
  }

  //
  // Tests for string validations
  //
  @Test
  public void string_exists_pass() {
    validator.check("string").exists().orError("error");
    assertThat(validator.hasError()).isFalse();
  }

  @Test
  public void string_exists_null() {
    validator.check(null).exists().orError("error");
    assertThat(validator.hasError()).isTrue();
  }

  @Test
  public void string_exists_empty() {
    validator.check("").exists().orError("error");
    assertThat(validator.hasError()).isTrue();
  }

  @Test
  public void string_isNotNull_pass() {
    validator.check("").isNotNull().orError("error");
    assertThat(validator.hasError()).isFalse();
  }

  @Test
  public void string_isNotNull_null() {
    validator.check(null).isNotNull().orError("error");
    assertThat(validator.hasError()).isTrue();
  }

  @Test
  public void string_isNotEmpty_pass() {
    validator.check("string").isNotEmpty().orError("error");
    assertThat(validator.hasError()).isFalse();
  }

  @Test
  public void string_isNotEmpty_empty() {
    validator.check("").isNotEmpty().orError("error");
    assertThat(validator.hasError()).isTrue();
  }

  @Test
  public void string_isNotEmpty_null() {
    validator.check(null).isNotEmpty().orError("error");
    assertThat(validator.hasError()).isFalse();
  }
}