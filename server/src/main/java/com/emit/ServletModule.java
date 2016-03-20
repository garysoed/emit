package com.emit;

import dagger.Module;
import dagger.Provides;

import javax.servlet.ServletContext;

@Module
public class ServletModule {
  private final ServletContext context;

  ServletModule(ServletContext context) {
    this.context = context;
  }

  @Provides
  ServletContext providesServletContext() {
    return this.context;
  }
}
