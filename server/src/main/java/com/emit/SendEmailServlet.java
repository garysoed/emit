package com.emit;

import com.emit.common.ValidationException;
import com.emit.components.ServerComponent;
import com.emit.components.ServletComponent;
import com.emit.modules.ServletModule;
import com.google.common.base.Throwables;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class SendEmailServlet extends HttpServlet {

  private ServerComponent serverComponent;

  @Override
  public void init() throws ServletException {
    super.init();
    serverComponent = (ServerComponent) this.getServletContext()
        .getAttribute(ServerComponent.class.getName());
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    try {
      ServletComponent servletComponent = serverComponent
          .servlet(new ServletModule(this.getServletContext(), req, resp));
      servletComponent.emailHandler().post();
    } catch (ValidationException e) {
      Throwables.propagate(e);
    }
  }
}
