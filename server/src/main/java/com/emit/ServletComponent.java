package com.emit;

import com.emit.common.ServletScoped;
import dagger.Subcomponent;

@Subcomponent(modules = { ServletModule.class })
@ServletScoped
public interface ServletComponent {
  EmailHandler emailHandler();
}
