package com.emit;

import com.emit.common.ServletScoped;
import com.emit.common.ValidationException;
import com.emit.common.Validator;
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

public class SendEmailHandler {
  private final Settings settings;
  private final Provider<Client> clientProvider;

  @Inject
  SendEmailHandler(@ServletScoped Settings settings) {
    this(settings, new Provider<Client>() {
      @Override
      public Client get() {
        return Client.create();
      }
    });
  }

  @VisibleForTesting
  SendEmailHandler(Settings settings, Provider<Client> clientProvider) {
    this.settings = settings;
    this.clientProvider = clientProvider;
  }

  public void post(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException, ValidationException {
    // Validates the data
    Validator validator = Validator.newInstance();
    String from = validator.check(req.getParameter("from")).exists().orError("from is required");
    String fromName = validator.check(req.getParameter("fromName"))
        .exists()
        .orError("fromName is required");
    String subject = validator.check(req.getParameter("subject"))
        .exists()
        .orError("subject is required");
    String content = validator.check(req.getParameter("content"))
        .exists()
        .orUse("");

    if (validator.hasError()) {
      throw validator.getException();
    }

    String mailgunApiKey = settings.getMailgunApiKey();
    String mailgunDomainName = settings.getMailgunDomainName();

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
