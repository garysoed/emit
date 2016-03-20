package com.emit;

import com.emit.components.ServerComponent;
import com.emit.modules.ServletModule;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class EmailServlet extends HttpServlet {

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
    serverComponent
        .servlet(new ServletModule(this.getServletContext()))
        .emailHandler()
        .post(req, resp);
  }
}
