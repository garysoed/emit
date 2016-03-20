package com.emit;

import dagger.Component;

import javax.inject.Singleton;

@Component
@Singleton
public interface ServerComponent {
  ServletComponent servlet(ServletModule servletModule);
}
