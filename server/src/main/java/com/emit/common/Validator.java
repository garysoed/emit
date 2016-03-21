package com.emit.common;

import com.google.appengine.repackaged.com.google.api.client.util.Lists;
import com.google.common.base.Joiner;

import java.util.List;

public class Validator {
  private final List<String> errors;

  private Validator() {
    this.errors = Lists.newArrayList();
  }

  public static Validator newInstance() {
    return new Validator();
  }

  public StringValidationChecker check(String value) {
    return new StringValidationChecker(value);
  }

  public boolean hasError() {
    return !this.errors.isEmpty();
  }

  public ValidationException getException() {
    return new ValidationException(Joiner.on("\n").join(errors));
  }

  public abstract class ValidationChecker<V> {
    protected final V value;
    protected boolean isValid;

    ValidationChecker(V value) {
      this.value = value;
      this.isValid = true;
    }

    public ValidationChecker<V> isNotNull() {
      this.isValid = this.isValid && (this.value != null);
      return this;
    }

    public V orError(String error) {
      if (!this.isValid) {
        Validator.this.errors.add(error);
      }
      return this.value;
    }

    public V orUse(V value) {
      return this.isValid ? this.value : value;
    }
  }

  public class StringValidationChecker extends ValidationChecker<String> {
    StringValidationChecker(String value) {
      super(value);
    }

    public StringValidationChecker exists() {
      StringValidationChecker nonNullValidator = (StringValidationChecker) this.isNotNull();
      return nonNullValidator.isNotEmpty();
    }

    public StringValidationChecker isNotEmpty() {
      this.isValid = this.isValid && (this.value == null || !this.value.isEmpty());
      return this;
    }
  }
}
