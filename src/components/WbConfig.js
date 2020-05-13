import DefaultConfig from "../default-config.json";
import axios from "axios";

async function rawFetchConfig() {
  if (process.env.NODE_ENV === "development") {
    // Won't fail, because it is required at build time
    return await import("../dev-config.json");
  } else {
    try {
      return (await axios.get("/config.json")).data;
    } catch (e) {
      console.error(
        "Server failed to provide a config; using hard-coded default",
        "error:",
        e
      );
    }
    return {};
  }
}

function configGet(config, defaultConfig, field) {
  return config.then((cfg) => cfg[field] ?? defaultConfig[field]);
}

class ElasticSubConfig {
  constructor(promisedSubConfig) {
    this.subconfig = promisedSubConfig;
  }

  cget(field) {
    return configGet(this.subconfig, DefaultConfig.elastic, field);
  }

  get url() {
    return this.cget("url");
  }

  get key() {
    return this.cget("key");
  }
}

class Config {
  constructor(promisedConfig) {
    this.config = promisedConfig;
  }

  cget(field) {
    return configGet(this.config, DefaultConfig, field);
  }

  get blockchainUrl() {
    return this.cget("blockchainUrl");
  }

  get fileproxyUrl() {
    return this.cget("fileproxyUrl");
  }

  get elastic() {
    return new ElasticSubConfig(this.config.then((cfg) => cfg.elastic));
  }
}

export async function fetchConfig() {
  return new Config(rawFetchConfig());
}
