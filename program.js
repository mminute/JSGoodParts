document.writeln('Hello World');

// Function.prototype.method = function (name, func) {
//   this.prototype[name] = func;
//   return this;
// };


// ========================================
// Object creation with prototype
// ========================================
if(typeof Object.create !=='function') {
  Object.create = function(o) {
    var F = function(){};
    F.prototype = o;
    return new F();
  }
}

var stooge = {
  first_name:"Jerome",
  last_name:"Howard"
};

var another_stooge = Object.create(stooge);
// ========================================


// // Functions =======================================
// // Method Invocation Pattern
// // =================================================
var add = function(a,b) {
  return a+b;
};

var myObject = {
  value:0,
  increment: function(inc) {
    this.value += typeof inc === 'number' ? inc:1;
  }
};

myObject.increment();
document.writeln(myObject.value);  // 1
myObject.increment(2);
document.writeln(myObject.value);  // 3
// // ================================================
// Function Invocation Pattern
// ===================================================
myObject.double = function() {
  var that = this; // Workaround
  var helper = function() {
    that.value = add(that.value, that.value);
  };

  helper();
};

myObject.double();
document.writeln(myObject.value);

// // ================================================
// Constructor Invocation Pattern
// It makes an object with a status property
// ===================================================
var Quo = function(string){
  this.status = string;
};
// Give all instances of Quo a public method called get_status
Quo.prototype.get_status = function(){
  return this.status;
};

// Make an instance of Quo
var myQuo = new Quo('confused');
document.writeln(myQuo.get_status()); // confused

// // ================================================
// Apply Invocation Pattern
// ===================================================
var array = [3,4];
var sum = add.apply(null, array); // sum === 7
document.writeln(sum);

// Make an obj w a status member.

var statusObject = {status:'A-OK'};

// statusObject does not inherit from Quo.prototype,
// but we can invoke get_status method on statusObject
// even though statusObject does not have a get_status method

var status = Quo.prototype.get_status.apply(statusObject); 
document.writeln(status); // status === 'A-OK'

// ME: So you identify a function then use 
// apply to call that function on an object
// that does not have the method being applied


// // ================================================
// Arguements
// ===================================================
// Make a function that adds a lot of stuff

// Note that defining the variable sum inside of
// the function does not interfere with the sum
// defined outside of the function.
// The function only sees the inner one.

var sum = function(){
  var i, sum = 0;
  for (i=0; i<arguments.length; i+=1) {
    sum += arguments[i];
  }
  return sum;
};

document.writeln(sum(4,8,16,32,64));


// ================================================
// Exceptions
// ================================================

var addAgain = function(a,b) {
  if(typeof a !== 'number' || typeof b !=='number') {
    throw {
      name: 'TypeError',
      message: 'addAgain needs numbers'
    };
  }
  return a+b;
};

var tryIt = function() {
  try {
    addAgain('se7en');
  } catch(e) {
    document.writeln(e.name + ': ' + e.message)
  }
}

tryIt();

// ================================================
// Augmenting Types
// ================================================
  // Function.prototype.method = function(name, func) {
  //   this.prototype[name] = func;
  //   return this;
  // };

// Add a method conditionally
Function.prototype.method = function(name,func) {
  if(!this.prototype[name]) {
    this.prototype[name] = func;
    return this;
  }
};

Number.method('integer', function() {
  return Math[this<0 ? 'ceil' : 'floor'](this);
});

document.writeln((-10/3).integer()); // -3

String.method('trim', function(){
  return this.replace(/^\s+|\s+$/g,'')
});

document.writeln('"' + "  neat  ".trim() + '"');


// ================================================
// Recursion
// ================================================
var hanoi = function(disc,src,aux,dst) {
  if (disc > 0) {
    hanoi(disc-1,src,dst,aux);
    document.writeln('Move disc ' + disc + ' from ' + src + ' to ' + dst);
    hanoi(disc-1,aux,src,dst);
  }
};

hanoi(3,'Source','Aux','Destination');

