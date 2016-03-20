package com.emit.common;

import javax.inject.Scope;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Scoped to a servlet.
 */
@Target(value = { TYPE, METHOD, FIELD, PARAMETER })
@Retention(value = RUNTIME)
@Documented
@Scope
public @interface ServletScoped {
}
