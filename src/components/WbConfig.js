import DefaultConfig from "../default-config.json";
import axios from "axios";

/**
 * @typedef {Object} ElasticConfigLike
 * @property {string} url
 * @property {string} key
 */

/**
 * @typedef {Object} ConfigLike
 * @property {string} blockchainUrl
 * @property {string} fileproxyUrl
 * @property {ElasticConfigLike} elastic
 */

/**
 * @returns {Promise<ConfigLike>}
 */
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

/**
 * @param {Promise<ConfigLike>} config
 * @param {Promise<ConfigLike>} defaultConfig
 * @param {string} field
 * @returns {*}
 */
function configGet(config, defaultConfig, field) {
  return config.then((cfg) => cfg[field] ?? defaultConfig[field]);
}

class ElasticSubConfig {
  /**
   * @param {Promise<ConfigLike>} promisedSubConfig
   */
  constructor(promisedSubConfig) {
    this.subconfig = promisedSubConfig;
  }

  /**
   * @private
   * @param {string} field
   * @returns {Promise<*>}
   */
  cget(field) {
    return configGet(this.subconfig, DefaultConfig.elastic, field);
  }

  /**
   * @returns {Promise<string>}
   */
  get url() {
    return this.cget("url");
  }

  /**
   * @returns {Promise<string>}
   */
  get key() {
    return this.cget("key");
  }
}

class Config {
  /**
   * @param {Promise<ConfigLike>} promisedConfig
   */
  constructor(promisedConfig) {
    this.config = promisedConfig;
  }

  /**
   * @private
   * @param {string} field
   * @returns {Promise.<*>}
   */
  cget(field) {
    return configGet(this.config, DefaultConfig, field);
  }

  /**
   * @returns {Promise<string>}
   */
  get blockchainUrl() {
    return this.cget("blockchainUrl");
  }

  /**
   * @returns {Promise<string>}
   */
  get fileproxyUrl() {
    return this.cget("fileproxyUrl");
  }

  /**
   * @returns {ElasticSubConfig}
   */
  get elastic() {
    return new ElasticSubConfig(this.config.then((cfg) => cfg.elastic));
  }
}

/**
 * @returns {Config}
 */
export function fetchConfig() {
  return new Config(rawFetchConfig());
}
