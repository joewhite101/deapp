
package com.entando.config;

import org.entando.config.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeappConfigManager {

    private final ConfigService<DeappConfig> configService;

    @Autowired
    public DeappConfigManager(final ConfigService<DeappConfig> configService) {
        this.configService = configService;
    }

    public DeappConfig getDeappConfig() {
        return Optional.ofNullable(configService.getConfig())
            .orElseGet(DeappConfig::getDefault);
    }

    public void update(DeappConfig deappConfig) {
        configService.updateConfig(deappConfig);
    }

}

