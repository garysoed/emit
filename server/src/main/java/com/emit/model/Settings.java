package com.emit.model;

public class Settings {
  private String mailgunApiKey;
  private String mailgunDomainName;
  private String recaptchaSecretKey;

  Settings() {}

  public String getMailgunApiKey() {
    return mailgunApiKey;
  }

  public String getMailgunDomainName() {
    return mailgunDomainName;
  }

  public String getRecaptchaSecretKey() {
    return recaptchaSecretKey;
  }
}
