package com.emit;

import com.emit.common.ValidationException;
import com.emit.common.Validator;
import com.emit.model.Settings;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;


public class SendRecaptchaHandler {
  private final HttpServletRequest request;
  private final Settings settings;
  private final UrlWrapper sendUrl;

  @Inject
  SendRecaptchaHandler(HttpServletRequest request, Settings settings) {
    this(request, settings, new UrlWrapper("https://www.google.com/recaptcha/api/siteverify"));
  }

  SendRecaptchaHandler(HttpServletRequest request, Settings settings, UrlWrapper sendUrl) {
    this.request = request;
    this.settings = settings;
    this.sendUrl = sendUrl;
  }

  void send() throws ValidationException, IOException {
    Validator validator = Validator.newInstance();
    String recaptcha = validator.check(request.getParameter("recaptcha"))
        .exists()
        .orError("Recaptcha is required");

    if (validator.hasError()) {
      throw validator.getException();
    }

    HttpURLConnection connection = sendUrl.openConnection();
    connection.setDoOutput(true);
    connection.setRequestMethod("POST");
    connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

    OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());
    writer.write("secret=" + settings.getRecaptchaSecretKey() + "&");
    writer.write("response=" + recaptcha);
    writer.close();

    validator.check(connection.getResponseCode())
        .isEqualTo(HttpURLConnection.HTTP_OK)
        .orError("Sending Recaptcha check failed");

    if (validator.hasError()) {
      throw validator.getException();
    }

    JsonElement jsonElement = new JsonParser()
        .parse(new JsonReader(new InputStreamReader(connection.getInputStream())));
    JsonObject jsonResponse = jsonElement.getAsJsonObject();

    validator.check(jsonResponse.get("success").getAsBoolean())
        .isEqualTo(true)
        .orError("Recaptcha check failed");

    if (validator.hasError()) {
      throw validator.getException();
    }
  }

  static class UrlWrapper {
    private final URL url;

    public UrlWrapper(String urlString) {
      URL url;
      try {
        url = new URL(urlString);
      } catch (MalformedURLException e) {
        e.printStackTrace();
        url = null;
      }
      this.url = url;
    }

    HttpURLConnection openConnection() throws IOException {
      return (HttpURLConnection) url.openConnection();
    }
  }
}
