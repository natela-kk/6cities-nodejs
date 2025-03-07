import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from './config.interface';
import { config } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface';
import { configSchema, ConfigSchema } from './config.schema.js';
import { Component } from '../../types/component.types.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if(parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exist');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}
