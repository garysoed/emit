package com.emit.common;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import static com.google.common.truth.Truth.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class ValidatorTest {
  @Test
  public void fake() { }
  Validator validator;

  @Before
  public void setUp() throws Exception {
    validator = Validator.newInstance();
  }

  @Test
  public void getException_normal() {
    String error1 = "error1";
    String error2 = "error2";
    validator.check((String) null).isNotNull().orError(error1);
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
    assertThat(validator.check((String) null).isNotNull().orError(error)).isEqualTo(null);
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
    assertThat(validator.check((String) null).isNotNull().orUse(newValue)).isEqualTo(newValue);
  }

  @Test
  public void orUse_pass() {
    String oldValue = "oldValue";
    assertThat(validator.check(oldValue).isNotNull().orUse("")).isEqualTo(oldValue);
  }

  //
  // Tests for boolean validations
  //
  @Test
  public void boolean_isEqualTo_pass() {
    validator.check(true).isEqualTo(true).orError("error");
    assertThat(validator.hasError()).isFalse();
  }

  @Test
  public void boolean_isEqualTo_fail() {
    validator.check(true).isEqualTo(false).orError("error");
    assertThat(validator.hasError()).isTrue();
  }

  //
  // Tests for integer validations
  //
  @Test
  public void integer_isEqualTo_pass() {
    validator.check(1).isEqualTo(1).orError("error");
    assertThat(validator.hasError()).isFalse();
  }

  @Test
  public void integer_isEqualTo_fail() {
    validator.check(1).isEqualTo(2).orError("error");
    assertThat(validator.hasError()).isTrue();
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
    validator.check((String) null).exists().orError("error");
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
    validator.check((String) null).isNotNull().orError("error");
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
    validator.check((String) null).isNotEmpty().orError("error");
    assertThat(validator.hasError()).isFalse();
  }
}