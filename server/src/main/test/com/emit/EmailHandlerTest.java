package com.emit;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.inject.Provider;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.ByteArrayInputStream;
import java.io.PrintWriter;

import static com.emit.EmailHandler.MAILGUN_DOMAIN_NAME;
import static com.google.common.truth.Truth.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class EmailHandlerTest {
  @Mock ServletContext mockServletContext;
  @Mock Client mockClient;

  private EmailHandler handler;

  @Before
  public void setUp() throws Exception {
    handler = new EmailHandler(mockServletContext, new Provider<Client>() {
      @Override
      public Client get() {
        return mockClient;
      }
    });
  }

  /**
   * Tests that post sends the data correctly.
   */
  @Test
  public void postNormal() throws Exception {
    String apiKey = "apiKey";
    String from = "from";
    String fromName = "fromName";
    String subject = "subject";
    String content = "content";
    int status = 200;
    when(mockServletContext.getResourceAsStream("/WEB-INF/api.key"))
        .thenReturn(new ByteArrayInputStream(apiKey.getBytes()));

    HttpServletRequest mockHttpServletRequest = mock(HttpServletRequest.class);
    when(mockHttpServletRequest.getParameter("from")).thenReturn(from);
    when(mockHttpServletRequest.getParameter("fromName")).thenReturn(fromName);
    when(mockHttpServletRequest.getParameter("subject")).thenReturn(subject);
    when(mockHttpServletRequest.getParameter("content")).thenReturn(content);

    ClientResponse mockClientResponse = mock(ClientResponse.class);
    when(mockClientResponse.getStatus()).thenReturn(status);

    WebResource.Builder mockWebResourceBuilder = mock(WebResource.Builder.class);
    when(mockWebResourceBuilder.post(eq(ClientResponse.class), any(MultivaluedMapImpl.class)))
        .thenReturn(mockClientResponse);

    WebResource mockWebResource = mock(WebResource.class);
    when(mockWebResource.type(MediaType.APPLICATION_FORM_URLENCODED))
        .thenReturn(mockWebResourceBuilder);

    when(mockClient.resource("https://api.mailgun.net/v3/" + MAILGUN_DOMAIN_NAME + "/messages"))
        .thenReturn(mockWebResource);

    PrintWriter mockPrintWriter = mock(PrintWriter.class);
    HttpServletResponse mockHttpServletResponse = mock(HttpServletResponse.class);
    when(mockHttpServletResponse.getWriter()).thenReturn(mockPrintWriter);

    handler.post(mockHttpServletRequest, mockHttpServletResponse);

    verify(mockPrintWriter).print(status);

    ArgumentCaptor<MultivaluedMapImpl> formDataCaptor =
        ArgumentCaptor.forClass(MultivaluedMapImpl.class);
    verify(mockWebResourceBuilder).post(eq(ClientResponse.class), formDataCaptor.capture());
    MultivaluedMapImpl formData = formDataCaptor.getValue();
    assertThat(formData.get("from", String.class))
        .containsExactly(String.format("%s <%s>", fromName, from));
    assertThat(formData.get("subject", String.class)).containsExactly(subject);
    assertThat(formData.get("text", String.class)).containsExactly(content);

    verify(mockHttpServletResponse).setContentType("text/plain");
  }
}