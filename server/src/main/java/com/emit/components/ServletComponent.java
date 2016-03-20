package com.emit.components;

import com.emit.EmailHandler;
import com.emit.modules.ServletModule;
import com.emit.modules.SettingsModule;
import com.emit.common.ServletScoped;
import dagger.Subcomponent;

@Subcomponent(modules = { ServletModule.class, SettingsModule.class })
@ServletScoped
public interface ServletComponent {
  EmailHandler emailHandler();
}