// Traversing the DOM
// Define a walk function that visits every node of the tree
// in HTML source order, starting from a given node.
// It invokes a function, passing in each node in turn.
// walkTheDom calls itself to process each of the child nodes
var walkTheDom = function walk(node,func) {
  func(node);
  node = node.firstChild;
  while (node) {
    walk(node,func);
    node = node.nextSibling;
  }
};

// Define a getElementByAttribute function.
// It taked an attribute name string
// and an optional matching value.
// It call walkTheDom, passing it a function
// that looks for an attribute name in the node.
// The matching nodes are accumulated in a results array.

var getElementByAttribute = function(att, value) {
  var results = [];

  walkTheDom(document.body, function(node) {
    var actual = node.nodeType === 1 && node.getAttribute(att);
    if (typeof actual === 'string' && (actual === value || typeof value !== 'string')) {
      results.push(node);
    }
  });
  return results;
};

// Make a factorial function with tail recursion.
// It is tail recursive bc it returns the result of calling itself.
// Javascript does not currently optimize for this form.

var factorial = function factorial(i,a){
  a = a || 1
  if(i < 2) {
    return a;
  }
  return factorial(i-1, a*i);
};

document.writeln(factorial(4)); // 24

// =========================================
// Closure
// =========================================
var myObject = (function() {
  var value = 0;

  return {
    increment: function(inc) {
      value += typeof inc === 'number' ? inc : 1;
    },
    getValue: function() {
      return value;
    }
  };
}());

myObject.increment(42);
document.writeln(myObject.getValue());

// Defines and executes a function that creates
// an object with two methods that have access to
// the value variable

/* Create a maker function called quo2.
It makes an object with a get_status method
and a private status property */

var quo2 = function(status) {
  return {
    get_status: function() {
      return status;
    }
  };
};

// Make an instance of quo2

var myQuo = quo2('amazed');

document.writeln(myQuo.get_status());

/* even though quo2 has run, the get_status
method still has access to the status variable
even though quo2 has already returned.
get status does not have a access to a copy of the parameter,
it has access to the parameter itself b/c the function has
ACCESS TO THE CONTEXT IN WHICH IT WAS CREATED -- CLOSURE */



/* Define a function that sets a DOM node's color
to yellow and then fade it to white. */

var fade = function(node) {
  var level = 1;
  var step = function() {
    var hex = level.toString(16);
    node.style.backgroundColor = '#FFFF' + hex + hex;
    if (level < 15) {
      level += 1;
      setTimeout(step, 100);
    }
  };
  setTimeout(step, 100);
};

fade(document.body);

// Note: setTimeout takes two args, a function to execute
// and an amount of time to wait before executing a function



// ===================
// Module
// ===================
String.method('deentityify', function () {
  // The entity table.  It maps names to characters

  var entity = {
    quot:'"',
    lt:'<',
    gt:'>'
  };

  // Return the deentityify method
  return function () {
    // This is the deentityify method.  It calls the string replace
    // method, looking for substrings that start with '&' and end with ';'
    // If the characters in between are in the entity table,
    // then replace the entity with the character from the table.

    return this.replace(/&([^&;]+);/g,
      function (a,b) {
        var r = entity[b];
        return typeof r === 'string' ? r : a;
      }
    );
  };
}());

document.writeln(
  '&lt;&quot;&gt;'.deentityify()
); // <">






var serial_maker = function() {
  // Produce an object that produces unique strings
  // A unique string is made of two parts: prefix and sequence number
  // The object comes with methods for setting the prefix and sequence number
  // and a gensym method that produces unique strings

  var prefix = '';
  var seq = 0;
  return {
    set_prefix: function(p) {
      prefix = String(p);
    },
    set_seq: function(s) {
      seq = s;
    },
    gensym: function() {
      var result = prefix + seq;
      seq += 1;
      return result;
    }
  };
};

var seqer = serial_maker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym(); // unique is "Q1000"
document.writeln(unique);
var unique = seqer.gensym();
document.writeln(unique); // unique is "Q1001"
// since no 'this' or 'that' there is no way to compromise the seqer

