package com.emit;

import com.emit.components.ServerComponent;
import com.emit.components.DaggerServerComponent;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class Server implements ServletContextListener {
  @Override
  public void contextInitialized(ServletContextEvent servletContextEvent) {
    servletContextEvent.getServletContext().setAttribute(
        ServerComponent.class.getName(),
        DaggerServerComponent.create());
  }

  @Override
  public void contextDestroyed(ServletContextEvent servletContextEvent) { }
}
