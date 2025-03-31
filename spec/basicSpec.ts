"use strict";
import 'qcobjects';

describe('QCObjects SDK', () => {
    it('should have core SDK functionality available', () => {
        const sdk = global._sdk_;
        expect(sdk).toBeDefined();
        expect(sdk.Fade).toBeDefined();
        expect(sdk.NotificationComponent).toBeDefined();
    });
    it('should provide Component functionality', () => {
        const qcobjects = global.QCObjects;
        expect(qcobjects.Component).toBeDefined();
        const testComponent = new qcobjects.Component({});
        expect(testComponent).toBeInstanceOf(qcobjects.Component);
    });
});
//# sourceMappingURL=basicSpec.js.map