// ===================
// Cascade
// ===================
// example does not function
// TypeError- .move is not a function, etc
// document.getElementById('myBoxDiv')
//   .move(350,150)
//   .width(100)
//   .height(100)
//   .color('red')
//   .border('10px outset')
//   .padding('4px')
//   .appendText("Please stand by...")
//   .on('mousedown', function(m) {
//     this.startDrag(m, this.getNinth(m));
//   })
//   .on('mousemove', 'drag')
//   .on('mouseup', 'stopDrag')
//   .later(2000, function() {
//     this.color('yellow')
//         .setHTML('What hath God wraught?')
//         .slide(400,40,200,200);
//   })
//   .tip('This box is resizeable');

// ===================
// Curry
// ===================
// The apply() method calls a function with a 
// given this value and arguments provided as an array (or an array-like object).
// fun.apply(thisArg, [argsArray])

Function.method('curry', function(){
  var slice = Array.prototype.slice;
  var args = slice.apply(arguments); // turns the array-like collection of arguments into an actual array
  var that = this; // 'this' refers to the function that is being curryed

  return function() {
    // here 'arguments' are the parameters passed into the call of 
    // the new, curryed function (add1 in the example below)
    // different from the arguments refereced above (the parameters passed
    // into the '.curry' call)
    return that.apply(null, args.concat(slice.apply(arguments)));
    // the function being curryed ('that') called with 'this' set to null
    // args the collection of parameters passed to the call to curry
    // which is concatenated with the arguements passed into the call to 'add1'
  };
});

var add1 = add.curry(1);
document.writeln('Currying: ' + add1(6));

// ===================
// Memoization
// ===================
document.writeln('');

var fibCalls = 0;

var fibonacci = function(n) {
  fibCalls+=1;
  return n < 2 ? n : fibonacci(n-1) + fibonacci(n-2);
};

for(var i=0 ; i <= 10; i += 1) {
  document.writeln('//' + i + ': ' + fibonacci(i));
}
document.writeln('Called fibonacci ' + fibCalls + ' times without memoization.');
// this way calls fibonacci 453 times.
// Called directly 11 times and by itself in computing values 442 times
// many calls repeated an already calculated value.

// When memoized:
fibCalls = 0;

var fibonacciMemoized = (function() {
  var memo = [0,1];
  var fib = function(n) {
    var result = memo[n];
    fibCalls+=1;
    if (typeof result !== 'number') {
      result = fib(n-1) + fib(n-2);
      memo[n] = result;
    }
    return result;
  };
  return fib;
}());

document.writeln('');

for(var i=0 ; i <= 10; i += 1) {
  document.writeln('//' + i + ': ' + fibonacciMemoized(i));
}

document.writeln('Called fibonacci ' + fibCalls + ' times with memoization.');

// Generalized memoization
var memoizer = function(memo, formula) {
  var recur = function(n) {
    fibCalls += 1;
    var result = memo[n];
    if (typeof result !== 'number') {
      result = formula(recur, n);
      memo[n] = result;
    }
    return result;
  };
  return recur;
};

document.writeln('');
document.writeln('Fibonacci built with memoizer');
fibCalls = 0;

var fibonacciWithMemoizer = memoizer([0,1], function(recur, n) {
  return recur(n-1) + recur(n-2)
});

for(var i=0 ; i <= 10; i += 1) {
  document.writeln('//' + i + ': ' + fibonacciWithMemoizer(i));
}
document.writeln('Called fibonacciBuiltWithMemoizer ' + fibCalls + ' times.');


document.writeln('');
document.writeln('Factorial built with memoizer');
fibCalls = 0;

var factorialWithMemoizer = memoizer([1,1], function(recur, n){
  return n * recur(n-1)
});

for(var i=0 ; i <= 10; i += 1) {
  document.writeln('//' + i + ': ' + factorialWithMemoizer(i));
}

document.writeln('Called factorialBuiltWithMemoizer ' + fibCalls + ' times.');


// =========================================================
// Inheritance
// =========================================================

// ================
// Pseudoclassical
// ================
Function.method('new', function(){
  // Create a new object that inherits from the constructor's prototype.
  var that = Object.create(this.prototype);
  // Invoke the constructor, binding -this- to the new object
  var other = this.apply(that, arguments);
  // If its return value isn't an object, substitute the new object
  return (typeof other === 'object' && other) || that;
})

