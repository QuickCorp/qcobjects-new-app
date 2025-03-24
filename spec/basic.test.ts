import QCObjectsSDK from 'qcobjects-sdk';
import { Component } from 'qcobjects';

describe('QCObjects SDK', () => {
  it('should have core SDK functionality available', () => {
    expect(QCObjectsSDK).toBeDefined();
    expect(QCObjectsSDK.Fade).toBeDefined();
    expect(QCObjectsSDK.NotificationComponent).toBeDefined();
  });

  it('should provide Component functionality', () => {
    expect(Component).toBeDefined();
    const testComponent = new Component();
    expect(testComponent).toBeInstanceOf(Component);
  });
}); 