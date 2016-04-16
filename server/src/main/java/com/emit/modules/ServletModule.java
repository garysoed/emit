package com.emit.modules;

import dagger.Module;
import dagger.Provides;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Module
public class ServletModule {
  private final ServletContext context;
  private final HttpServletRequest request;
  private final HttpServletResponse response;

  public ServletModule(ServletContext context, HttpServletRequest req, HttpServletResponse resp) {
    this.context = context;
    this.request = req;
    this.response = resp;
  }

  @Provides
  ServletContext providesServletContext() {
    return this.context;
  }

  @Provides
  HttpServletRequest providesServletRequest() {
    return this.request;
  }

  @Provides
  HttpServletResponse providesServletResponse() {
    return this.response;
  }
}