var Mammal = function (name) {
  this.name = name;
};

Mammal.prototype.getName = function () {
  return this.name;
};

Mammal.prototype.says = function () {
  return this.saying || '';
};

var myMammal = new Mammal('Herb the Mammal');
var name = myMammal.getName();

document.writeln(name);

var Cat = function (name) {
  this.name = name;
  this.saying = 'meow';
}; // at this point Cat.prototype is a generic object

// Replace Cat prototype with a new instace of Mammal
Cat.prototype = new Mammal();

// Augment the new prototype with purr and get_name mehtods.
Cat.prototype.purr = function (n) {
  var i, s = '';
  for (i = 0; i < n; i += 1) {
    if (s) {
      s += '-';
    }
    s += 'r';
  }
  return s;
};

Cat.prototype.get_name = function () {
  return this.says() + ' ' + this.name + ' ' + this.says();
};

var myCat = new Cat('Henrietta');
var says = myCat.says(); // meow
var purr = myCat.purr(5); // 'r-r-r-r-r'
var name = myCat.get_name(); // 'meow Henrietta meow'

document.writeln('');
document.writeln(says);
document.writeln(purr);
document.writeln(name);

// Pseudoclassical coverup - inherits hack
// Allows chaining of method definitions
Function.method('inherits', function (Parent) {
  this.prototype = new Parent();
  return this;
});

var Feline = function (name) {
  this.name = name;
  this.saying = 'meow';
}.
  inherits(Mammal).
  method('purr', function (n) {
    var i, s = '';
    for (i = 0; i < n; i +=1) {
      if (s) {
        s += '-';
      }
      s += 'r';
    }
    return s;
  }).
  method('get_name', function () {
    return this.says() + ' ' + this.name + ' ' + this.says();
  });

var myFeline = new Feline('Baxter');
document.writeln("My cat's name is: " + myFeline.get_name());

// ================
// Prototypal
// ================

var anotherCat = Object.create(myMammal);
anotherCat.name = 'Some Cat';
anotherCat.saying = 'buak!';
anotherCat.purr = function (n) {
  var i, s = '';
  for (i = 0; i < n; i += 1) {
    if (s) {
      s += '-';
    }
    s += 'z';
  }
  return s;
};

anotherCat.get_name = function () {
  return this.says() + ' ' + this.name + ' ' + this.says()
};

document.writeln('');
document.writeln(anotherCat.get_name());
console.log(myMammal); // origional object is not affected

// ================
// Functional
// ================
var mammal = function (spec) {
  var that = {};

  that.get_name = function () {
    return spec.name;
  };

  that.says = function () {
    return spec.saying || '';
  };
  return that;
};

var mammal001 = mammal({name:'Herbert'});

document.writeln('');
document.writeln('Functional Inheritance');
document.writeln(mammal001.get_name());

var cat = function (spec) {
  spec.saying = spec.saying || 'meow';
  var that = mammal(spec);
  that.purr = function (n) {
    var i, s = '';
    for (i = 0; i < n; i += 1) {
      if (s) {
        s += '-';
      }
      s += 'r'
    }
    return s;
  };

  that.get_name = function () {
    return that.says() + ' ' + spec.name + ' ' + that.says();
  };
  return that;
};

var cat001 = cat({name:'Dizzy'});

document.writeln(cat001.get_name());
document.writeln(cat001.purr(5));

// Superior aka super method
Object.method('superior', function (name) {
  var that = this, method = that[name];
  return function () {
    return method.apply(that, arguments);
  };
});

var coolcat = function (spec) {
  var that = cat(spec), super_get_name = that.superior('get_name');
  // looks to cat's get_name and uses the apply method to pass the argument

  that.get_name = function (n) {
    return ('like ' + super_get_name() + ' baby');
  };
  return that;
};

var myCoolCat = coolcat({name:'Bixby'})
var name = myCoolCat.get_name();

document.writeln('Super methods: ' + name);