# Mocking A Dependency

Mocking a dependency is a critical piece of proper unit testing, modules should be tested in isolation so that one can quickly diagnose exactly where the problem is if a particular test fails rather then manually searching all the various integration tests.

## The Typically Suggested (and insufficient) Approach

The most commonly suggested approach for mocking AMD modules is to define a named module explicitly above your require call, so if Module B depends on Module A:

```javascript
  define('A', function() {
    
  });

  require(['B'], ...); // Will use the above mocked A
```

This breaks down when you need to mock the same dependency multiple times because you are forced to create another context for each test!

```javascript

define('A', function() {
  
});

var context = requirejs.config(); // We lose our existing configuration here and have to manually copy it from require.js internals.

context(['A'], ...)
```

This is an awful lot of code to simply mock a dependency for a test not to mention we now have to fight tooth and nail against the asynchronous nature of each require. If our tests throw an error we also lose the stack trace because it usually occurs within the next turn of the event loop.

## Another Common (and insufficient) Approach

Using Map and Paths have these same problems, except even more so as their is simply no way to work around the multiple mocks per one require.js instance that we work around using multiple contexts.


## A Shared Problem

Unfortunately both these approaches also make the need to stub or spy on a dependencies modules particularly hard because their is simply no reference to them unless you explicitly depend on the mocked module as well. This means you manually have to require each module your module under test uses to spy on it. You need handles to an objects dependency to be able to mock the API using tools like sinon. 

```javascript
define('A', function() {
  return {
    method: function(){}
  }
});

require(['B', 'A'], function(B, A) {
  // If B already used A we simply cannot stub it this late in the game, but lets suppose it won't use
  // A until we call a function.
  sinon.mock(A); // Unfortunately we had to pull it in ourself, Also, if B has already created an instance of A in the case that it is a class... checkmate.
  B.someMethodThatCallsA();


});