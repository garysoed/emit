package com.emit;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.core.util.MultivaluedMapImpl;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.Scanner;


public class EmailServlet extends HttpServlet {

  private static final String MAILGUN_DOMAIN_NAME
      = "sandbox79e773d229934912992dc788fda33871.mailgun.org";

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    ServletContext context = this.getServletContext();
    Scanner reader = new Scanner(context.getResourceAsStream("/WEB-INF/api.key"));
    String mailgunApiKey = reader.next();

    String from = req.getParameter("from");
    String fromName = req.getParameter("fromName");
    String subject = req.getParameter("subject");
    String content = req.getParameter("content");
    resp.setContentType("text/plain");

    Client client = Client.create();
    client.addFilter(new HTTPBasicAuthFilter("api", mailgunApiKey));
    WebResource webResource = client.resource(
        "https://api.mailgun.net/v3/" + MAILGUN_DOMAIN_NAME + "/messages");

    MultivaluedMapImpl formData = new MultivaluedMapImpl();
    formData.add("from", String.format("%s <%s>", fromName, from));
    formData.add("to", "<emanations.me@gmail.com>");
    formData.add("subject", subject);
    formData.add("text", content);

    ClientResponse response = webResource.type(MediaType.APPLICATION_FORM_URLENCODED)
        .post(ClientResponse.class, formData);

    resp.getWriter().print(response.getStatus());
  }
}
