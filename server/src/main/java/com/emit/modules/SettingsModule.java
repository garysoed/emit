package com.emit.modules;

import com.emit.common.ServletScoped;
import com.emit.model.Settings;
import com.google.common.base.Throwables;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import dagger.Module;
import dagger.Provides;

import javax.servlet.ServletContext;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

@Module(includes = {ServletModule.class})
public class SettingsModule {
  @Provides
  @ServletScoped
  Settings providesSettings(ServletContext servletContext) {
    JsonElement jsonElement = null;
    try {
      jsonElement = new JsonParser()
          .parse(
              new JsonReader(
                  new InputStreamReader(
                      servletContext.getResourceAsStream("/WEB-INF/settings.json"),
                      "UTF-8")));
    } catch (UnsupportedEncodingException e) {
      Throwables.propagate(e);
    }

    Gson gson = new Gson();
    return gson.fromJson(jsonElement, Settings.class);
  }
}
