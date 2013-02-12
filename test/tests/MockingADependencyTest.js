define('app/ADependency', {
    sum: sinon.spy()
});

define(function(require) {
  // Grab the mocked version so I can read the spy!
  var ADependency = require('app/ADependency');

  // Go and grab the file under test.
  var MockingADependency = require('app/MockingADependency');

  // Run the test!
  describe('MockingADependency', function() {
    it('should call sum', function() {
      MockingADependency.sum(10, 20);
      expect(ADependency.sum).to.be.calledWith(10, 20);
    });

    it('should call sum another way', function() {

      // We are required to understand the manipulated state of the object, this violates the principle
      // of a clean slate for each test. Adding reset methods to each dependency is a silly option just
      // for testing, you should be able to mock the same dependency *again* in this file without the 
      // overhead and pain of another require context. This simply breaks the option of maps and paths
      // for mocking.
      ADependency.sum = sinon.spy();

      MockingADependency.sum(10, 20);

      // Oh no! This test mock has shared state because we couldn't mock it separately here!
      expect(ADependency.sum).to.be.calledOnce;
    });
  });


  // We are reduced this, gak.
  describe('MockingADependency (with multiple child mocks)', function() {

    it('should call sum', function(done) {
      define('app/ADependency', {
        sum: sinon.spy()
      });

      // This sucks because I lose my configuration because require.js doesn't
      // expose it for cloning. That means paths, maps, shims... gone. Expose config
      // for less pain.
      var context = requirejs.config({
        baseUrl: requirejs.s.contexts._.config.baseUrl, // GAK
        context: 'arbitrary-context'
      });

      context(['app/MockingADependency', 'app/ADependency'], function(MockingADependency, ADependency) {
        // Yikes we are on another turn of the event loop here so exceptions won't be caught by the runner
        // anymore, unfortunately we had to do this inside of the test definition or else we would be
        // managing our mocking ourside of our test. So if this does error it will say... "Script Error"
        // because it will have been bubbled to window, less useful.
        MockingADependency.sum(2, 2);
        expect(ADependency.sum).to.be.calledWith(2, 2);
        done();
      });
    });
  });
});