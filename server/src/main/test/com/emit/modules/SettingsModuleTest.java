package com.emit.modules;

import com.emit.model.Settings;
import com.google.gson.JsonObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.servlet.ServletContext;
import java.io.ByteArrayInputStream;

import static com.google.common.truth.Truth.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SettingsModuleTest {
  @Mock ServletContext mockServletContext;

  private SettingsModule module;

  @Before
  public void setUp() throws Exception {
    module = new SettingsModule();
  }

  /**
   * Should return the correct settings object.
   */
  @Test
  public void providesSettings_normal() {
    String apiKey = "apiKey";
    String domainName = "domainName";

    JsonObject json = new JsonObject();
    json.addProperty("mailgunApiKey", apiKey);
    json.addProperty("mailgunDomainName", domainName);

    when(mockServletContext.getResourceAsStream("/WEB-INF/settings.json"))
        .thenReturn(new ByteArrayInputStream(json.toString().getBytes()));

    Settings settings = module.providesSettings(mockServletContext);

    assertThat(settings.getMailgunApiKey()).isEqualTo(apiKey);
    assertThat(settings.getMailgunDomainName()).isEqualTo(domainName);
  }
}