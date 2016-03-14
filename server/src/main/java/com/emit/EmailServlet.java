package com.emit;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Properties;


public class EmailServlet extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    String to = req.getParameter("to");
    String subject = req.getParameter("subject");
    String content = req.getParameter("content");
    resp.setContentType("text/plain");

    Properties props = new Properties();
    Session session = Session.getDefaultInstance(props, null);

    try {
      Message msg = new MimeMessage(session);
      msg.setFrom(new InternetAddress("emanations.me@gmail.com", "Emanations.me"));
      msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to, to));
      msg.setSubject(subject);
      msg.setText(content);
      Transport.send(msg);
    } catch (AddressException e) {
      resp.getWriter().println("Error sending email: " + e.getMessage());
    } catch (MessagingException e) {
      resp.getWriter().println("Error sending email: " + e.getMessage());
    }
  }
}
