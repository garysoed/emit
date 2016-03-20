package com.emit.components;

import com.emit.modules.ServletModule;
import dagger.Component;

import javax.inject.Singleton;

@Component
@Singleton
public interface ServerComponent {
  ServletComponent servlet(ServletModule servletModule);
}
