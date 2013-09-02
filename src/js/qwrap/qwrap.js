/* QWrap 1.0.1(2011-09-27) | qwrap.com | BSD Licensed */
(function() {
	var A = {
		VERSION : "1.0.1",
		RELEASE : "2011-09-27",
		PATH : (function() {
			var B = document.getElementsByTagName("script");
			return B[B.length - 1].src.replace(/(^|\/)[^\/]+\/[^\/]+$/, "$1")
		}()),
		namespace : function(F, C) {
			var B = F.split("."), D = 0, E;
			if (F.indexOf(".") == 0) {
				D = 1;
				C = C || A
			}
			C = C || window;
			for (; E = B[D++];) {
				if (!C[E]) {
					C[E] = {}
				}
				C = C[E]
			}
			return C
		},
		noConflict : (function() {
			var B = window.QW;
			return function() {
				window.QW = B;
				return A
			}
		}()),
		loadJs : function(F, B, E) {
			E = E || {};
			var G = document.getElementsByTagName("head")[0]
					|| document.documentElement, D = document
					.createElement("script"), C = false;
			D.src = F;
			if (E.charset) {
				D.charset = E.charset
			}
			D.onerror = D.onload = D.onreadystatechange = function() {
				if (!C
						&& (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
					C = true;
					if (B) {
						B()
					}
					D.onerror = D.onload = D.onreadystatechange = null;
					G.removeChild(D)
				}
			};
			G.insertBefore(D, G.firstChild)
		},
		loadCss : function(B) {
			var D = document.getElementsByTagName("head")[0]
					|| document.documentElement, C = document
					.createElement("link");
			C.rel = "stylesheet";
			C.type = "text/css";
			C.href = B;
			D.insertBefore(C, D.firstChild)
		},
		error : function(C, B) {
			B = B || Error;
			throw new B(C)
		}
	};
	window.QW = A
}());
(function() {
	var C = {}, A = QW.loadJs, I = [], D = [];
	isLoading = false;
	function H(L, M, K) {
		for ( var J in M) {
			if (K || !(J in L)) {
				L[J] = M[J]
			}
		}
		return L
	}
	function G(J) {
		return !!J && J.constructor == Object
	}
	function B() {
		for ( var N = 0; N < D.length; N++) {
			var O = D[N].callback, J = D[N].moduleNames.split(/\s*,\s*/g), K = true;
			for ( var L = 0; L < J.length; L++) {
				var M = C[J[L]];
				if (M.loadStatus != 2
						&& !(M.loadedChecker ? M.loadedChecker() : QW[J[L]])) {
					K = false;
					break
				}
			}
			if (K) {
				O();
				D.splice(N, 1);
				N--
			}
		}
	}
	function E() {
		var J = I[0];
		function L() {
			J.loadStatus = 2;
			B();
			isLoading = false;
			E()
		}
		if (!isLoading && J) {
			isLoading = true;
			I.splice(0, 1);
			var K = J.loadedChecker;
			if (K && K()) {
				L()
			} else {
				A(J.url.replace(/^\/\//, QW.PATH), L)
			}
		}
	}
	var F = {
		provideDomains : [ QW ],
		provide : function(K, M) {
			if (typeof K == "string") {
				var J = F.provideDomains;
				for ( var L = 0; L < J.length; L++) {
					if (!J[L][K]) {
						J[L][K] = M
					}
				}
			} else {
				if (G(K)) {
					for (L in K) {
						F.provide(L, K[L])
					}
				}
			}
		},
		addConfig : function(J, M) {
			if (typeof J == "string") {
				var L = H({}, M);
				L.moduleName = J;
				C[J] = L
			} else {
				if (G(J)) {
					for ( var K in J) {
						F.addConfig(K, J[K])
					}
				}
			}
		},
		use : function(R, L) {
			var M = {}, N = [], Q = R.split(/\s*,\s*/g), X, W, U, Z, a;
			while (Q.length) {
				var P = {};
				for (X = 0; X < Q.length; X++) {
					var O = Q[X];
					if (!O || QW[O]) {
						continue
					}
					if (!M[O]) {
						if (!C[O]) {
							throw "Unknown module: " + O
						}
						if (C[O].loadStatus != 2) {
							var J = C[O].loadedChecker;
							if (J && J()) {
								continue
							}
							M[O] = C[O]
						}
						var K = [ "requires", "use" ];
						for (W = 0; W < K.length; W++) {
							var S = C[O][K[W]];
							if (S) {
								var T = S.split(",");
								for (U = 0; U < T.length; U++) {
									P[T[U]] = 0
								}
							}
						}
					}
				}
				Q = [];
				for (X in P) {
					Q.push(X)
				}
			}
			for (X in M) {
				N.push(M[X])
			}
			for (X = 0, Z = N.length; X < Z; X++) {
				if (!N[X].requires) {
					continue
				}
				for (W = X + 1; W < Z; W++) {
					if (new RegExp("(^|,)" + N[W].moduleName + "(,|$)")
							.test(N[X].requires)) {
						var Y = N[W];
						N.splice(W, 1);
						N.splice(X, 0, Y);
						X--;
						break
					}
				}
			}
			var V = -1, b = -1;
			for (X = 0; X < N.length; X++) {
				a = N[X];
				if (!a.loadStatus
						&& (new RegExp("(^|,)" + a.moduleName + "(,|$)")
								.test(R))) {
					V = X
				}
				if (a.loadStatus == 1
						&& (new RegExp("(^|,)" + a.moduleName + "(,|$)")
								.test(R))) {
					b = X
				}
			}
			if (V != -1 || b != -1) {
				D.push({
					callback : L,
					moduleNames : R
				})
			} else {
				L();
				return
			}
			for (X = 0; X < N.length; X++) {
				a = N[X];
				if (!a.loadStatus) {
					a.loadStatus = 1;
					I.push(a)
				}
			}
			E()
		}
	};
	QW.ModuleH = F;
	QW.use = F.use;
	QW.provide = F.provide
}());
QW.Browser = (function() {
	var A = window.navigator, C = A.userAgent.toLowerCase(), D = /(msie|webkit|gecko|presto|opera|safari|firefox|chrome|maxthon|android|ipad|iphone|webos|hpwos)[ \/os]*([\d_.]+)/ig, E = {
		platform : A.platform
	};
	C.replace(D, function(H, F, I) {
		var G = F.toLowerCase();
		if (!E[G]) {
			E[G] = I
		}
	});
	if (E.opera) {
		C.replace(/opera.*version\/([\d.]+)/, function(G, F) {
			E.opera = F
		})
	}
	if (E.msie) {
		E.ie = E.msie;
		var B = parseInt(E.msie, 10);
		E["ie" + B] = true
	}
	return E
}());
if (QW.Browser.ie) {
	try {
		document.execCommand("BackgroundImageCache", false, true)
	} catch (e) {
	}
}
(function() {
	var A = {
		trim : function(B) {
			return B.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "")
		},
		mulReplace : function(D, B) {
			for ( var C = 0; C < B.length; C++) {
				D = D.replace(B[C][0], B[C][1])
			}
			return D
		},
		format : function(D, C) {
			var B = arguments;
			return D.replace(/\{(\d+)\}/ig, function(F, E) {
				var G = B[(E | 0) + 1];
				return G == null ? "" : G
			})
		},
		tmpl : (function() {
			var D = "sArrCMX", B = D + '.push("';
			var C = {
				"js" : {
					tagG : "js",
					isBgn : 1,
					isEnd : 1,
					sBgn : '");',
					sEnd : ";" + B
				},
				"if" : {
					tagG : "if",
					isBgn : 1,
					rlt : 1,
					sBgn : '");if',
					sEnd : "{" + B
				},
				"elseif" : {
					tagG : "if",
					cond : 1,
					rlt : 1,
					sBgn : '");} else if',
					sEnd : "{" + B
				},
				"else" : {
					tagG : "if",
					cond : 1,
					rlt : 2,
					sEnd : '");}else{' + B
				},
				"/if" : {
					tagG : "if",
					isEnd : 1,
					sEnd : '");}' + B
				},
				"for" : {
					tagG : "for",
					isBgn : 1,
					rlt : 1,
					sBgn : '");for',
					sEnd : "{" + B
				},
				"/for" : {
					tagG : "for",
					isEnd : 1,
					sEnd : '");}' + B
				},
				"while" : {
					tagG : "while",
					isBgn : 1,
					rlt : 1,
					sBgn : '");while',
					sEnd : "{" + B
				},
				"/while" : {
					tagG : "while",
					isEnd : 1,
					sEnd : '");}' + B
				}
			};
			return function(J, I) {
				var L = -1, K = [];
				var G = [
						[
								/\{strip\}([\s\S]*?)\{\/strip\}/g,
								function(N, M) {
									return M.replace(/[\r\n]\s*\}/g, " }")
											.replace(/[\r\n]\s*/g, "")
								} ],
						[ /\\/g, "\\\\" ],
						[ /"/g, '\\"' ],
						[ /\r/g, "\\r" ],
						[ /\n/g, "\\n" ],
						[
								/\{[\s\S]*?\S\}/g,
								function(N) {
									N = N.substr(1, N.length - 2);
									for ( var P = 0; P < H.length; P++) {
										N = N.replace(H[P][0], H[P][1])
									}
									var O = N;
									if (/^(.\w+)\W/.test(O)) {
										O = RegExp.$1
									}
									var M = C[O];
									if (M) {
										if (M.isBgn) {
											var Q = K[++L] = {
												tagG : M.tagG,
												rlt : M.rlt
											}
										}
										if (M.isEnd) {
											if (L < 0) {
												throw new Error(
														"Unexpected Tag: " + N)
											}
											Q = K[L--];
											if (Q.tagG != M.tagG) {
												throw new Error(
														"Unmatch Tags: "
																+ Q.tagG + "--"
																+ O)
											}
										} else {
											if (!M.isBgn) {
												if (L < 0) {
													throw new Error(
															"Unexpected Tag:"
																	+ N)
												}
												Q = K[L];
												if (Q.tagG != M.tagG) {
													throw new Error(
															"Unmatch Tags: "
																	+ Q.tagG
																	+ "--" + O)
												}
												if (M.cond && !(M.cond & Q.rlt)) {
													throw new Error(
															"Unexpected Tag: "
																	+ O)
												}
												Q.rlt = M.rlt
											}
										}
										return (M.sBgn || "")
												+ N.substr(O.length)
												+ (M.sEnd || "")
									} else {
										return '",(' + N + '),"'
									}
								} ] ];
				var H = [ [ /\\n/g, "\n" ], [ /\\r/g, "\r" ], [ /\\"/g, '"' ],
						[ /\\\\/g, "\\" ], [ /\$(\w+)/g, 'opts["$1"]' ],
						[ /print\(/g, D + ".push(" ] ];
				for ( var F = 0; F < G.length; F++) {
					J = J.replace(G[F][0], G[F][1])
				}
				if (L >= 0) {
					throw new Error("Lose end Tag: " + K[L].tagG)
				}
				J = "var " + D + "=[];" + B + J + '");return ' + D
						+ '.join("");';
				var E = new Function("opts", J);
				if (arguments.length > 1) {
					return E(I)
				}
				return E
			}
		}()),
		contains : function(C, B) {
			return C.indexOf(B) > -1
		},
		dbc2sbc : function(B) {
			return A.mulReplace(B, [ [ /[\uff01-\uff5e]/g, function(C) {
				return String.fromCharCode(C.charCodeAt(0) - 65248)
			} ], [ /\u3000/g, " " ], [ /\u3002/g, "." ] ])
		},
		byteLen : function(B) {
			return B.replace(/[^\x00-\xff]/g, "--").length
		},
		subByte : function(D, B, C) {
			if (A.byteLen(D) <= B) {
				return D
			}
			C = C || "";
			B -= A.byteLen(C);
			return D.substr(0, B).replace(/([^\x00-\xff])/g, "$1 ")
					.substr(0, B).replace(/[^\x00-\xff]$/, "").replace(
							/([^\x00-\xff]) /g, "$1")
					+ C
		},
		camelize : function(B) {
			return B.replace(/\-(\w)/ig, function(D, C) {
				return C.toUpperCase()
			})
		},
		decamelize : function(B) {
			return B.replace(/[A-Z]/g, function(C) {
				return "-" + C.toLowerCase()
			})
		},
		encode4Js : function(B) {
			return A.mulReplace(B, [ [ /\\/g, "\\u005C" ], [ /"/g, "\\u0022" ],
					[ /'/g, "\\u0027" ], [ /\//g, "\\u002F" ],
					[ /\r/g, "\\u000A" ], [ /\n/g, "\\u000D" ],
					[ /\t/g, "\\u0009" ] ])
		},
		escapeChars : function(B) {
			return A.mulReplace(B, [ [ "\b", "\\b" ], [ "\t", "\\t" ],
					[ "\n", "\\n" ], [ "\f", "\\f" ], [ "\r", "\\r" ],
					[ '"', '\\"' ], [ "\\", "\\\\" ] ])
		},
		encode4Http : function(B) {
			return B
					.replace(
							/[\u0000-\u0020\u0080-\u00ff\s"'#\/\|\\%<>\[\]\{\}\^~;\?\:@=&]/,
							function(C) {
								return encodeURIComponent(C)
							})
		},
		encode4Html : function(C) {
			var B = document.createElement("pre");
			var D = document.createTextNode(C);
			B.appendChild(D);
			return B.innerHTML
		},
		encode4HtmlValue : function(B) {
			return A.encode4Html(B).replace(/"/g, "&quot;").replace(/'/g,
					"&#039;")
		},
		decode4Html : function(B) {
			var C = document.createElement("div");
			C.innerHTML = A.stripTags(B);
			return C.childNodes[0] ? C.childNodes[0].nodeValue || "" : ""
		},
		stripTags : function(B) {
			return B.replace(/<[^>]*>/gi, "")
		},
		evalJs : function(B, C) {
			return new Function("opts", B)(C)
		},
		evalExp : function(B, C) {
			return new Function("opts", "return (" + B + ");")(C)
		},
		queryUrl : function(B, D) {
			B = B.replace(/^[^?=]*\?/ig, "").split("#")[0];
			var C = {};
			B.replace(/(^|&)([^&=]+)=([^&]*)/g, function(F, E, G, H) {
				G = decodeURIComponent(G);
				H = decodeURIComponent(H);
				if (!(G in C)) {
					C[G] = /\[\]$/.test(G) ? [ H ] : H
				} else {
					if (C[G] instanceof Array) {
						C[G].push(H)
					} else {
						C[G] = [ C[G], H ]
					}
				}
			});
			return D ? C[D] : C
		}
	};
	QW.StringH = A
}());
(function() {
	var C = QW.StringH.escapeChars;
	function A(D) {
		return D != null && Object.prototype.toString.call(D).slice(8, -1)
	}
	var B = {
		isString : function(D) {
			return A(D) == "String"
		},
		isFunction : function(D) {
			return A(D) == "Function"
		},
		isArray : function(D) {
			return A(D) == "Array"
		},
		isObject : function(D) {
			return D !== null && typeof D == "object"
		},
		isArrayLike : function(D) {
			return !!D && typeof D == "object" && D.nodeType != 1
					&& typeof D.length == "number"
		},
		isPlainObject : function(D) {
			return A(D) == "Object"
		},
		isWrap : function(E, D) {
			return !!(E && E[D || "core"])
		},
		isElement : function(D) {
			return !!D && D.nodeType == 1
		},
		set : function(J, K, H) {
			if (B.isArray(K)) {
				for ( var F = 0; F < K.length; F++) {
					B.set(J, K[F], H[F])
				}
			} else {
				if (typeof K == "object") {
					for (F in K) {
						B.set(J, F, K[F])
					}
				} else {
					if (typeof K == "function") {
						var E = [].slice.call(arguments, 1);
						E[0] = J;
						K.apply(null, E)
					} else {
						var G = K.split(".");
						F = 0;
						for ( var I = J, D = G.length - 1; F < D; F++) {
							I = I[G[F]]
						}
						I[G[F]] = H
					}
				}
			}
			return J
		},
		get : function(I, J, H) {
			if (B.isArray(J)) {
				var E = [], F;
				for (F = 0; F < J.length; F++) {
					E[F] = B.get(I, J[F], H)
				}
			} else {
				if (typeof J == "function") {
					var D = [].slice.call(arguments, 1);
					D[0] = I;
					return J.apply(null, D)
				} else {
					var G = J.split(".");
					E = I;
					for (F = 0; F < G.length; F++) {
						if (!H && E == null) {
							return
						}
						E = E[G[F]]
					}
				}
			}
			return E
		},
		mix : function(G, H, F) {
			if (B.isArray(H)) {
				for ( var E = 0, D = H.length; E < D; E++) {
					B.mix(G, H[E], F)
				}
				return G
			}
			for (E in H) {
				if (F || !(G[E] || (E in G))) {
					G[E] = H[E]
				}
			}
			return G
		},
		dump : function(I, H) {
			var E = {};
			for ( var G = 0, D = H.length; G < D; G++) {
				if (G in H) {
					var F = H[G];
					if (F in I) {
						E[F] = I[F]
					}
				}
			}
			return E
		},
		map : function(G, F, H) {
			var D = {};
			for ( var E in G) {
				D[E] = F.call(H, G[E], E, G)
			}
			return D
		},
		keys : function(F) {
			var D = [];
			for ( var E in F) {
				if (F.hasOwnProperty(E)) {
					D.push(E)
				}
			}
			return D
		},
		fromArray : function(H, G, E) {
			E = E || [];
			for ( var F = 0, D = G.length; F < D; F++) {
				H[G[F]] = E[F]
			}
			return H
		},
		values : function(F) {
			var D = [];
			for ( var E in F) {
				if (F.hasOwnProperty(E)) {
					D.push(F[E])
				}
			}
			return D
		},
		create : function(F, D) {
			var E = function(G) {
				if (G) {
					B.mix(this, G, true)
				}
			};
			E.prototype = F;
			return new E(D)
		},
		stringify : function(G) {
			if (G == null) {
				return null
			}
			if (G.toJSON) {
				G = G.toJSON()
			}
			var F = typeof G;
			switch (F) {
			case "string":
				return '"' + C(G) + '"';
			case "number":
			case "boolean":
				return G.toString();
			case "object":
				if (G instanceof Date) {
					return "new Date(" + G.getTime() + ")"
				}
				if (G instanceof Array) {
					var D = [];
					for ( var E = 0; E < G.length; E++) {
						D[E] = B.stringify(G[E])
					}
					return "[" + D.join(",") + "]"
				}
				if (B.isPlainObject(G)) {
					D = [];
					for (E in G) {
						D.push('"' + C(E) + '":' + B.stringify(G[E]))
					}
					return "{" + D.join(",") + "}"
				}
			}
			return null
		},
		encodeURIJson : function(E) {
			var F = [];
			for ( var G in E) {
				if (E[G] == null) {
					continue
				}
				if (E[G] instanceof Array) {
					for ( var D = 0; D < E[G].length; D++) {
						F.push(encodeURIComponent(G) + "="
								+ encodeURIComponent(E[G][D]))
					}
				} else {
					F.push(encodeURIComponent(G) + "="
							+ encodeURIComponent(E[G]))
				}
			}
			return F.join("&")
		}
	};
	QW.ObjectH = B
}());
(function() {
	var A = {
		map : function(C, G, F) {
			var B = C.length;
			var E = new Array(B);
			for ( var D = 0; D < B; D++) {
				if (D in C) {
					E[D] = G.call(F, C[D], D, C)
				}
			}
			return E
		},
		forEach : function(C, F, E) {
			for ( var D = 0, B = C.length; D < B; D++) {
				if (D in C) {
					F.call(E, C[D], D, C)
				}
			}
		},
		filter : function(C, G, F) {
			var E = [];
			for ( var D = 0, B = C.length; D < B; D++) {
				if ((D in C) && G.call(F, C[D], D, C)) {
					E.push(C[D])
				}
			}
			return E
		},
		some : function(C, F, E) {
			for ( var D = 0, B = C.length; D < B; D++) {
				if (D in C && F.call(E, C[D], D, C)) {
					return true
				}
			}
			return false
		},
		every : function(C, F, E) {
			for ( var D = 0, B = C.length; D < B; D++) {
				if (D in C && !F.call(E, C[D], D, C)) {
					return false
				}
			}
			return true
		},
		indexOf : function(C, E, D) {
			var B = C.length;
			D |= 0;
			if (D < 0) {
				D += B
			}
			if (D < 0) {
				D = 0
			}
			for (; D < B; D++) {
				if (D in C && C[D] === E) {
					return D
				}
			}
			return -1
		},
		lastIndexOf : function(C, E, D) {
			var B = C.length;
			D |= 0;
			if (!D || D >= B) {
				D = B - 1
			}
			if (D < 0) {
				D += B
			}
			for (; D > -1; D--) {
				if (D in C && C[D] === E) {
					return D
				}
			}
			return -1
		},
		contains : function(B, C) {
			return (A.indexOf(B, C) >= 0)
		},
		clear : function(B) {
			B.length = 0
		},
		remove : function(C, G) {
			var B = -1;
			for ( var E = 1; E < arguments.length; E++) {
				var F = arguments[E];
				for ( var D = 0; D < C.length; D++) {
					if (F === C[D]) {
						if (B < 0) {
							B = D
						}
						C.splice(D--, 1)
					}
				}
			}
			return B
		},
		unique : function(C) {
			var G = [], F = null, E = Array.indexOf || A.indexOf;
			for ( var D = 0, B = C.length; D < B; D++) {
				if (E(G, F = C[D]) < 0) {
					G.push(F)
				}
			}
			return G
		},
		reduce : function(C, G, D) {
			var B = C.length;
			var F = 0;
			if (arguments.length < 3) {
				var E = 0;
				for (; F < B; F++) {
					if (F in C) {
						D = C[F++];
						E = 1;
						break
					}
				}
				if (!E) {
					throw new Error("No component to reduce")
				}
			}
			for (; F < B; F++) {
				if (F in C) {
					D = G(D, C[F], F, C)
				}
			}
			return D
		},
		reduceRight : function(C, G, D) {
			var B = C.length;
			var F = B - 1;
			if (arguments.length < 3) {
				var E = 0;
				for (; F > -1; F--) {
					if (F in C) {
						D = C[F--];
						E = 1;
						break
					}
				}
				if (!E) {
					throw new Error("No component to reduceRight")
				}
			}
			for (; F > -1; F--) {
				if (F in C) {
					D = G(D, C[F], F, C)
				}
			}
			return D
		},
		expand : function(B) {
			return [].concat.apply([], B)
		},
		toArray : function(B) {
			var C = [];
			for ( var D = 0; D < B.length; D++) {
				C[D] = B[D]
			}
			return C
		},
		wrap : function(B, C) {
			return new C(B)
		}
	};
	QW.ArrayH = A
}());
(function() {
	var B = QW.ArrayH.contains;
	var A = {
		union : function(D, E) {
			var G = [];
			for ( var F = 0, C = E.length; F < C; F++) {
				if (!B(D, E[F])) {
					G.push(E[F])
				}
			}
			return D.concat(G)
		},
		intersect : function(D, E) {
			var G = [];
			for ( var F = 0, C = E.length; F < C; F++) {
				if (B(D, E[F])) {
					G.push(E[F])
				}
			}
			return G
		},
		minus : function(D, E) {
			var G = [];
			for ( var F = 0, C = E.length; F < C; F++) {
				if (!B(D, E[F])) {
					G.push(E[F])
				}
			}
			return G
		},
		complement : function(C, D) {
			return A.minus(C, D).concat(A.minus(D, C))
		}
	};
	QW.HashsetH = A
}());
(function() {
	var A = {
		format : function(E, C) {
			C = C || "yyyy-MM-dd";
			var F = E.getFullYear().toString(), D = {
				M : E.getMonth() + 1,
				d : E.getDate(),
				h : E.getHours(),
				m : E.getMinutes(),
				s : E.getSeconds()
			};
			C = C.replace(/(y+)/ig, function(H, G) {
				return F.substr(4 - Math.min(4, G.length))
			});
			for ( var B in D) {
				C = C.replace(new RegExp("(" + B + "+)", "g"), function(H, G) {
					return (D[B] < 10 && G.length > 1) ? "0" + D[B] : D[B]
				})
			}
			return C
		}
	};
	QW.DateH = A
}());
(function() {
	var A = {
		methodize : function(C, B) {
			if (B) {
				return function() {
					return C.apply(null, [ this[B] ].concat([].slice
							.call(arguments)))
				}
			}
			return function() {
				return C.apply(null, [ this ].concat([].slice.call(arguments)))
			}
		},
		mul : function(E, D) {
			var C = D == 1, B = D == 2;
			if (C) {
				return function() {
					var G = arguments[0];
					if (!(G instanceof Array)) {
						return E.apply(this, arguments)
					}
					if (G.length) {
						var F = [].slice.call(arguments, 0);
						F[0] = G[0];
						return E.apply(this, F)
					}
				}
			}
			return function() {
				var K = arguments[0];
				if (K instanceof Array) {
					var J = [].slice.call(arguments, 0), G = [], H = 0, F = K.length, I;
					for (; H < F; H++) {
						J[0] = K[H];
						I = E.apply(this, J);
						if (B) {
							if (I != null) {
								G = G.concat(I)
							}
						} else {
							G.push(I)
						}
					}
					return G
				} else {
					return E.apply(this, arguments)
				}
			}
		},
		rwrap : function(C, D, B) {
			B |= 0;
			return function() {
				var E = C.apply(this, arguments);
				if (B >= 0) {
					E = arguments[B]
				}
				return D ? new D(E) : E
			}
		},
		bind : function(D, E) {
			var F = [].slice, B = F.call(arguments, 2), G = function() {
			}, C = function() {
				return D.apply(this instanceof G ? this : (E || {}), B.concat(F
						.call(arguments)))
			};
			G.prototype = D.prototype;
			C.prototype = new G();
			return C
		},
		lazyApply : function(D, G, F, C, E) {
			E = E || function() {
				return true
			};
			var H = function() {
				var I = E();
				if (I == 1) {
					D.apply(G, F || [])
				}
				if (I == 1 || I == -1) {
					clearInterval(B)
				}
			}, B = setInterval(H, C);
			return B
		},
		toggle : function() {
			var C = 0, B = Array.prototype.slice.call(arguments, 0);
			return function() {
				return B[C++ % B.length].apply(this, arguments)
			}
		}
	};
	QW.FunctionH = A
}());
(function() {
	var B = QW.ObjectH.mix, A = QW.ObjectH.create;
	var C = {
		createInstance : function(D) {
			var E = A(D.prototype);
			D.apply(E, [].slice.call(arguments, 1));
			return E
		},
		extend : function(D, G) {
			var E = function() {
			};
			E.prototype = G.prototype;
			var F = D.prototype;
			D.prototype = new E();
			D.$super = G;
			B(D.prototype, F, true);
			return D
		}
	};
	QW.ClassH = C
}());
(function() {
	var D = QW.FunctionH, C = QW.ObjectH.create, A = function() {
	};
	var B = {
		rwrap : function(I, K, G) {
			var E = C(I);
			G = G || "operator";
			for ( var F in I) {
				var J = G, H = I[F];
				if (H instanceof Function) {
					if (typeof J != "string") {
						J = G[F] || ""
					}
					if ("queryer" == J) {
						E[F] = D.rwrap(H, K, -1)
					} else {
						if ("operator" == J || "methodized" == J) {
							if (I instanceof A || "methodized" == J) {
								E[F] = (function(L) {
									return function() {
										L.apply(this, arguments);
										return this
									}
								}(H))
							} else {
								E[F] = D.rwrap(H, K, 0)
							}
						}
					}
				} else {
					E[F] = H
				}
			}
			return E
		},
		gsetter : function(H, E) {
			var F = C(H);
			E = E || {};
			for ( var G in E) {
				if (H instanceof A) {
					F[G] = (function(I) {
						return function() {
							return F[I[Math.min(arguments.length, I.length - 1)]]
									.apply(this, arguments)
						}
					}(E[G]))
				} else {
					F[G] = (function(I) {
						return function() {
							return F[I[Math.min(arguments.length, I.length) - 1]]
									.apply(null, arguments)
						}
					}(E[G]))
				}
			}
			return F
		},
		mul : function(I, E) {
			var F = C(I);
			E = E || {};
			for ( var G in I) {
				var H = I[G];
				if (H instanceof Function) {
					var J = E;
					if (typeof J != "string") {
						J = E[G] || ""
					}
					if ("getter" == J || "getter_first" == J
							|| "getter_first_all" == J) {
						F[G] = D.mul(H, 1)
					} else {
						if ("getter_all" == J) {
							F[G] = D.mul(H, 0)
						} else {
							F[G] = D.mul(H, 2)
						}
					}
					if ("getter" == J || "getter_first_all" == J) {
						F[G + "All"] = D.mul(H, 0)
					}
				} else {
					F[G] = H
				}
			}
			return F
		},
		methodize : function(I, E) {
			var F = new A();
			for ( var G in I) {
				var H = I[G];
				if (H instanceof Function) {
					F[G] = D.methodize(H, E)
				} else {
					F[G] = H
				}
			}
			return F
		}
	};
	QW.HelperH = B
}());
(function() {
	var D = QW.ObjectH.mix, C = QW.ArrayH.indexOf;
	var A = function(I, H, G) {
		this.target = I;
		this.type = H;
		D(this, G || {}, true)
	};
	D(A.prototype, {
		target : null,
		currentTarget : null,
		type : null,
		returnValue : undefined,
		preventDefault : function() {
			this.returnValue = false
		}
	});
	var F = {
		on : function(I, J, H) {
			var G = (I.__custListeners && I.__custListeners[J])
					|| QW.error("unknown event type", TypeError);
			if (C(G, H) > -1) {
				return false
			}
			G.push(H);
			return true
		},
		un : function(J, K, I) {
			var H = (J.__custListeners && J.__custListeners[K])
					|| QW.error("unknown event type", TypeError);
			if (I) {
				var G = C(H, I);
				if (G < 0) {
					return false
				}
				H.splice(G, 1)
			} else {
				H.length = 0
			}
			return true
		},
		fire : function(M, N, H) {
			if (N instanceof A) {
				var G = D(N, H, true);
				N = N.type
			} else {
				G = new A(M, N, H)
			}
			var I = (M.__custListeners && M.__custListeners[N])
					|| QW.error("unknown event type", TypeError);
			if (N != "*") {
				I = I.concat(M.__custListeners["*"] || [])
			}
			G.returnValue = undefined;
			G.currentTarget = M;
			var L = G.currentTarget;
			if (L && L["on" + G.type]) {
				var K = L["on" + G.type].call(L, G)
			}
			for ( var J = 0; J < I.length; J++) {
				I[J].call(L, G)
			}
			return G.returnValue !== false
					&& (K !== false || G.returnValue !== undefined)
		},
		createEvents : function(J, H) {
			H = H || [];
			if (typeof H == "string") {
				H = H.split(",")
			}
			var I = J.__custListeners;
			if (!I) {
				I = J.__custListeners = {}
			}
			for ( var G = 0; G < H.length; G++) {
				I[H[G]] = I[H[G]] || []
			}
			I["*"] = I["*"] || [];
			return J
		}
	};
	var E = function() {
		this.__custListeners = {}
	};
	var B = QW.HelperH.methodize(F);
	D(E.prototype, B);
	A.createEvents = function(H, G) {
		F.createEvents(H, G);
		return D(H, B)
	};
	QW.CustEvent = A;
	QW.CustEventTargetH = F;
	QW.CustEventTarget = E
}());
(function() {
	var O = QW.StringH.trim, S = QW.StringH.encode4Js;
	var P = {
		queryStamp : 0,
		_operators : {
			"" : "aa",
			"=" : 'aa=="vv"',
			"!=" : 'aa!="vv"',
			"~=" : 'aa&&(" "+aa+" ").indexOf(" vv ")>-1',
			"|=" : 'aa&&(aa+"-").indexOf("vv-")==0',
			"^=" : 'aa&&aa.indexOf("vv")==0',
			"$=" : 'aa&&aa.lastIndexOf("vv")==aa.length-"vv".length',
			"*=" : 'aa&&aa.indexOf("vv")>-1'
		},
		_pseudos : {
			"first-child" : function(T) {
				return !(T = T.previousSibling) || !T.tagName
						&& !T.previousSibling
			},
			"last-child" : function(T) {
				return !(T = T.nextSibling) || !T.tagName && !T.nextSibling
			},
			"only-child" : function(T) {
				var U;
				return !((U = T.previousSibling)
						&& (U.tagName || U.previousSibling) || (U = T.nextSibling)
						&& (U.tagName || U.nextSibling))
			},
			"nth-child" : function(T, U) {
				return J(T, U)
			},
			"nth-last-child" : function(T, U) {
				return J(T, U, true)
			},
			"first-of-type" : function(U) {
				var T = U.tagName;
				var V = U;
				while (V = V.previousSlibling) {
					if (V.tagName == T) {
						return false
					}
				}
				return true
			},
			"last-of-type" : function(U) {
				var T = U.tagName;
				var V = U;
				while (V = V.nextSibling) {
					if (V.tagName == T) {
						return false
					}
				}
				return true
			},
			"only-of-type" : function(T) {
				var V = T.parentNode.childNodes;
				for ( var U = V.length - 1; U > -1; U--) {
					if (V[U].tagName == T.tagName && V[U] != T) {
						return false
					}
				}
				return true
			},
			"nth-of-type" : function(U, W) {
				var T = 1;
				var V = U;
				while (V = V.previousSibling) {
					if (V.tagName == U.tagName) {
						T++
					}
				}
				return J(T, W)
			},
			"nth-last-of-type" : function(U, W) {
				var T = 1;
				var V = U;
				while (V = V.nextSibling) {
					if (V.tagName == U.tagName) {
						T++
					}
				}
				return J(T, W)
			},
			"empty" : function(T) {
				return !T.firstChild
			},
			"parent" : function(T) {
				return !!T.firstChild
			},
			"not" : function(T, U) {
				return !I(U)(T)
			},
			"enabled" : function(T) {
				return !T.disabled
			},
			"disabled" : function(T) {
				return T.disabled
			},
			"checked" : function(T) {
				return T.checked
			},
			"focus" : function(T) {
				return T == T.ownerDocument.activeElement
			},
			"indeterminate" : function(T) {
				return T.indeterminate
			},
			"input" : function(T) {
				return /input|select|textarea|button/i.test(T.nodeName)
			},
			"contains" : function(T, U) {
				return (T.textContent || T.innerText || "").indexOf(U) >= 0
			}
		},
		_attrGetters : (function() {
			var W = {
				"class" : "el.className",
				"for" : "el.htmlFor",
				"href" : 'el.getAttribute("href",2)'
			};
			var U = "name,id,className,value,selected,checked,disabled,type,tagName,readOnly,offsetWidth,offsetHeight,innerHTML"
					.split(",");
			for ( var V = 0, T; T = U[V]; V++) {
				W[T] = "el." + T
			}
			return W
		}()),
		_relations : {
			"" : function(U, T, V) {
				while ((U = U.parentNode) && U != V) {
					if (T(U)) {
						return U
					}
				}
				return null
			},
			">" : function(U, T, V) {
				U = U.parentNode;
				return U != V && T(U) ? U : null
			},
			"+" : function(U, T, V) {
				while (U = U.previousSibling) {
					if (U.tagName) {
						return T(U) && U
					}
				}
				return null
			},
			"~" : function(U, T, V) {
				while (U = U.previousSibling) {
					if (U.tagName && T(U)) {
						return U
					}
				}
				return null
			}
		},
		selector2Filter : function(T) {
			return I(T)
		},
		test : function(T, U) {
			return I(U)(T)
		},
		filter : function(V, c, a) {
			var a = a || document, U = O(c).split(",");
			if (U.length < 2) {
				return G(a || document, V, R(c))
			} else {
				var b = G(a || document, V, R(U[0]));
				if (b.length == V.length) {
					return b
				}
				for ( var W = 0, T; T = V[W++];) {
					T.__QWSltFlted = 0
				}
				for (W = 0, T; T = b[W++];) {
					T.__QWSltFlted = 1
				}
				var d = V, Z;
				for ( var X = 1; X < U.length; X++) {
					Z = [];
					for (W = 0, T; T = d[W++];) {
						if (!T.__QWSltFlted) {
							Z.push(T)
						}
					}
					d = Z;
					b = G(a || document, d, R(U[X]));
					for (W = 0, T; T = b[W++];) {
						T.__QWSltFlted = 1
					}
				}
				var Y = [];
				for (W = 0, T; T = V[W++];) {
					if (T.__QWSltFlted) {
						Y.push(T)
					}
				}
				return Y
			}
		},
		query : function(V, Z) {
			P.queryStamp = H++;
			V = V || document;
			var X = E(V, Z);
			if (X) {
				return X
			}
			var U = O(Z).split(",");
			X = Q(V, U[0]);
			for ( var W = 1, T; T = U[W]; W++) {
				var Y = Q(V, T);
				X = X.concat(Y)
			}
			return X
		},
		one : function(T, V) {
			var U = P.query(T, V);
			return U[0]
		}
	};
	window.__SltPsds = P._pseudos;
	function F() {
		return true
	}
	function K(U, Y) {
		var X = [], V = 0;
		if (Y == F) {
			if (U instanceof Array) {
				return U.slice(0)
			} else {
				for ( var T = U.length; V < T; V++) {
					X[V] = U[V]
				}
			}
		} else {
			for ( var W; W = U[V++];) {
				Y(W) && X.push(W)
			}
		}
		return X
	}
	var L, A;
	function C(X) {
		var W = X.children || X.childNodes, T = W.length, U = [], V = 0;
		for (; V < T; V++) {
			if (W[V].nodeType == 1) {
				U.push(W[V])
			}
		}
		return U
	}
	function M(T) {
		return document.getElementById(T)
	}
	(function() {
		var T = document.createElement("div");
		T.innerHTML = '<div class="aaa"></div>';
		A = (T.querySelectorAll && T.querySelectorAll(".aaa").length == 1);
		L = T.contains ? function(V, U) {
			return V != U && V.contains(U)
		} : function(V, U) {
			return (V.compareDocumentPosition(U) & 16)
		}
	}());
	function J(U, T, Z) {
		if (T == "n") {
			return true
		}
		if (typeof U == "number") {
			var b = U
		} else {
			var a = U.parentNode;
			if (a.__queryStamp != H) {
				var W = {
					nextSibling : a.firstChild
				}, V = 1;
				while (W = W.nextSibling) {
					if (W.nodeType == 1) {
						W.__siblingIdx = V++
					}
				}
				a.__queryStamp = H;
				a.__childrenNum = V - 1
			}
			if (Z) {
				b = a.__childrenNum - U.__siblingIdx + 1
			} else {
				b = U.__siblingIdx
			}
		}
		switch (T) {
		case "even":
		case "2n":
			return b % 2 == 0;
		case "odd":
		case "2n+1":
			return b % 2 == 1;
		default:
			if (!(/n/.test(T))) {
				return b == T
			}
			var Y = T.replace(/(^|\D+)n/g, "$11n").split("n"), X = Y[0] | 0, c = b
					- Y[1] | 0;
			return X * c >= 0 && c % X == 0
		}
	}
	var N = {};
	function I(a, T) {
		if (!T && N[a]) {
			return N[a]
		}
		var Z = [], X = O(a), W = /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g, V = [];
		X = X.replace(/\:([\w\-]+)(\(([^)]+)\))?/g, function(g, f, j, i, h) {
			Z.push([ f, i ]);
			return ""
		}).replace(/^\*/g, function(b) {
			V.push("el.nodeType==1");
			return ""
		}).replace(
				/^([\w\-]+)/g,
				function(b) {
					V.push('(el.tagName||"").toUpperCase()=="'
							+ b.toUpperCase() + '"');
					return ""
				}).replace(
				/([\[(].*)|#([\w\-]+)|\.([\w\-]+)/g,
				function(g, f, i, h) {
					return f || i && '[id="' + i + '"]' || h && '[className~="'
							+ h + '"]'
				})
				.replace(
						W,
						function(h, f, k, j, i) {
							var g = P._attrGetters[f] || 'el.getAttribute("'
									+ f + '")';
							V.push(P._operators[k || ""].replace(/aa/g, g)
									.replace(/vv/g, i || ""));
							return ""
						});
		if (!(/^\s*$/).test(X)) {
			throw "Unsupported Selector:\n" + a + "\n-" + X
		}
		for ( var U = 0, Y; Y = Z[U]; U++) {
			if (!P._pseudos[Y[0]]) {
				throw "Unsupported Selector:\n" + Y[0] + "\n" + X
			}
			if (/^(nth-|not|contains)/.test(Y[0])) {
				V.push('__SltPsds["' + Y[0] + '"](el,"' + S(Y[1]) + '")')
			} else {
				V.push('__SltPsds["' + Y[0] + '"](el)')
			}
		}
		if (V.length) {
			if (T) {
				return new Function("els",
						"var els2=[];for(var i=0,el;el=els[i++];){if("
								+ V.join("&&")
								+ ") els2.push(el);} return els2;")
			} else {
				return (N[a] = new Function("el", "return " + V.join("&&")
						+ ";"))
			}
		} else {
			if (T) {
				return function(b) {
					return K(b, F)
				}
			} else {
				return (N[a] = F)
			}
		}
	}
	var H = 0, B = 0, D = 0;
	function E(V, a) {
		if (A && /^((^|,)\s*[.\w-][.\w\s\->+~]*)+$/.test(a)) {
			var Z = V.id, Y, T = [], X;
			if (!Z && V.parentNode) {
				Y = V.id = "__QW_slt_" + B++;
				try {
					X = V.querySelectorAll("#" + Y + " " + a)
				} finally {
					V.removeAttribute("id")
				}
			} else {
				X = V.querySelectorAll(a)
			}
			for ( var W = 0, U; U = X[W++];) {
				T.push(U)
			}
			return T
		}
		return null
	}
	function Q(Y, U) {
		D++;
		var b = E(Y, U);
		if (b) {
			return b
		}
		var l = R(U), a = [ Y ], k, V, T;
		var c;
		while (c = l[0]) {
			if (!a.length) {
				return []
			}
			var d = c[0];
			b = [];
			if (d == "+") {
				f = I(c[1]);
				for (k = 0; V = a[k++];) {
					while (V = V.nextSibling) {
						if (V.tagName) {
							if (f(V)) {
								b.push(V)
							}
							break
						}
					}
				}
				a = b;
				l.splice(0, 1)
			} else {
				if (d == "~") {
					f = I(c[1]);
					for (k = 0; V = a[k++];) {
						if (k > 1 && V.parentNode == a[k - 2].parentNode) {
							continue
						}
						while (V = V.nextSibling) {
							if (V.tagName) {
								if (f(V)) {
									b.push(V)
								}
							}
						}
					}
					a = b;
					l.splice(0, 1)
				} else {
					break
				}
			}
		}
		var m = l.length;
		if (!m || !a.length) {
			return a
		}
		for ( var g = 0, h; sltor = l[g]; g++) {
			if ((/^[.\w-]*#([\w-]+)/i).test(sltor[1])) {
				h = RegExp.$1;
				sltor[1] = sltor[1].replace("#" + h, "");
				break
			}
		}
		if (g < m) {
			var Z = M(h);
			if (!Z) {
				return []
			}
			for (k = 0, T; T = a[k++];) {
				if (!T.parentNode || L(T, Z)) {
					b = G(T, [ Z ], l.slice(0, g + 1));
					if (!b.length || g == m - 1) {
						return b
					}
					return Q(Z, l.slice(g + 1).join(",").replace(/,/g, " "))
				}
			}
			return []
		}
		var j = function(i) {
			return i.getElementsByTagName(X)
		}, X = "*", W = "";
		U = l[m - 1][1];
		U = U.replace(/^[\w\-]+/, function(i) {
			X = i;
			return ""
		});
		if (A) {
			U = U.replace(/^[\w\*]*\.([\w\-]+)/, function(n, i) {
				W = i;
				return ""
			})
		}
		if (W) {
			j = function(i) {
				return i.querySelectorAll(X + "." + W)
			}
		}
		if (m == 1) {
			if (l[0][0] == ">") {
				j = C;
				var f = I(l[0][1], true)
			} else {
				f = I(U, true)
			}
			b = [];
			for (k = 0; T = a[k++];) {
				b = b.concat(f(j(T)))
			}
			return b
		}
		l[l.length - 1][1] = U;
		b = [];
		for (k = 0; T = a[k++];) {
			b = b.concat(G(T, j(T), l))
		}
		return b
	}
	function R(W) {
		var V = [];
		var U = /(^|\s*[>+~ ]\s*)(([\w\-\:.#*]+|\([^\)]*\)|\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\6|)\s*\])+)(?=($|\s*[>+~ ]\s*))/g;
		var T = O(W).replace(U, function(Y, X, f, Z) {
			V.push([ O(X), f ]);
			return ""
		});
		if (!(/^\s*$/).test(T)) {
			throw "Unsupported Selector:\n" + W + "\n--" + T
		}
		return V
	}
	function G(g, b, V) {
		var d = V[0], f = V.length, k = !d[0], Y = [], h = [], X = [], U = "";
		for ( var c = 0; c < f; c++) {
			d = V[c];
			Y[c] = I(d[1], c == f - 1);
			h[c] = P._relations[d[0]];
			if (d[0] == "" || d[0] == "~") {
				X[c] = true
			}
			U += d[0] || " "
		}
		b = Y[f - 1](b);
		if (U == " ") {
			return b
		}
		if (/[+>~] |[+]~/.test(U)) {
			function T(o) {
				var n = [], m = f - 1, i = n[m] = o;
				for (; m > -1; m--) {
					if (m > 0) {
						i = h[m](i, Y[m - 1], g)
					} else {
						if (k || i.parentNode == g) {
							return true
						} else {
							i = null
						}
					}
					while (!i) {
						if (++m == f) {
							return false
						}
						if (X[m]) {
							i = n[m - 1];
							m++
						}
					}
					n[m - 1] = i
				}
			}
			return K(b, T)
		} else {
			var l = [];
			for ( var c = 0, W, Z; W = Z = b[c++];) {
				for ( var a = f - 1; a > 0; a--) {
					if (!(W = h[a](W, Y[a - 1], g))) {
						break
					}
				}
				if (W && (k || W.parentNode == g)) {
					l.push(Z)
				}
			}
			return l
		}
	}
	QW.Selector = P
}());
(function() {
	var B = QW.Selector;
	var C = QW.Browser;
	var A = {
		query : function(E, D) {
			return B.query(D || document.documentElement, E)
		},
		getDocRect : function(I) {
			I = I || document;
			var G = I.defaultView || I.parentWindow, E = I.compatMode, H = I.documentElement, D = G.innerHeight || 0, K = G.innerWidth || 0, L = G.pageXOffset || 0, J = G.pageYOffset || 0, M = H.scrollWidth, F = H.scrollHeight;
			if (E != "CSS1Compat") {
				H = I.body;
				M = H.scrollWidth;
				F = H.scrollHeight
			}
			if (E && !C.opera) {
				K = H.clientWidth;
				D = H.clientHeight
			}
			M = Math.max(M, K);
			F = Math.max(F, D);
			L = Math.max(L, I.documentElement.scrollLeft, I.body.scrollLeft);
			J = Math.max(J, I.documentElement.scrollTop, I.body.scrollTop);
			return {
				width : K,
				height : D,
				scrollWidth : M,
				scrollHeight : F,
				scrollX : L,
				scrollY : J
			}
		},
		create : (function() {
			var D = document.createElement("div"), F = {
				option : [ 1, '<select multiple="multiple">', "</select>" ],
				optgroup : [ 1, '<select multiple="multiple">', "</select>" ],
				legend : [ 1, "<fieldset>", "</fieldset>" ],
				thead : [ 1, "<table>", "</table>" ],
				tbody : [ 1, "<table>", "</table>" ],
				tfoot : [ 1, "<table>", "</table>" ],
				tr : [ 2, "<table><tbody>", "</tbody></table>" ],
				td : [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
				th : [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
				col : [ 2, "<table><tbody></tbody><colgroup>",
						"</colgroup></table>" ],
				_default : [ 0, "", "" ]
			}, E = /<(\w+)/i;
			return function(J, G, N) {
				var I = (N && N.createElement("div")) || D, M = I, P = (E
						.exec(J) || [ "", "" ])[1], K = F[P] || F._default, L = K[0];
				I.innerHTML = K[1] + J + K[2];
				while (L--) {
					I = I.firstChild
				}
				var H = I.firstChild;
				if (!H || !G) {
					while (M.firstChild) {
						M.removeChild(M.firstChild)
					}
					return H
				} else {
					N = N || document;
					var O = N.createDocumentFragment();
					while (H = I.firstChild) {
						O.appendChild(H)
					}
					return O
				}
			}
		}()),
		pluckWhiteNode : function(G) {
			var D = [], F = 0, E = G.length;
			for (; F < E; F++) {
				if (A.isElement(G[F])) {
					D.push(G[F])
				}
			}
			return D
		},
		isElement : function(D) {
			return !!(D && D.nodeType == 1)
		},
		ready : function(E, F) {
			F = F || document;
			if (/complete/.test(F.readyState)) {
				E()
			} else {
				if (F.addEventListener) {
					if (!C.ie && ("interactive" == F.readyState)) {
						E()
					} else {
						F.addEventListener("DOMContentLoaded", E, false)
					}
				} else {
					var D = function() {
						D = new Function();
						E()
					};
					(function() {
						try {
							F.body.doScroll("left")
						} catch (G) {
							return setTimeout(arguments.callee, 1)
						}
						D()
					}());
					F.attachEvent("onreadystatechange", function() {
						("complete" == F.readyState) && D()
					})
				}
			}
		},
		rectContains : function(E, D) {
			return E.left <= D.left && E.right >= D.right && E.top <= D.top
					&& E.bottom >= D.bottom
		},
		rectIntersect : function(G, F) {
			var H = Math.max(G.top, F.top), I = Math.min(G.right, F.right), D = Math
					.min(G.bottom, F.bottom), E = Math.max(G.left, F.left);
			if (D >= H && I >= E) {
				return {
					top : H,
					right : I,
					bottom : D,
					left : E
				}
			} else {
				return null
			}
		},
		createElement : function(E, G, H) {
			H = H || document;
			var F = H.createElement(E);
			if (G) {
				for ( var D in G) {
					F[D] = G[D]
				}
			}
			return F
		}
	};
	QW.DomU = A
}());
(function() {
	var E = QW.ObjectH, C = QW.StringH, H = QW.DomU, I = QW.Browser, A = QW.Selector;
	var D = function(J, K) {
		if ("string" == typeof J) {
			if (J.indexOf("<") == 0) {
				return H.create(J, false, K)
			}
			return (K || document).getElementById(J)
		} else {
			return (E.isWrap(J)) ? arguments.callee(J[0]) : J
		}
	};
	var B = function(J) {
		return String(J).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
	};
	var F = function(M, N) {
		if (/px$/.test(N) || !N) {
			return parseInt(N, 10) || 0
		}
		var L = M.style.right, K = M.runtimeStyle.right;
		var J;
		M.runtimeStyle.right = M.currentStyle.right;
		M.style.right = N;
		J = M.style.pixelRight || 0;
		M.style.right = L;
		M.runtimeStyle.right = K;
		return J
	};
	var G = {
		outerHTML : (function() {
			var J = document.createElement("div");
			return function(K, M) {
				K = D(K);
				if ("outerHTML" in K) {
					return K.outerHTML
				} else {
					J.innerHTML = "";
					var L = (M && M.createElement("div")) || J;
					L.appendChild(K.cloneNode(true));
					return L.innerHTML
				}
			}
		}()),
		hasClass : function(K, J) {
			K = D(K);
			return new RegExp("(?:^|\\s)" + B(J) + "(?:\\s|$)")
					.test(K.className)
		},
		addClass : function(K, J) {
			K = D(K);
			if (!G.hasClass(K, J)) {
				K.className = K.className ? K.className + " " + J : J
			}
		},
		removeClass : function(K, J) {
			K = D(K);
			if (G.hasClass(K, J)) {
				K.className = K.className.replace(new RegExp("(?:^|\\s)" + B(J)
						+ "(?=\\s|$)", "ig"), "")
			}
		},
		replaceClass : function(L, K, J) {
			L = D(L);
			if (G.hasClass(L, K)) {
				L.className = L.className.replace(new RegExp("(^|\\s)" + B(K)
						+ "(?=\\s|$)", "ig"), "$1" + J)
			} else {
				G.addClass(L, J)
			}
		},
		toggleClass : function(J, L, K) {
			K = K || "";
			if (G.hasClass(J, L)) {
				G.replaceClass(J, L, K)
			} else {
				G.replaceClass(J, K, L)
			}
		},
		show : (function() {
			var J = {};
			function K(M) {
				if (!J[M]) {
					var N = document.createElement(M), L = document.body;
					G.insertSiblingBefore(L.firstChild, N);
					display = G.getCurrentStyle(N, "display");
					G.removeChild(L, N);
					L = N = null;
					if (display === "none" || display === "") {
						display = "block"
					}
					J[M] = display
				}
				return J[M]
			}
			return function(L, M) {
				L = D(L);
				if (!M) {
					var N = L.style.display;
					if (N === "none") {
						N = L.style.display = ""
					}
					if (N === "" && G.getCurrentStyle(L, "display") === "none") {
						N = K(L.nodeName)
					}
				}
				L.style.display = M || N
			}
		}()),
		hide : function(J) {
			J = D(J);
			J.style.display = "none"
		},
		empty : function(J) {
			J = D(J);
			while (J.firstChild) {
				J.removeChild(J.firstChild)
			}
		},
		toggle : function(J, K) {
			if (G.isVisible(J)) {
				G.hide(J)
			} else {
				G.show(J, K)
			}
		},
		isVisible : function(J) {
			J = D(J);
			return !!((J.offsetHeight + J.offsetWidth) && G.getStyle(J,
					"display") != "none")
		},
		getXY : (function() {
			var J = function(M, N) {
				var L = parseInt(G.getCurrentStyle(M, "borderTopWidth"), 10) || 0, K = parseInt(
						G.getCurrentStyle(M, "borderLeftWidth"), 10) || 0;
				if (I.gecko) {
					if (/^t(?:able|d|h)$/i.test(M.tagName)) {
						L = K = 0
					}
				}
				N[0] += K;
				N[1] += L;
				return N
			};
			return document.documentElement.getBoundingClientRect ? function(L) {
				var S = L.ownerDocument, R = H.getDocRect(S), M = R.scrollX, K = R.scrollY, N = L
						.getBoundingClientRect(), T = [ N.left, N.top ], O, Q, P;
				if (I.ie) {
					Q = S.documentElement.clientLeft;
					P = S.documentElement.clientTop;
					O = S.compatMode;
					if (O == "BackCompat") {
						Q = S.body.clientLeft;
						P = S.body.clientTop
					}
					T[0] -= Q;
					T[1] -= P
				}
				if (K || M) {
					T[0] += M;
					T[1] += K
				}
				return T
			}
					: function(M) {
						var P = [ M.offsetLeft, M.offsetTop ], L = M.parentNode, O = M.ownerDocument, K = H
								.getDocRect(O), R = !!(I.gecko || parseFloat(I.webkit) > 519), N = 0, Q = 0;
						while ((L = L.offsetParent)) {
							P[0] += L.offsetLeft;
							P[1] += L.offsetTop;
							if (R) {
								P = J(L, P)
							}
						}
						if (G.getCurrentStyle(M, "position") != "fixed") {
							L = M;
							while (L = L.parentNode) {
								N = L.scrollTop;
								Q = L.scrollLeft;
								if (I.gecko
										&& (G.getCurrentStyle(L, "overflow") !== "visible")) {
									P = J(L, P)
								}
								if (N || Q) {
									P[0] -= Q;
									P[1] -= N
								}
							}
						}
						P[0] += K.scrollX;
						P[1] += K.scrollY;
						return P
					}
		}()),
		setXY : function(K, J, L) {
			K = D(K);
			J = parseInt(J, 10);
			L = parseInt(L, 10);
			if (!isNaN(J)) {
				G.setStyle(K, "left", J + "px")
			}
			if (!isNaN(L)) {
				G.setStyle(K, "top", L + "px")
			}
		},
		setSize : function(M, J, L) {
			M = D(M);
			J = parseFloat(J, 10);
			L = parseFloat(L, 10);
			if (isNaN(J) && isNaN(L)) {
				return
			}
			var N = G.borderWidth(M);
			var K = G.paddingWidth(M);
			if (!isNaN(J)) {
				G.setStyle(M, "width", Math.max(+J - N[1] - N[3] - K[1] - K[3],
						0)
						+ "px")
			}
			if (!isNaN(L)) {
				G.setStyle(M, "height", Math.max(
						+L - N[0] - N[2] - K[1] - K[2], 0)
						+ "px")
			}
		},
		setInnerSize : function(L, J, K) {
			L = D(L);
			J = parseFloat(J, 10);
			K = parseFloat(K, 10);
			if (!isNaN(J)) {
				G.setStyle(L, "width", J + "px")
			}
			if (!isNaN(K)) {
				G.setStyle(L, "height", K + "px")
			}
		},
		setRect : function(M, J, N, K, L) {
			G.setXY(M, J, N);
			G.setSize(M, K, L)
		},
		setInnerRect : function(M, J, N, K, L) {
			G.setXY(M, J, N);
			G.setInnerSize(M, K, L)
		},
		getSize : function(J) {
			J = D(J);
			return {
				width : J.offsetWidth,
				height : J.offsetHeight
			}
		},
		getRect : function(M) {
			M = D(M);
			var N = G.getXY(M);
			var J = N[0];
			var O = N[1];
			var K = M.offsetWidth;
			var L = M.offsetHeight;
			return {
				"width" : K,
				"height" : L,
				"left" : J,
				"top" : O,
				"bottom" : O + L,
				"right" : J + K
			}
		},
		nextSibling : function(L, K) {
			var J = A.selector2Filter(K || "");
			L = D(L);
			do {
				L = L.nextSibling
			} while (L && !J(L));
			return L
		},
		previousSibling : function(L, K) {
			var J = A.selector2Filter(K || "");
			L = D(L);
			do {
				L = L.previousSibling
			} while (L && !J(L));
			return L
		},
		ancestorNode : function(L, K) {
			var J = A.selector2Filter(K || "");
			L = D(L);
			do {
				L = L.parentNode
			} while (L && !J(L));
			return L
		},
		parentNode : function(K, J) {
			return G.ancestorNode(K, J)
		},
		firstChild : function(L, K) {
			var J = A.selector2Filter(K || "");
			L = D(L).firstChild;
			while (L && !J(L)) {
				L = L.nextSibling
			}
			return L
		},
		lastChild : function(L, K) {
			var J = A.selector2Filter(K || "");
			L = D(L).lastChild;
			while (L && !J(L)) {
				L = L.previousSibling
			}
			return L
		},
		contains : function(J, K) {
			J = D(J);
			K = D(K);
			return J.contains ? J != K && J.contains(K) : !!(J
					.compareDocumentPosition(K) & 16)
		},
		insertAdjacentHTML : function(K, M, J) {
			K = D(K);
			if (K.insertAdjacentHTML) {
				K.insertAdjacentHTML(M, J)
			} else {
				var L = K.ownerDocument.createRange(), N;
				L.setStartBefore(K);
				N = L.createContextualFragment(J);
				G.insertAdjacentElement(K, M, N)
			}
		},
		insertAdjacentElement : function(J, K, L) {
			J = D(J);
			L = D(L);
			if (J.insertAdjacentElement) {
				J.insertAdjacentElement(K, L)
			} else {
				switch (String(K).toLowerCase()) {
				case "beforebegin":
					J.parentNode.insertBefore(L, J);
					break;
				case "afterbegin":
					J.insertBefore(L, J.firstChild);
					break;
				case "beforeend":
					J.appendChild(L);
					break;
				case "afterend":
					J.parentNode.insertBefore(L, J.nextSibling || null);
					break
				}
			}
			return L
		},
		insert : function(J, K, L) {
			G.insertAdjacentElement(J, K, L)
		},
		insertTo : function(K, L, J) {
			G.insertAdjacentElement(J, L, K)
		},
		appendChild : function(J, K) {
			return D(J).appendChild(D(K))
		},
		insertSiblingBefore : function(J, K) {
			J = D(J);
			return J.parentNode.insertBefore(D(K), J)
		},
		insertSiblingAfter : function(J, K) {
			J = D(J);
			J.parentNode.insertBefore(D(K), J.nextSibling || null)
		},
		insertBefore : function(K, L, J) {
			return D(K).insertBefore(D(L), (J && D(J)) || null)
		},
		insertAfter : function(K, L, J) {
			return D(K).insertBefore(D(L), (J && D(J).nextSibling) || null)
		},
		insertParent : function(J, K) {
			G.insertSiblingBefore(J, K);
			return G.appendChild(K, J)
		},
		replaceNode : function(J, K) {
			J = D(J);
			return J.parentNode.replaceChild(D(K), J)
		},
		replaceChild : function(K, L, J) {
			return D(K).replaceChild(D(L), D(J))
		},
		removeNode : function(J) {
			J = D(J);
			return J.parentNode.removeChild(J)
		},
		removeChild : function(K, J) {
			return D(K).removeChild(D(J))
		},
		get : function(J, K) {
			J = D(J);
			return E.get.apply(null, arguments)
		},
		set : function(J, L, K) {
			J = D(J);
			E.set.apply(null, arguments)
		},
		getAttr : function(K, L, J) {
			K = D(K);
			if ((L in K) && "href" != L) {
				return K[L]
			} else {
				return K.getAttribute(L,
						J
								|| (K.nodeName == "A"
										&& L.toLowerCase() == "href" && 2)
								|| null)
			}
		},
		setAttr : function(K, L, M, J) {
			K = D(K);
			if (L in K) {
				K[L] = M
			} else {
				K.setAttribute(L, M, J || null)
			}
		},
		removeAttr : function(K, L, J) {
			K = D(K);
			return K.removeAttribute(L, J || 0)
		},
		query : function(K, J) {
			K = D(K);
			return A.query(K, J || "")
		},
		one : function(K, J) {
			K = D(K);
			return A.one(K, J || "")
		},
		getElementsByClass : function(K, J) {
			K = D(K);
			return A.query(K, "." + J)
		},
		getValue : function(J) {
			J = D(J);
			return J.value
		},
		setValue : function(J, K) {
			D(J).value = K
		},
		getHtml : function(J) {
			J = D(J);
			return J.innerHTML
		},
		setHtml : (function() {
			var K = /<(?:object|embed|option|style)/i, J = function(L, M) {
				G.empty(L);
				G.appendChild(L, H.create(M, true))
			};
			return function(M, N) {
				M = D(M);
				if (!K.test(N)) {
					try {
						M.innerHTML = N
					} catch (L) {
						J(M, N)
					}
				} else {
					J(M, N)
				}
			}
		}()),
		encodeURIForm : function(M, L) {
			M = D(M);
			L = L || function(T) {
				return false
			};
			var S = [], P = M.elements, N = P.length, Q = 0, R = function(T, U) {
				S.push(encodeURIComponent(T) + "=" + encodeURIComponent(U))
			};
			for (; Q < N; ++Q) {
				M = P[Q];
				var K = M.name;
				if (M.disabled || !K || L(M)) {
					continue
				}
				switch (M.type) {
				case "text":
				case "hidden":
				case "password":
				case "textarea":
					R(K, M.value);
					break;
				case "radio":
				case "checkbox":
					if (M.checked) {
						R(K, M.value)
					}
					break;
				case "select-one":
					if (M.selectedIndex > -1) {
						R(K, M.value)
					}
					break;
				case "select-multiple":
					var J = M.options;
					for ( var O = 0; O < J.length; ++O) {
						if (J[O].selected) {
							R(K, J[O].value)
						}
					}
					break
				}
			}
			return S.join("&")
		},
		isFormChanged : function(O, N) {
			O = D(O);
			N = N || function(Q) {
				return false
			};
			var M = O.elements, J = M.length, L = 0, K = 0, P;
			for (; L < J; ++L, K = 0) {
				O = M[L];
				if (N(O)) {
					continue
				}
				switch (O.type) {
				case "text":
				case "hidden":
				case "password":
				case "textarea":
					if (O.defaultValue != O.value) {
						return true
					}
					break;
				case "radio":
				case "checkbox":
					if (O.defaultChecked != O.checked) {
						return true
					}
					break;
				case "select-one":
					K = 1;
				case "select-multiple":
					P = O.options;
					for (; K < P.length; ++K) {
						if (P[K].defaultSelected != P[K].selected) {
							return true
						}
					}
					break
				}
			}
			return false
		},
		cloneNode : function(K, J) {
			return D(K).cloneNode(J || false)
		},
		removeStyle : function(K, L) {
			K = D(K);
			var J = C.camelize(L), M = G.cssHooks[J];
			if (M) {
				M.remove(K)
			} else {
				if (K.style.removeProperty) {
					K.style.removeProperty(C.decamelize(L))
				} else {
					K.style.removeAttribute(J)
				}
			}
		},
		getStyle : function(K, L) {
			K = D(K);
			L = C.camelize(L);
			var M = G.cssHooks[L], J;
			if (M) {
				J = M.get(K)
			} else {
				J = K.style[L]
			}
			return (!J || J == "auto") ? null : J
		},
		getCurrentStyle : function(M, N, P) {
			M = D(M);
			var K = C.camelize(N);
			var O = G.cssHooks[K], J;
			if (O) {
				J = O.get(M, true, P)
			} else {
				if (I.ie) {
					J = M.currentStyle[K]
				} else {
					var L = M.ownerDocument.defaultView.getComputedStyle(M, P
							|| null);
					J = L ? L.getPropertyValue(C.decamelize(N)) : null
				}
			}
			return (!J || J == "auto") ? null : J
		},
		setStyle : function(K, L, N) {
			K = D(K);
			if ("object" != typeof L) {
				var J = C.camelize(L), M = G.cssHooks[J];
				if (M) {
					M.set(K, N)
				} else {
					K.style[J] = N
				}
			} else {
				for ( var O in L) {
					G.setStyle(K, O, L[O])
				}
			}
		},
		borderWidth : (function() {
			var K = {
				thin : 2,
				medium : 4,
				thick : 6
			};
			var J = function(M, N) {
				var L = G.getCurrentStyle(M, N);
				L = K[L] || parseFloat(L);
				return L || 0
			};
			return function(L) {
				L = D(L);
				return [ J(L, "borderTopWidth"), J(L, "borderRightWidth"),
						J(L, "borderBottomWidth"), J(L, "borderLeftWidth") ]
			}
		}()),
		paddingWidth : function(J) {
			J = D(J);
			return [ F(J, G.getCurrentStyle(J, "paddingTop")),
					F(J, G.getCurrentStyle(J, "paddingRight")),
					F(J, G.getCurrentStyle(J, "paddingBottom")),
					F(J, G.getCurrentStyle(J, "paddingLeft")) ]
		},
		marginWidth : function(J) {
			J = D(J);
			return [ F(J, G.getCurrentStyle(J, "marginTop")),
					F(J, G.getCurrentStyle(J, "marginRight")),
					F(J, G.getCurrentStyle(J, "marginBottom")),
					F(J, G.getCurrentStyle(J, "marginLeft")) ]
		},
		cssHooks : (function() {
			var J = {
				"float" : {
					get : function(L, N, M) {
						if (N) {
							var K = L.ownerDocument.defaultView
									.getComputedStyle(L, M || null);
							return K ? K.getPropertyValue("cssFloat") : null
						} else {
							return L.style.cssFloat
						}
					},
					set : function(K, L) {
						K.style.cssFloat = L
					},
					remove : function(K) {
						K.style.removeProperty("float")
					}
				}
			};
			if (I.ie) {
				J["float"] = {
					get : function(K, L) {
						return K[L ? "currentStyle" : "style"].styleFloat
					},
					set : function(K, L) {
						K.style.styleFloat = L
					},
					remove : function(K) {
						K.style.removeAttribute("styleFloat")
					}
				};
				J.opacity = {
					get : function(L, M) {
						var K;
						if (L.filters["alpha"]) {
							K = L.filters["alpha"].opacity / 100
						} else {
							if (L.filters["DXImageTransform.Microsoft.Alpha"]) {
								K = L.filters["DXImageTransform.Microsoft.Alpha"].opacity / 100
							}
						}
						if (isNaN(K)) {
							K = 1
						}
						return K
					},
					set : function(K, L) {
						if (K.filters["alpha"]) {
							K.filters["alpha"].opacity = L * 100
						} else {
							K.style.filter += "alpha(opacity=" + (L * 100)
									+ ")"
						}
						K.style.opacity = L
					},
					remove : function(K) {
						K.style.filter = "";
						K.style.removeAttribute("opacity")
					}
				}
			}
			return J
		}())
	};
	G.g = D;
	QW.NodeH = G
}());
(function() {
	var F = QW.ObjectH, K = F.mix, B = F.isString, G = F.isArray, I = Array.prototype.push, J = QW.NodeH, E = J.g, H = J.query, D = J.one, C = QW.DomU.create;
	var A = function(L) {
		if (!L) {
			return null
		}
		var N = arguments[1];
		if (B(L)) {
			if (/^</.test(L)) {
				var Q = C(L, true, N).childNodes, P = [];
				for ( var O = 0, M; M = Q[O]; O++) {
					P[O] = M
				}
				return new A(P)
			} else {
				return new A(H(N, L))
			}
		} else {
			L = E(L, N);
			if (this instanceof A) {
				this.core = L;
				if (G(L)) {
					this.length = 0;
					I.apply(this, L)
				} else {
					this.length = 1;
					this[0] = L
				}
			} else {
				return new A(L)
			}
		}
	};
	A.one = function(L) {
		if (!L) {
			return null
		}
		var M = arguments[1];
		if (B(L)) {
			if (/^</.test(L)) {
				return new A(C(L, false, M))
			} else {
				return new A(D(M, L))
			}
		} else {
			L = E(L, M);
			if (G(L)) {
				return new A(L[0])
			} else {
				return new A(L)
			}
		}
	};
	A.pluginHelper = function(P, O, L) {
		var N = QW.HelperH;
		P = N.mul(P, O);
		var M = N.rwrap(P, A, O);
		if (L) {
			M = N.gsetter(M, L)
		}
		K(A, M);
		var Q = N.methodize(P, "core");
		Q = N.rwrap(Q, A, O);
		if (L) {
			Q = N.gsetter(Q, L)
		}
		K(A.prototype, Q)
	};
	K(A.prototype, {
		first : function() {
			return A(this[0])
		},
		last : function() {
			return A(this[this.length - 1])
		},
		item : function(L) {
			return A(this[L])
		},
		filter : function(M, L) {
			if (typeof M == "string") {
				M = QW.Selector.selector2Filter(M)
			}
			return A(ArrayH.filter(this, M, L))
		}
	});
	QW.NodeW = A
}());
(function() {
	function B(E) {
		var D = A.getTarget(E), C = document;
		if (D) {
			C = D.ownerDocument || D.document
					|| ((D.defaultView || D.window) && D) || document
		}
		return C
	}
	var A = {
		getPageX : function(D) {
			D = D || A.getEvent.apply(A, arguments);
			var C = B(D);
			return ("pageX" in D) ? D.pageX : (D.clientX
					+ (C.documentElement.scrollLeft || C.body.scrollLeft) - 2)
		},
		getPageY : function(D) {
			D = D || A.getEvent.apply(A, arguments);
			var C = B(D);
			return ("pageY" in D) ? D.pageY : (D.clientY
					+ (C.documentElement.scrollTop || C.body.scrollTop) - 2)
		},
		getDetail : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			return C.detail || -(C.wheelDelta || 0)
		},
		getKeyCode : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			return ("keyCode" in C) ? C.keyCode : (C.charCode || C.which || 0)
		},
		stopPropagation : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			if (C.stopPropagation) {
				C.stopPropagation()
			} else {
				C.cancelBubble = true
			}
		},
		preventDefault : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			if (C.preventDefault) {
				C.preventDefault()
			} else {
				C.returnValue = false
			}
		},
		getCtrlKey : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			return C.ctrlKey
		},
		getShiftKey : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			return C.shiftKey
		},
		getAltKey : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			return C.altKey
		},
		getTarget : function(D) {
			D = D || A.getEvent.apply(A, arguments);
			var C = D.srcElement || D.target;
			if (C && C.nodeType == 3) {
				C = C.parentNode
			}
			return C
		},
		getRelatedTarget : function(C) {
			C = C || A.getEvent.apply(A, arguments);
			if ("relatedTarget" in C) {
				return C.relatedTarget
			}
			if (C.type == "mouseover") {
				return C.fromElement
			}
			if (C.type == "mouseout") {
				return C.toElement
			}
		},
		getEvent : function(D, C) {
			if (D) {
				return D
			} else {
				if (C) {
					if (C.document) {
						return C.document.parentWindow.event
					}
					if (C.parentWindow) {
						return C.parentWindow.event
					}
				}
			}
			if (window.event) {
				return window.event
			} else {
				var E = arguments.callee;
				do {
					if (/Event/.test(E.arguments[0])) {
						return E.arguments[0]
					}
				} while (E = E.caller)
			}
		},
		_EventPro : {
			stopPropagation : function() {
				this.cancelBubble = true
			},
			preventDefault : function() {
				this.returnValue = false
			}
		},
		standardize : function(D) {
			D = D || A.getEvent.apply(A, arguments);
			if (!("target" in D)) {
				D.target = A.getTarget(D)
			}
			if (!("relatedTarget" in D)) {
				D.relatedTarget = A.getRelatedTarget(D)
			}
			if (!("pageX" in D)) {
				D.pageX = A.getPageX(D);
				D.pageY = A.getPageY(D)
			}
			if (!("detail" in D)) {
				D.detail = A.getDetail(D)
			}
			if (!("keyCode" in D)) {
				D.keyCode = A.getKeyCode(D)
			}
			for ( var C in A._EventPro) {
				if (D[C] == null) {
					D[C] = A._EventPro[C]
				}
			}
			return D
		}
	};
	QW.EventH = A
}());
(function() {
	var D = QW.NodeH.g, C = QW.ObjectH.mix, A = QW.EventH.standardize;
	var G = function() {
		var I = 1, J = "__QWETH_id";
		return {
			get : function(N, L, M, K) {
				var O = N[J] && this[N[J]];
				if (O && M[J]) {
					return O[L + M[J] + (K || "")]
				}
			},
			add : function(O, N, L, M, K) {
				if (!N[J]) {
					N[J] = I++
				}
				if (!M[J]) {
					M[J] = I++
				}
				var P = this[N[J]] || (this[N[J]] = {});
				P[L + M[J] + (K || "")] = O
			},
			remove : function(N, L, M, K) {
				var O = N[J] && this[N[J]];
				if (O && M[J]) {
					delete O[L + M[J] + (K || "")]
				}
			},
			removeEvents : function(N, K) {
				var O = N[J] && this[N[J]];
				if (O) {
					var M = new RegExp("^[a-zA-Z.]*" + (K || "") + "\\d+$");
					for ( var L in O) {
						if (M.test(L)) {
							H.removeEventListener(N, L.split(/[^a-zA-Z]/)[0],
									O[L]);
							delete O[L]
						}
					}
				}
			},
			removeDelegates : function(P, L, K) {
				var Q = P[J] && this[P[J]];
				if (Q) {
					var O = new RegExp("^([a-zA-Z]+\\.)?" + (L || "")
							+ "\\d+.+");
					for ( var N in Q) {
						if (O.test(N)
								&& (!K || N.substr(N.length - K.length) == K)) {
							var M = N.split(/\d+/)[0].split("."), R = H._DelegateCpatureEvents
									.indexOf(M[1] || M[0]) > -1;
							H.removeEventListener(P, N.split(/[^a-zA-Z]/)[0],
									Q[N], R);
							delete Q[N]
						}
					}
				}
			}
		}
	}();
	function F(J, L, I, K) {
		return G.get(J, L + (K ? "." + K : ""), I) || function(M) {
			if (!K || K && H._EventHooks[K][L](J, M)) {
				return B(J, M, I, L)
			}
		}
	}
	function E(K, I, M, J, L) {
		return G.get(K, M + (L ? "." + L : ""), J, I)
				|| function(R) {
					var Q = [], P = R.srcElement || R.target;
					if (!P) {
						return
					}
					if (P.nodeType == 3) {
						P = P.parentNode
					}
					while (P && P != K) {
						Q.push(P);
						P = P.parentNode
					}
					Q = QW.Selector.filter(Q, I, K);
					for ( var O = 0, N = Q.length; O < N; ++O) {
						if (!L
								|| L
								&& H._DelegateHooks[L][M](Q[O], R
										|| window.event)) {
							return B(Q[O], R, J, M)
						}
						if (Q[O].parentNode && Q[O].parentNode.nodeType == 11) {
							if (R.stopPropagation) {
								R.stopPropagation()
							} else {
								R.cancelBubble = true
							}
							break
						}
					}
				}
	}
	function B(J, K, I, L) {
		return H.fireHandler.apply(null, arguments)
	}
	var H = {
		_EventHooks : {},
		_DelegateHooks : {},
		_DelegateCpatureEvents : "change,focus,blur",
		fireHandler : function(J, K, I, L) {
			K = A(K);
			return I.call(J, K)
		},
		addEventListener : (function() {
			if (document.addEventListener) {
				return function(K, L, J, I) {
					K.addEventListener(L, J, I || false)
				}
			} else {
				return function(J, K, I) {
					J.attachEvent("on" + K, I)
				}
			}
		}()),
		removeEventListener : (function() {
			if (document.removeEventListener) {
				return function(K, L, J, I) {
					K.removeEventListener(L, J, I || false)
				}
			} else {
				return function(J, K, I) {
					J.detachEvent("on" + K, I)
				}
			}
		}()),
		on : function(L, N, K) {
			L = D(L);
			var I = H._EventHooks[N];
			if (I) {
				for ( var J in I) {
					var M = F(L, J, K, N);
					H.addEventListener(L, J, M);
					G.add(M, L, J + "." + N, K)
				}
			} else {
				M = F(L, N, K);
				H.addEventListener(L, N, M);
				G.add(M, L, N, K)
			}
		},
		un : function(L, N, K) {
			L = D(L);
			if (!K) {
				return G.removeEvents(L, N)
			}
			var I = H._EventHooks[N];
			if (I) {
				for ( var J in I) {
					var M = F(L, J, K, N);
					H.removeEventListener(L, J, M);
					G.remove(L, J + "." + N, K)
				}
			} else {
				M = F(L, N, K);
				H.removeEventListener(L, N, M);
				G.remove(L, N, K)
			}
		},
		delegate : function(M, J, O, L) {
			M = D(M);
			var I = H._DelegateHooks[O], P = H._DelegateCpatureEvents
					.indexOf(O) > -1;
			if (I) {
				for ( var K in I) {
					var N = E(M, J, K, L, O);
					H.addEventListener(M, K, N, P);
					G.add(N, M, K + "." + O, L, J)
				}
			} else {
				N = E(M, J, O, L);
				H.addEventListener(M, O, N, P);
				G.add(N, M, O, L, J)
			}
		},
		undelegate : function(M, J, O, L) {
			M = D(M);
			if (!L) {
				return G.removeDelegates(M, O, J)
			}
			var I = H._DelegateHooks[O], P = H._DelegateCpatureEvents
					.indexOf(O) > -1;
			if (I) {
				for ( var K in I) {
					var N = E(M, J, K, L, O);
					H.removeEventListener(M, K, N, P);
					G.remove(M, K + "." + O, L, J)
				}
			} else {
				N = E(M, J, O, L);
				H.removeEventListener(M, O, N, P);
				G.remove(M, O, L, J)
			}
		},
		fire : (function() {
			if (document.dispatchEvent) {
				return function(J, L) {
					var I = null, K = J.ownerDocument || J;
					if (/mouse|click/i.test(L)) {
						I = K.createEvent("MouseEvents");
						I.initMouseEvent(L, true, true, K.defaultView, 1, 0, 0,
								0, 0, false, false, false, false, 0, null)
					} else {
						I = K.createEvent("Events");
						I.initEvent(L, true, true, K.defaultView)
					}
					return J.dispatchEvent(I)
				}
			} else {
				return function(I, J) {
					return I.fireEvent("on" + J)
				}
			}
		}())
	};
	H._defaultExtend = function() {
		var L = function(P) {
			function M(Q) {
				H[Q] = function(S, R) {
					if (R) {
						H.on(S, Q, R)
					} else {
						if (S[Q]) {
							S[Q]()
						} else {
							H.fire(S, Q)
						}
					}
				}
			}
			for ( var O = 0, N = P.length; O < N; ++O) {
				M(P[O])
			}
		};
		L("submit,reset,click,focus,blur,change".split(","));
		H.hover = function(N, O, M) {
			N = D(N);
			H.on(N, "mouseenter", O);
			H.on(N, "mouseleave", M || O)
		};
		var I = navigator.userAgent;
		if (/firefox/i.test(I)) {
			H._EventHooks.mousewheel = H._DelegateHooks.mousewheel = {
				"DOMMouseScroll" : function(M) {
					return true
				}
			}
		}
		C(H._EventHooks, {
			"mouseenter" : {
				"mouseover" : function(N, O) {
					var M = O.relatedTarget || O.fromElement;
					if (!M
							|| !(N.contains ? N.contains(M) : (N == M || N
									.compareDocumentPosition(M) & 16))) {
						return true
					}
				}
			},
			"mouseleave" : {
				"mouseout" : function(N, O) {
					var M = O.relatedTarget || O.toElement;
					if (!M
							|| !(N.contains ? N.contains(M) : (N == M || N
									.compareDocumentPosition(M) & 16))) {
						return true
					}
				}
			}
		});
		C(H._DelegateHooks, H._EventHooks);
		if (!document.addEventListener) {
			function J(N) {
				switch (N.type) {
				case "checkbox":
				case "radio":
					return N.checked;
				case "select-multiple":
					var P = [], O = N.options;
					for ( var M = 0; M < O.length; ++M) {
						if (O[M].selected) {
							P.push(O[M].value)
						}
					}
					return P.join(",");
				default:
					return N.value
				}
			}
			function K(M, O) {
				var N = O.target || O.srcElement;
				if (J(N) != N.__QWETH_pre_val) {
					return true
				}
			}
			C(H._DelegateHooks, {
				"change" : {
					"focusin" : function(M, O) {
						var N = O.target || O.srcElement;
						N.__QWETH_pre_val = J(N)
					},
					"deactivate" : K,
					"focusout" : K,
					"click" : K
				},
				"focus" : {
					"focusin" : function(M, N) {
						return true
					}
				},
				"blur" : {
					"focusout" : function(M, N) {
						return true
					}
				}
			})
		}
	};
	H._defaultExtend();
	QW.EventTargetH = H
}());
(function() {
	var E = QW.ObjectH.mix, C = QW.StringH.evalExp;
	var D = {};
	E(D, {
		rules : {},
		addRule : function(H, F) {
			var G = D.rules[H] || (D.rules[H] = {});
			E(G, F, true)
		},
		addRules : function(G) {
			for ( var F in G) {
				D.addRule(F, G[F])
			}
		},
		removeRule : function(G) {
			var F = D.rules[G];
			if (F) {
				delete D.rules[G];
				return true
			}
			return false
		},
		getRuleData : function(F) {
			return D.rules[F]
		},
		setRuleAttribute : function(I, F, H) {
			var G = {};
			G[F] = H;
			D.addRule(I, G)
		},
		removeRuleAttribute : function(H, F) {
			var G = D.rules[H];
			if (G && (attributeName in G)) {
				delete G[attributeName];
				return true
			}
			return false
		},
		getRuleAttribute : function(H, F) {
			var G = D.rules[H] || {};
			return G[F]
		}
	});
	function B(H, F) {
		var I = H.__jssData;
		if (!I) {
			var G = H.getAttribute("data-jss");
			if (G) {
				I = H.__jssData = C("{" + G + "}")
			}
		} else {
			if (F) {
				I = H.__jssData = {}
			}
		}
		return I
	}
	var A = {
		getOwnJss : function(G, F) {
			var H = B(G);
			if (H && (F in H)) {
				return H[F]
			}
			return undefined
		},
		getJss : function(I, O) {
			var L = B(I);
			if (L && (O in L)) {
				return L[O]
			}
			var M = D.getRuleData, H = I.id;
			if (H && (L = M("#" + H)) && (O in L)) {
				return L[O]
			}
			var G = I.name;
			if (G && (L = M("@" + G)) && (O in L)) {
				return L[O]
			}
			var N = I.className;
			if (N) {
				var F = N.split(" ");
				for ( var K = 0; K < F.length; K++) {
					if ((L = M("." + F[K])) && (O in L)) {
						return L[O]
					}
				}
			}
			var J = I.tagName;
			if (J && (L = M(J)) && (O in L)) {
				return L[O]
			}
			return undefined
		},
		setJss : function(H, F, G) {
			var I = B(H, true);
			I[F] = G
		},
		removeJss : function(G, F) {
			var H = B(G);
			if (H && (F in H)) {
				delete H[F];
				return true
			}
			return false
		}
	};
	QW.Jss = D;
	QW.JssTargetH = A
}());
(function() {
	var D = "queryer", B = "operator", A = "getter_all", E = "getter_first", C = "getter_first_all";
	QW.NodeC = {
		getterType : E,
		arrayMethods : "map,forEach,toArray".split(","),
		wrapMethods : {
			g : D,
			one : D,
			query : D,
			getElementsByClass : D,
			outerHTML : E,
			hasClass : E,
			addClass : B,
			removeClass : B,
			replaceClass : B,
			toggleClass : B,
			show : B,
			hide : B,
			toggle : B,
			isVisible : E,
			getXY : C,
			setXY : B,
			setSize : B,
			setInnerSize : B,
			setRect : B,
			setInnerRect : B,
			getSize : C,
			getRect : C,
			nextSibling : D,
			previousSibling : D,
			ancestorNode : D,
			parentNode : D,
			firstChild : D,
			lastChild : D,
			contains : E,
			insertAdjacentHTML : B,
			insertAdjacentElement : B,
			insert : B,
			insertTo : B,
			appendChild : B,
			insertSiblingBefore : B,
			insertSiblingAfter : B,
			insertBefore : B,
			insertAfter : B,
			replaceNode : B,
			replaceChild : B,
			removeNode : B,
			empty : B,
			removeChild : B,
			get : C,
			set : B,
			getAttr : C,
			setAttr : B,
			removeAttr : B,
			getValue : C,
			setValue : B,
			getHtml : C,
			setHtml : B,
			encodeURIForm : E,
			isFormChanged : E,
			cloneNode : D,
			getStyle : C,
			getCurrentStyle : C,
			setStyle : B,
			removeStyle : B,
			borderWidth : E,
			paddingWidth : E,
			marginWidth : E,
			getOwnJss : C,
			getJss : C,
			setJss : B,
			removeJss : B,
			forEach : B
		},
		gsetterMethods : {
			val : [ "getValue", "setValue" ],
			html : [ "getHtml", "setHtml" ],
			attr : [ "", "getAttr", "setAttr" ],
			css : [ "", "getCurrentStyle", "setStyle" ],
			size : [ "getSize", "setInnerSize" ],
			xy : [ "getXY", "setXY" ]
		}
	}
}());
(function() {
	var A = QW.HelperH.methodize, B = QW.ObjectH.mix;
	B(Object, QW.ObjectH);
	B(QW.ArrayH, QW.HashsetH);
	B(Array, QW.ArrayH);
	B(Array.prototype, A(QW.ArrayH));
	B(QW.FunctionH, QW.ClassH);
	B(Function, QW.FunctionH);
	B(Date, QW.DateH);
	B(Date.prototype, A(QW.DateH));
	B(String, QW.StringH);
	B(String.prototype, A(QW.StringH))
}());
(function() {
	var J = QW.ObjectH.mix, B = QW.HelperH.methodize, C = QW.HelperH.rwrap, K = QW.NodeC, H = QW.NodeH, D = QW.EventTargetH, F = QW.JssTargetH, I = QW.DomU, A = QW.NodeW;
	A.pluginHelper(H, K.wrapMethods, K.gsetterMethods);
	A.pluginHelper(D, "operator");
	A.pluginHelper(F, K.wrapMethods, {
		jss : [ "", "getJss", "setJss" ]
	});
	var G = QW.ObjectH.dump(QW.ArrayH, K.arrayMethods);
	G = B(G);
	G = C(G, A, K.wrapMethods);
	J(A.prototype, G);
	var E = QW.Dom = {};
	J(E, [ I, H, D, F ])
}());
(function() {
	var A = function(B, C) {
		var D = (B.getAttribute && B.getAttribute("data--ban")) | 0;
		if (D) {
			if (!B.__BAN_preTime || (new Date() - B.__BAN_preTime) > D) {
				setTimeout(function() {
					B.__BAN_preTime = new Date() * 1
				});
				return true
			}
			QW.EventH.preventDefault(C);
			return
		}
		return true
	};
	QW.EventTargetH._DelegateHooks.click = QW.EventTargetH._EventHooks.click = {
		"click" : A
	};
	QW.EventTargetH._EventHooks.submit = {
		"submit" : A
	}
}());
QW.g = QW.NodeH.g;
QW.W = QW.NodeW;
QW.ObjectH.mix(window, QW);
QW.ModuleH.provideDomains.push(window);

		/* QWrap 1.0.1(2011-09-27) | qwrap.com | BSD Licensed */
		(
				function() {
					var mix = QW.ObjectH.mix, encodeURIJson = QW.ObjectH.encodeURIJson, encodeURIForm = QW.NodeH.encodeURIForm, CustEvent = QW.CustEvent;

					/**
					 * @class Ajax Ajax类的构造函数
					 * @param {json}
					 *            options 构造参数
					 *            ---------------------------------------------------------------------------------------- |
					 *            options属性 | 说明 | 默认值 |
					 *            ---------------------------------------------------------------------------------------- |
					 *            url: | 请求的路径 | 空字符串 | | method: | 请求的方法 | get | |
					 *            async: | 是否异步请求 | true | | user: | 用户名 | 空字符串 | |
					 *            pwd: | 密码 | 空字符串 | | requestHeaders: | 请求头属性 | {} | |
					 *            data: | 发送的数据 | 空字符串 | | useLock: | 是否使用锁机制 |
					 *            0 | | timeout: | 设置请求超时的时间（ms） | 30000 | |
					 *            onsucceed: | 请求成功监控 (成功指：200-300以及304) | |
					 *            onerror: | 请求失败监控 | | oncancel: | 请求取消监控 | |
					 *            oncomplete: | 请求结束监控 (success与error都算complete) |
					 *            ----------------------------------------------------------------------------------------
					 * @return {Ajax}
					 */

					function Ajax(options) {
						this.options = options;
						this._initialize();
					}

					mix(
							Ajax,
							{
								/*
								 * 请求状态
								 */
								STATE_INIT : 0,
								STATE_REQUEST : 1,
								STATE_SUCCESS : 2,
								STATE_ERROR : 3,
								STATE_TIMEOUT : 4,
								STATE_CANCEL : 5,
								/**
								 * defaultHeaders: 默认的requestHeader信息
								 */
								defaultHeaders : {
									'Content-type' : 'application/x-www-form-urlencoded UTF-8', // 最常用配置
									'com-info-1' : 'QW' // 根具体应用有关的header信息
								},
								/**
								 * EVENTS:
								 * Ajax的CustEvents：'succeed','error','cancel','complete'
								 */
								EVENTS : [ 'succeed', 'error', 'cancel',
										'complete' ],
								/**
								 * XHRVersions: IE下XMLHttpRequest的版本
								 */
								XHRVersions : [ 'MSXML2.XMLHttp.6.0',
										'MSXML2.XMLHttp.3.0',
										'MSXML2.XMLHttp.5.0',
										'MSXML2.XMLHttp.4.0', 'Msxml2.XMLHTTP',
										'MSXML.XMLHttp', 'Microsoft.XMLHTTP' ],
								/*
								 * getXHR(): 得到一个XMLHttpRequest对象 @returns
								 * {XMLHttpRequest} : 返回一个XMLHttpRequest对象。
								 */
								getXHR : function() {
									var versions = Ajax.XHRVersions;
									if (window.ActiveXObject) {
										while (versions.length > 0) {
											try {
												return new ActiveXObject(
														versions[0]);
											} catch (ex) {
												versions.shift();
											}
										}
									} else if (window.XMLHttpRequest) {
										return new XMLHttpRequest();
									}
									return null;
								},
								/**
								 * 静态request方法
								 * 
								 * @method request
								 * @static
								 * @param {String|Form}
								 *            url
								 *            请求的地址。（也可以是Json，当为Json时，则只有此参数有效，会当作Ajax的构造参数）。
								 * @param {String|Json|Form}
								 *            data (Optional)发送的数据
								 * @param {Function}
								 *            callback 请求完成后的回调
								 * @param {String}
								 *            method (Optional) 请求方式，get或post
								 * @returns {Ajax}
								 * @example QW.Ajax.request('http://demo.com',{key:
								 *          'value'},function(responseText){alert(responseText);});
								 */
								request : function(url, data, callback, method) {
									if (url.constructor == Object) {
										var a = new Ajax(url);
									} else {
										if (typeof data == 'function') {
											method = callback;
											callback = data;
											if (url && url.tagName == 'FORM') {
												method = method || url.method;
												data = url;
												url = url.action;
											} else {
												data = '';
											}
										}
										a = new Ajax(
												{
													url : url,
													method : method,
													data : data,
													oncomplete : function() {
														callback
																.call(
																		this,
																		this.requester.responseText);
													}
												});
									}
									a.send();
									return a;
								},
								/**
								 * 静态get方法
								 * 
								 * @method get
								 * @static
								 * @param {String|Form}
								 *            url 请求的地址
								 * @param {String|Json|Form}
								 *            data (Optional)发送的数据
								 * @param {Function}
								 *            callback 请求完成后的回调
								 * @returns {Ajax}
								 * @example QW.Ajax.get('http://demo.com',{key:
								 *          'value'},function(responseText){alert(responseText);});
								 */
								get : function(url, data, callback) {
									var args = [].slice.call(arguments, 0);
									args.push('get');
									return Ajax.request.apply(null, args);
								},
								/**
								 * 静态post方法
								 * 
								 * @method post
								 * @static
								 * @param {String|Form}
								 *            url 请求的地址
								 * @param {String|Json|Form}
								 *            data (Optional)发送的数据
								 * @param {Function}
								 *            callback 请求完成后的回调
								 * @returns {Ajax}
								 * @example QW.Ajax.post('http://demo.com',{key:
								 *          'value'},function(responseText){alert(responseText);});
								 */
								post : function(url, data, callback) {
									var args = [].slice.call(arguments, 0);
									args.push('post');
									return Ajax.request.apply(null, args);
								}
							});

					mix(
							Ajax.prototype,
							{
								// 参数
								url : '',
								method : 'get',
								async : true,
								user : '',
								pwd : '',
								requestHeaders : null, // 是一个json对象
								data : '',
								/*
								 * 是否给请求加锁，如果加锁则必须在之前的请求完成后才能进行下一次请求。 默认不加锁。
								 */
								useLock : 0,
								timeout : 30000, // 超时时间

								// 私有变量｜readOnly变量
								isLocked : 0, // 处于锁定状态
								state : Ajax.STATE_INIT, // 还未开始请求
								/**
								 * send( url, method, data ): 发送请求
								 * 
								 * @param {string}
								 *            url 请求的url
								 * @param {string}
								 *            method 传送方法，get/post
								 * @param {string|jason|FormElement}
								 *            data
								 *            可以是字符串，也可以是Json对象，也可以是FormElement
								 * @returns {void}
								 */
								send : function(url, method, data) {
									var me = this;
									if (me.isLocked)
										throw new Error('Locked.');
									else if (me.isProcessing()) {
										me.cancel();
									}
									var requester = me.requester;
									if (!requester) {
										requester = me.requester = Ajax
												.getXHR();
										if (!requester) {
											throw new Error(
													'Fail to get HTTPRequester.');
										}
									}
									url = url || me.url;
									method = (method || me.method || '')
											.toLowerCase();
									if (method != 'post')
										method = 'get';
									data = data || me.data;

									if (typeof data == 'object') {
										if (data.tagName == 'FORM')
											data = encodeURIForm(data); // data是Form
																		// HTMLElement
										else
											data = encodeURIJson(data); // data是Json数据
									}

									// 如果是get方式请求，则传入的数据必须是'key1=value1&key2=value2'格式的。
									if (data && method != 'post')
										url += (url.indexOf('?') != -1 ? '&'
												: '?')
												+ data;
									if (me.user)
										requester.open(method, url, me.async,
												me.user, me.pwd);
									else
										requester.open(method, url, me.async);
									// 设置请求头
									for ( var i in me.requestHeaders) {
										requester.setRequestHeader(i,
												me.requestHeaders[i]);
									}
									// 重置
									me.isLocked = 0;
									me.state = Ajax.STATE_INIT;
									// send事件
									if (me.async) {
										me._sendTime = new Date();
										if (me.useLock)
											me.isLocked = 1;
										this.requester.onreadystatechange = function() {
											var state = me.requester.readyState;
											if (state == 4) {
												me._execComplete();
											}
										};
										me._checkTimeout();
									}
									if (method == 'post') {
										if (!data)
											data = ' ';
										requester.send(data);
									} else {
										requester.send(null);
									}
									if (!me.async) {
										me._execComplete('timeout');
									}

								},
								/**
								 * isSuccess(): 判断现在的状态是否是“已请求成功”
								 * 
								 * @returns {boolean} : 返回XMLHttpRequest是否成功请求。
								 */
								isSuccess : function() {
									var status = this.requester.status;
									return !status
											|| (status >= 200 && status < 300)
											|| status == 304;
								},
								/**
								 * isProcessing(): 判断现在的状态是否是“正在请求中”
								 * 
								 * @returns {boolean} : 返回XMLHttpRequest是否正在请求。
								 */
								isProcessing : function() {
									var state = this.requester ? this.requester.readyState
											: 0;
									return state > 0 && state < 4;
								},
								/**
								 * get(url,data): 用get方式发送请求
								 * 
								 * @param {string}
								 *            url: 请求的url
								 * @param {string|jason|FormElement}
								 *            data:
								 *            可以是字符串，也可以是Json对象，也可以是FormElement
								 * @returns {void} : 。
								 * @see : send 。
								 */
								get : function(url, data) {
									this.send(url, 'get', data);
								},
								/**
								 * get(url,data): 用post方式发送请求
								 * 
								 * @param {string}
								 *            url: 请求的url
								 * @param {string|jason|FormElement}
								 *            data:
								 *            可以是字符串，也可以是Json对象，也可以是FormElement
								 * @returns {void} : 。
								 * @see : send 。
								 */
								post : function(url, data) {
									this.send(url, 'post', data);
								},
								/**
								 * cancel(): 取消请求
								 * 
								 * @returns {boolean}:
								 *          是否有取消动作发生（因为有时请求已经发出，或请求已经成功）
								 */
								cancel : function() {
									var me = this;
									if (me.requester && me.isProcessing()) {
										me.state = Ajax.STATE_CANCEL;
										me.requester.abort();
										me._execComplete();
										me.fire('cancel');
										return true;
									}
									return false;
								},
								/**
								 * _initialize(): 对一个Ajax进行初始化
								 * 
								 * @returns {void}:
								 */
								_initialize : function() {
									var me = this;
									CustEvent.createEvents(me, Ajax.EVENTS);
									mix(me, me.options, 1);
									me.requestHeaders = mix(me.requestHeaders
											|| {}, Ajax.defaultHeaders);

								},
								/**
								 * _checkTimeout(): 监控是否请求超时
								 * 
								 * @returns {void}:
								 */
								_checkTimeout : function() {
									var me = this;
									if (me.async) {
										clearTimeout(me._timer);
										this._timer = setTimeout(function() {
											// Check to see if the request is
											// still happening
											if (me.requester
													&& !me.isProcessing()) {
												// Cancel the request
												me.state = Ajax.STATE_TIMEOUT;
												me.requester.abort(); // Firefox执行该方法后会触发onreadystatechange事件，并且state=4;所以会触发oncomplete事件。而IE、Safari不会
												me._execComplete('timeout');
											}
										}, me.timeout);
									}
								},
								/**
								 * _execComplete(): 执行请求完成的操作
								 * 
								 * @returns {void}:
								 */
								_execComplete : function() {
									var me = this;
									var requester = me.requester;
									requester.onreadystatechange = new Function; // 防止IE6下的内存泄漏
									me.isLocked = 0; // 解锁
									clearTimeout(this._timer);
									if (me.state == Ajax.STATE_CANCEL
											|| me.state == Ajax.STATE_TIMEOUT) {
										// do nothing. 如果是被取消掉的则不执行回调
									} else if (me.isSuccess()) {
										me.state = Ajax.STATE_SUCCESS;
										me.fire('succeed');
									} else {
										me.state = Ajax.STATE_ERROR;
										me.fire('error');
									}
									me.fire('complete');
								}
							});

					QW.provide('Ajax', Ajax);
				}());