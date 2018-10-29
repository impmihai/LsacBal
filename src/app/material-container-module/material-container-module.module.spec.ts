import { MaterialContainerModuleModule } from './material-container-module.module';

describe('MaterialContainerModuleModule', () => {
  let materialContainerModuleModule: MaterialContainerModuleModule;

  beforeEach(() => {
    materialContainerModuleModule = new MaterialContainerModuleModule();
  });

  it('should create an instance', () => {
    expect(materialContainerModuleModule).toBeTruthy();
  });
});
