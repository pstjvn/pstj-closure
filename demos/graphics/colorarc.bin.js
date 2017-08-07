var m = Array.prototype.forEach ? function(a, c, b) {
  Array.prototype.forEach.call(a, c, b);
} : function(a, c, b) {
  for (var f = a.length, g = "string" == typeof a ? a.split("") : a, h = 0; h < f; h++) {
    h in g && c.call(b, g[h], h, a);
  }
};
function n(a) {
  var c = 0, b;
  for (b in a) {
    c++;
  }
  return c;
}
function q(a) {
  var c = [], b = 0, f;
  for (f in a) {
    c[b++] = f;
  }
  return c;
}
;function r(a) {
  for (var c = document, b = c.createElement("TABLE"), f = b.appendChild(c.createElement("TBODY")), g = 0; g < a; g++) {
    for (var h = c.createElement("TR"), l = 0; 2 > l; l++) {
      h.appendChild(c.createElement("TD"));
    }
    f.appendChild(h);
  }
  return b;
}
;function t(a, c, b, f) {
  this.a = a;
  this.b = c;
  this.width = b;
  this.height = f;
}
t.prototype.toString = function() {
  return "(" + this.a + ", " + this.b + " - " + this.width + "w x " + this.height + "h)";
};
t.prototype.ceil = function() {
  this.a = Math.ceil(this.a);
  this.b = Math.ceil(this.b);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
t.prototype.floor = function() {
  this.a = Math.floor(this.a);
  this.b = Math.floor(this.b);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
t.prototype.round = function() {
  this.a = Math.round(this.a);
  this.b = Math.round(this.b);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
var u = /#(.)(.)(.)/;
function v(a) {
  if (!w.test(a)) {
    throw Error("'" + a + "' is not a valid hex color");
  }
  4 == a.length && (a = a.replace(u, "#$1$1$2$2$3$3"));
  a = a.toLowerCase();
  return [parseInt(a.substr(1, 2), 16), parseInt(a.substr(3, 2), 16), parseInt(a.substr(5, 2), 16)];
}
var w = /^#(?:[0-9a-f]{3}){1,2}$/i;
function x(a) {
  return 1 == a.length ? "0" + a : a;
}
;function y() {
  this.f = this.a = null;
  this.c = [0, 0, 0];
  this.b = [0, 0, 0];
  this.g = [0, 0, 0];
}
function z() {
  var a = A;
  a.a = v("#84a0e8");
  a.f = v("#f29093");
  B(a);
}
function B(a) {
  m(a.a, function(a, b) {
    this.a[b] < this.f[b] ? (this.c[b] = this.f[b] - this.a[b], this.b[b] = 1) : this.a[b] > this.f[b] ? (this.c[b] = this.a[b] - this.f[b], this.b[b] = -1) : (this.c[b] = 0, this.b[b] = 0);
  }, a);
}
;var C = Math.PI + Math.PI / 2, D = 2 * Math.PI, E = Math.PI / 180, F = Math.PI / 180 * 2;
function G() {
  this.a = document.createElement("canvas");
  this.b = this.a.getContext("2d");
}
G.a = void 0;
G.b = function() {
  return G.a ? G.a : G.a = new G;
};
var H = null, A = null, I = 0, J = Array(500);
window.onload = function() {
  A = new y;
  z();
  H = new G;
  setTimeout(function() {
    document.body.appendChild(H.a);
    window.requestAnimationFrame(K);
  }, 500);
};
function K() {
  if (500 <= I) {
    L();
  } else {
    window.requestAnimationFrame(K);
    var a = Date.now(), c = H, b = new t(0, 0, 300, 300), f = A;
    c.a.width = b.width;
    c.a.height = b.height;
    c.b.clearRect(0, 0, b.width, b.height);
    c = c.b;
    var g = b.width / 2;
    b = b.height / 2;
    var h = Math.round(73E4) / 10000 * (b / 100);
    c.lineWidth = 10;
    for (var l = 0; 302 > l; l++) {
      var p = (l + 29) * E + C;
      p > D && (p -= D);
      var e = f;
      for (var k = l / 302, d = 0; 3 > d; d++) {
        0 == e.b[d] ? e.g[d] = e.a[d] : 1 == e.b[d] ? e.g[d] = +(e.c[d] * k + e.a[d]).toFixed() : -1 == e.b[d] && (e.g[d] = +(e.a[d] - e.c[d] * k).toFixed());
      }
      d = e.g;
      e = d[0];
      k = d[1];
      d = d[2];
      e = Number(e);
      k = Number(k);
      d = Number(d);
      if (e != (e & 255) || k != (k & 255) || d != (d & 255)) {
        throw Error('"(' + e + "," + k + "," + d + '") is not a valid RGB color');
      }
      e = "#" + x(e.toString(16)) + x(k.toString(16)) + x(d.toString(16));
      c.beginPath();
      c.strokeStyle = e;
      c.arc(g, b, h, p, p + F, !1);
      c.stroke();
    }
    J[I] = Date.now() - a;
    I++;
  }
}
function L() {
  J.sort(function(a, b) {
    return a - b;
  });
  var a = {};
  J.forEach(function(b) {
    a[b] || (a[b] = 0);
    a[b]++;
  });
  var c = r(n(a));
  document.body.appendChild(c);
  var b = q(a);
  m(c.querySelectorAll("tr"), function(c, g) {
    c = c.querySelectorAll("td");
    c.item(0).textContent = b[g];
    c.item(1).textContent = a[b[g]];
  });
}
;
