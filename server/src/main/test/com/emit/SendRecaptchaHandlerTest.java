package com.emit;

import com.emit.common.ValidationException;
import com.emit.model.Settings;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SendRecaptchaHandlerTest {
  @Mock HttpServletRequest mockRequest;
  @Mock Settings mockSettings;
  @Mock SendRecaptchaHandler.UrlWrapper mockURL;

  private SendRecaptchaHandler handler;

  @Before
  public void setUp() throws Exception {
    handler = new SendRecaptchaHandler(mockRequest, mockSettings, mockURL);
  }

  @Test
  public void send_successful() throws Exception {
    String recaptcha = "recaptcha";
    String secret = "secret";
    when(mockSettings.getRecaptchaSecretKey()).thenReturn(secret);
    when(mockRequest.getParameter("recaptcha")).thenReturn(recaptcha);

    HttpURLConnection mockConnection = mock(HttpURLConnection.class);
    when(mockURL.openConnection()).thenReturn(mockConnection);

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    JsonObject jsonResponse = new JsonObject();
    jsonResponse.add("success", new JsonPrimitive(true));
    InputStream inputStream = new ByteArrayInputStream(jsonResponse.toString().getBytes());

    when(mockConnection.getOutputStream()).thenReturn(outputStream);
    when(mockConnection.getInputStream()).thenReturn(inputStream);
    when(mockConnection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_OK);

    handler.send();

    assertThat(outputStream.toString())
        .isEqualTo(String.format("secret=%s&response=%s", secret, recaptcha));
  }

  @Test
  public void send_failedRecaptcha() throws Exception {
    String recaptcha = "recaptcha";
    String secret = "secret";
    when(mockSettings.getRecaptchaSecretKey()).thenReturn(secret);
    when(mockRequest.getParameter("recaptcha")).thenReturn(recaptcha);

    HttpURLConnection mockConnection = mock(HttpURLConnection.class);
    when(mockURL.openConnection()).thenReturn(mockConnection);

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    JsonObject jsonResponse = new JsonObject();
    jsonResponse.add("success", new JsonPrimitive(false));
    InputStream inputStream = new ByteArrayInputStream(jsonResponse.toString().getBytes());

    when(mockConnection.getOutputStream()).thenReturn(outputStream);
    when(mockConnection.getInputStream()).thenReturn(inputStream);
    when(mockConnection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_OK);

    try {
      handler.send();
      fail("Expected ValidationException thrown");
    } catch (ValidationException e) {
      assertThat(e).hasMessage("Recaptcha check failed");
    }
  }

  @Test
  public void send_failedSendRecaptcha() throws Exception {
    when(mockSettings.getRecaptchaSecretKey()).thenReturn("secret");
    when(mockRequest.getParameter("recaptcha")).thenReturn("recaptcha");

    HttpURLConnection mockConnection = mock(HttpURLConnection.class);
    when(mockURL.openConnection()).thenReturn(mockConnection);

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    when(mockConnection.getOutputStream()).thenReturn(outputStream);
    when(mockConnection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_NOT_FOUND);

    try {
      handler.send();
      fail("Expected ValidationException thrown");
    } catch (ValidationException e) {
      assertThat(e).hasMessage("Sending Recaptcha check failed");
    }
  }

  @Test
  public void send_failedNoRecaptcha() throws Exception {
    when(mockSettings.getRecaptchaSecretKey()).thenReturn("secret");

    try {
      handler.send();
      fail("Expected ValidationException thrown");
    } catch (ValidationException e) {
      assertThat(e).hasMessage("Recaptcha is required");
    }
  }
}