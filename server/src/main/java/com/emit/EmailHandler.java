package com.emit;

import com.emit.common.ServletScoped;
import com.emit.model.Settings;
import com.google.common.annotations.VisibleForTesting;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.core.util.MultivaluedMapImpl;

import javax.inject.Inject;
import javax.inject.Provider;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.IOException;

public class EmailHandler {
  private final Settings settings;
  private final Provider<Client> clientProvider;

  @Inject
  EmailHandler(@ServletScoped Settings settings) {
    this(settings, new Provider<Client>() {
      @Override
      public Client get() {
        return Client.create();
      }
    });
  }

  @VisibleForTesting
  EmailHandler(Settings settings, Provider<Client> clientProvider) {
    this.settings = settings;
    this.clientProvider = clientProvider;
  }

  public void post(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    String mailgunApiKey = settings.getMailgunApiKey();
    String mailgunDomainName = settings.getMailgunDomainName();

    String from = req.getParameter("from");
    String fromName = req.getParameter("fromName");
    String subject = req.getParameter("subject");
    String content = req.getParameter("content");
    resp.setContentType("text/plain");

    Client client = this.clientProvider.get();
    client.addFilter(new HTTPBasicAuthFilter("api", mailgunApiKey));
    WebResource webResource = client.resource(
        "https://api.mailgun.net/v3/" + mailgunDomainName + "/messages");

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
