(function (Y) {
    var H = {
        event: {
            CHECK: "ztree_check"
        },
        id: {
            CHECK: "_check"
        },
        checkbox: {
            STYLE: "checkbox",
            DEFAULT: "chk",
            DISABLED: "disable",
            FALSE: "false",
            TRUE: "true",
            FULL: "full",
            PART: "part",
            FOCUS: "focus"
        },
        radio: {
            STYLE: "radio",
            TYPE_ALL: "all",
            TYPE_LEVEL: "level"
        }
    }
      , I = {
          check: {
              enable: false,
              autoCheckTrigger: false,
              chkStyle: H.checkbox.STYLE,
              nocheckInherit: false,
              chkDisabledInherit: false,
              radioType: H.radio.TYPE_LEVEL,
              chkboxType: {
                  "Y": "ps",
                  "N": "ps"
              }
          },
          data: {
              key: {
                  checked: "checked"
              }
          },
          callback: {
              beforeCheck: null,
              onCheck: null
          }
      }
      , R = function (c) {
          var b = X.getRoot(c);
          b.radioCheckedList = []
      }
      , W = function (b) { }
      , L = function (b) {
          var d = b.treeObj
            , e = a.event;
          d.bind(e.CHECK, function (g, h, c, f) {
              g.srcEvent = h;
              D.apply(b.callback.onCheck, [g, c, f])
          })
      }
      , B = function (b) {
          var d = b.treeObj
            , e = a.event;
          d.unbind(e.CHECK)
      }
      , E = function (b) {
          var k = b.target
            , f = X.getSetting(b.data.treeId)
            , j = ""
            , i = null
            , h = ""
            , d = ""
            , c = null
            , g = null;
          if (D.eqs(b.type, "mouseover")) {
              if (f.check.enable && D.eqs(k.tagName, "span") && k.getAttribute("treeNode" + a.id.CHECK) !== null) {
                  j = D.getNodeMainDom(k).id;
                  h = "mouseoverCheck"
              }
          } else {
              if (D.eqs(b.type, "mouseout")) {
                  if (f.check.enable && D.eqs(k.tagName, "span") && k.getAttribute("treeNode" + a.id.CHECK) !== null) {
                      j = D.getNodeMainDom(k).id;
                      h = "mouseoutCheck"
                  }
              } else {
                  if (D.eqs(b.type, "click")) {
                      if (f.check.enable && D.eqs(k.tagName, "span") && k.getAttribute("treeNode" + a.id.CHECK) !== null) {
                          j = D.getNodeMainDom(k).id;
                          h = "checkNode"
                      }
                  }
              }
          }
          if (j.length > 0) {
              i = X.getNodeCache(f, j);
              switch (h) {
                  case "checkNode":
                      c = O.onCheckNode;
                      break;
                  case "mouseoverCheck":
                      c = O.onMouseoverCheck;
                      break;
                  case "mouseoutCheck":
                      c = O.onMouseoutCheck;
                      break
              }
          }
          var l = {
              stop: h === "checkNode",
              node: i,
              nodeEventType: h,
              nodeEventCallback: c,
              treeEventType: d,
              treeEventCallback: g
          };
          return l
      }
      , J = function (d, e, g, f, i, j, h) {
          if (!g) {
              return
          }
          var c = d.data.key.checked;
          if (typeof g[c] == "string") {
              g[c] = D.eqs(g[c], "true")
          }
          g[c] = !!g[c];
          g.checkedOld = g[c];
          if (typeof g.nocheck == "string") {
              g.nocheck = D.eqs(g.nocheck, "true")
          }
          g.nocheck = !!g.nocheck || (d.check.nocheckInherit && f && !!f.nocheck);
          if (typeof g.chkDisabled == "string") {
              g.chkDisabled = D.eqs(g.chkDisabled, "true")
          }
          g.chkDisabled = !!g.chkDisabled || (d.check.chkDisabledInherit && f && !!f.chkDisabled);
          if (typeof g.halfCheck == "string") {
              g.halfCheck = D.eqs(g.halfCheck, "true")
          }
          g.halfCheck = !!g.halfCheck;
          g.check_Child_State = -1;
          g.check_Focus = false;
          g.getCheckStatus = function () {
              return X.getCheckStatus(d, g)
          }
          ;
          if (d.check.chkStyle == a.radio.STYLE && d.check.radioType == a.radio.TYPE_ALL && g[c]) {
              var b = X.getRoot(d);
              b.radioCheckedList.push(g)
          }
      }
      , K = function (c, e, b) {
          var d = c.data.key.checked;
          if (c.check.enable) {
              X.makeChkFlag(c, e);
              b.push("<span ID='", e.tId, a.id.CHECK, "' class='", U.makeChkClass(c, e), "' treeNode", a.id.CHECK, (e.nocheck === true ? " style='display:none;'" : ""), "></span>")
          }
      }
      , P = function (b, c) {
          c.checkNode = function (h, i, j, f) {
              var g = this.setting.data.key.checked;
              if (h.chkDisabled === true) {
                  return
              }
              if (i !== true && i !== false) {
                  i = !h[g]
              }
              f = !!f;
              if (h[g] === i && !j) {
                  return
              } else {
                  if (f && D.apply(this.setting.callback.beforeCheck, [this.setting.treeId, h], true) == false) {
                      return
                  }
              }
              if (D.uCanDo(this.setting) && this.setting.check.enable && h.nocheck !== true) {
                  h[g] = i;
                  var e = Z(h, a.id.CHECK, this.setting);
                  if (j || this.setting.check.chkStyle === a.radio.STYLE) {
                      U.checkNodeRelation(this.setting, h)
                  }
                  U.setChkClass(this.setting, e, h);
                  U.repairParentChkClassWithSelf(this.setting, h);
                  if (f) {
                      this.setting.treeObj.trigger(a.event.CHECK, [null, this.setting.treeId, h])
                  }
              }
          }
          ;
          c.checkAllNodes = function (e) {
              U.repairAllChk(this.setting, !!e)
          }
          ;
          c.getCheckedNodes = function (e) {
              var f = this.setting.data.key.children;
              e = (e !== false);
              return X.getTreeCheckedNodes(this.setting, X.getRoot(this.setting)[f], e)
          }
          ;
          c.getChangeCheckedNodes = function () {
              var e = this.setting.data.key.children;
              return X.getTreeChangeCheckedNodes(this.setting, X.getRoot(this.setting)[e])
          }
          ;
          c.setChkDisabled = function (g, h, e, f) {
              h = !!h;
              e = !!e;
              f = !!f;
              U.repairSonChkDisabled(this.setting, g, h, f);
              U.repairParentChkDisabled(this.setting, g.getParentNode(), h, e)
          }
          ;
          var d = c.updateNode;
          c.updateNode = function (g, h) {
              if (d) {
                  d.apply(c, arguments)
              }
              if (!g || !this.setting.check.enable) {
                  return
              }
              var f = Z(g, this.setting);
              if (f.get(0) && D.uCanDo(this.setting)) {
                  var e = Z(g, a.id.CHECK, this.setting);
                  if (h == true || this.setting.check.chkStyle === a.radio.STYLE) {
                      U.checkNodeRelation(this.setting, g)
                  }
                  U.setChkClass(this.setting, e, g);
                  U.repairParentChkClassWithSelf(this.setting, g)
              }
          }
      }
      , M = {
          getRadioCheckedList: function (c) {
              var d = X.getRoot(c).radioCheckedList;
              for (var b = 0, e = d.length; b < e; b++) {
                  if (!X.getNodeCache(c, d[b].tId)) {
                      d.splice(b, 1);
                      b--;
                      e--
                  }
              }
              return d
          },
          getCheckStatus: function (c, e) {
              if (!c.check.enable || e.nocheck || e.chkDisabled) {
                  return null
              }
              var d = c.data.key.checked
                , b = {
                    checked: e[d],
                    half: e.halfCheck ? e.halfCheck : (c.check.chkStyle == a.radio.STYLE ? (e.check_Child_State === 2) : (e[d] ? (e.check_Child_State > -1 && e.check_Child_State < 2) : (e.check_Child_State > 0)))
                };
              return b
          },
          getTreeCheckedNodes: function (c, h, k, e) {
              if (!h) {
                  return []
              }
              var g = c.data.key.children
                , b = c.data.key.checked
                , f = (k && c.check.chkStyle == a.radio.STYLE && c.check.radioType == a.radio.TYPE_ALL);
              e = !e ? [] : e;
              for (var d = 0, j = h.length; d < j; d++) {
                  if (h[d].nocheck !== true && h[d].chkDisabled !== true && h[d][b] == k) {
                      e.push(h[d]);
                      if (f) {
                          break
                      }
                  }
                  X.getTreeCheckedNodes(c, h[d][g], k, e);
                  if (f && e.length > 0) {
                      break
                  }
              }
              return e
          },
          getTreeChangeCheckedNodes: function (c, f, g) {
              if (!f) {
                  return []
              }
              var h = c.data.key.children
                , d = c.data.key.checked;
              g = !g ? [] : g;
              for (var b = 0, e = f.length; b < e; b++) {
                  if (f[b].nocheck !== true && f[b].chkDisabled !== true && f[b][d] != f[b].checkedOld) {
                      g.push(f[b])
                  }
                  X.getTreeChangeCheckedNodes(c, f[b][h], g)
              }
              return g
          },
          makeChkFlag: function (e, g) {
              if (!g) {
                  return
              }
              var j = e.data.key.children
                , c = e.data.key.checked
                , f = -1;
              if (g[j]) {
                  for (var k = 0, h = g[j].length; k < h; k++) {
                      var d = g[j][k];
                      var b = -1;
                      if (e.check.chkStyle == a.radio.STYLE) {
                          if (d.nocheck === true || d.chkDisabled === true) {
                              b = d.check_Child_State
                          } else {
                              if (d.halfCheck === true) {
                                  b = 2
                              } else {
                                  if (d[c]) {
                                      b = 2
                                  } else {
                                      b = d.check_Child_State > 0 ? 2 : 0
                                  }
                              }
                          }
                          if (b == 2) {
                              f = 2;
                              break
                          } else {
                              if (b == 0) {
                                  f = 0
                              }
                          }
                      } else {
                          if (e.check.chkStyle == a.checkbox.STYLE) {
                              if (d.nocheck === true || d.chkDisabled === true) {
                                  b = d.check_Child_State
                              } else {
                                  if (d.halfCheck === true) {
                                      b = 1
                                  } else {
                                      if (d[c]) {
                                          b = (d.check_Child_State === -1 || d.check_Child_State === 2) ? 2 : 1
                                      } else {
                                          b = (d.check_Child_State > 0) ? 1 : 0
                                      }
                                  }
                              }
                              if (b === 1) {
                                  f = 1;
                                  break
                              } else {
                                  if (b === 2 && f > -1 && k > 0 && b !== f) {
                                      f = 1;
                                      break
                                  } else {
                                      if (f === 2 && b > -1 && b < 2) {
                                          f = 1;
                                          break
                                      } else {
                                          if (b > -1) {
                                              f = b
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
              g.check_Child_State = f
          }
      }
      , N = {}
      , O = {
          onCheckNode: function (f, e) {
              if (e.chkDisabled === true) {
                  return false
              }
              var c = X.getSetting(f.data.treeId)
                , d = c.data.key.checked;
              if (D.apply(c.callback.beforeCheck, [c.treeId, e], true) == false) {
                  return true
              }
              e[d] = !e[d];
              U.checkNodeRelation(c, e);
              var b = Z(e, a.id.CHECK, c);
              U.setChkClass(c, b, e);
              U.repairParentChkClassWithSelf(c, e);
              c.treeObj.trigger(a.event.CHECK, [f, c.treeId, e]);
              return true
          },
          onMouseoverCheck: function (e, d) {
              if (d.chkDisabled === true) {
                  return false
              }
              var b = X.getSetting(e.data.treeId)
                , c = Z(d, a.id.CHECK, b);
              d.check_Focus = true;
              U.setChkClass(b, c, d);
              return true
          },
          onMouseoutCheck: function (e, d) {
              if (d.chkDisabled === true) {
                  return false
              }
              var b = X.getSetting(e.data.treeId)
                , c = Z(d, a.id.CHECK, b);
              d.check_Focus = false;
              U.setChkClass(b, c, d);
              return true
          }
      }
      , V = {}
      , T = {
          checkNodeRelation: function (f, h) {
              var d, g, j, m = f.data.key.children, e = f.data.key.checked, b = a.radio;
              if (f.check.chkStyle == b.STYLE) {
                  var k = X.getRadioCheckedList(f);
                  if (h[e]) {
                      if (f.check.radioType == b.TYPE_ALL) {
                          for (g = k.length - 1; g >= 0; g--) {
                              d = k[g];
                              if (d[e] && d != h) {
                                  d[e] = false;
                                  k.splice(g, 1);
                                  U.setChkClass(f, Z(d, a.id.CHECK, f), d);
                                  if (d.parentTId != h.parentTId) {
                                      U.repairParentChkClassWithSelf(f, d)
                                  }
                              }
                          }
                          k.push(h)
                      } else {
                          var c = (h.parentTId) ? h.getParentNode() : X.getRoot(f);
                          for (g = 0,
                          j = c[m].length; g < j; g++) {
                              d = c[m][g];
                              if (d[e] && d != h) {
                                  d[e] = false;
                                  U.setChkClass(f, Z(d, a.id.CHECK, f), d)
                              }
                          }
                      }
                  } else {
                      if (f.check.radioType == b.TYPE_ALL) {
                          for (g = 0,
                          j = k.length; g < j; g++) {
                              if (h == k[g]) {
                                  k.splice(g, 1);
                                  break
                              }
                          }
                      }
                  }
              } else {
                  if (h[e] && (!h[m] || h[m].length == 0 || f.check.chkboxType.Y.indexOf("s") > -1)) {
                      U.setSonNodeCheckBox(f, h, true)
                  }
                  if (!h[e] && (!h[m] || h[m].length == 0 || f.check.chkboxType.N.indexOf("s") > -1)) {
                      U.setSonNodeCheckBox(f, h, false)
                  }
                  if (h[e] && f.check.chkboxType.Y.indexOf("p") > -1) {
                      U.setParentNodeCheckBox(f, h, true)
                  }
                  if (!h[e] && f.check.chkboxType.N.indexOf("p") > -1) {
                      U.setParentNodeCheckBox(f, h, false)
                  }
              }
          },
          makeChkClass: function (e, g) {
              var f = e.data.key.checked
                , i = a.checkbox
                , d = a.radio
                , h = "";
              if (g.chkDisabled === true) {
                  h = i.DISABLED
              } else {
                  if (g.halfCheck) {
                      h = i.PART
                  } else {
                      if (e.check.chkStyle == d.STYLE) {
                          h = (g.check_Child_State < 1) ? i.FULL : i.PART
                      } else {
                          h = g[f] ? ((g.check_Child_State === 2 || g.check_Child_State === -1) ? i.FULL : i.PART) : ((g.check_Child_State < 1) ? i.FULL : i.PART)
                      }
                  }
              }
              var b = e.check.chkStyle + "_" + (g[f] ? i.TRUE : i.FALSE) + "_" + h;
              b = (g.check_Focus && g.chkDisabled !== true) ? b + "_" + i.FOCUS : b;
              return a.className.BUTTON + " " + i.DEFAULT + " " + b
          },
          repairAllChk: function (b, j) {
              if (b.check.enable && b.check.chkStyle === a.checkbox.STYLE) {
                  var c = b.data.key.checked
                    , h = b.data.key.children
                    , d = X.getRoot(b);
                  for (var e = 0, g = d[h].length; e < g; e++) {
                      var f = d[h][e];
                      if (f.nocheck !== true && f.chkDisabled !== true) {
                          f[c] = j
                      }
                      U.setSonNodeCheckBox(b, f, j)
                  }
              }
          },
          repairChkClass: function (b, d) {
              if (!d) {
                  return
              }
              X.makeChkFlag(b, d);
              if (d.nocheck !== true) {
                  var c = Z(d, a.id.CHECK, b);
                  U.setChkClass(b, c, d)
              }
          },
          repairParentChkClass: function (b, d) {
              if (!d || !d.parentTId) {
                  return
              }
              var c = d.getParentNode();
              U.repairChkClass(b, c);
              U.repairParentChkClass(b, c)
          },
          repairParentChkClassWithSelf: function (b, c) {
              if (!c) {
                  return
              }
              var d = b.data.key.children;
              if (c[d] && c[d].length > 0) {
                  U.repairParentChkClass(b, c[d][0])
              } else {
                  U.repairParentChkClass(b, c)
              }
          },
          repairSonChkDisabled: function (b, e, c, j) {
              if (!e) {
                  return
              }
              var g = b.data.key.children;
              if (e.chkDisabled != c) {
                  e.chkDisabled = c
              }
              U.repairChkClass(b, e);
              if (e[g] && j) {
                  for (var d = 0, f = e[g].length; d < f; d++) {
                      var h = e[g][d];
                      U.repairSonChkDisabled(b, h, c, j)
                  }
              }
          },
          repairParentChkDisabled: function (b, c, e, d) {
              if (!c) {
                  return
              }
              if (c.chkDisabled != e && d) {
                  c.chkDisabled = e
              }
              U.repairChkClass(b, c);
              U.repairParentChkDisabled(b, c.getParentNode(), e, d)
          },
          setChkClass: function (c, d, b) {
              if (!d) {
                  return
              }
              if (b.nocheck === true) {
                  d.hide()
              } else {
                  d.show()
              }
              d.attr("class", U.makeChkClass(c, b))
          },
          setParentNodeCheckBox: function (d, g, e, b) {
              var j = d.data.key.children
                , c = d.data.key.checked
                , f = Z(g, a.id.CHECK, d);
              if (!b) {
                  b = g
              }
              X.makeChkFlag(d, g);
              if (g.nocheck !== true && g.chkDisabled !== true) {
                  g[c] = e;
                  U.setChkClass(d, f, g);
                  if (d.check.autoCheckTrigger && g != b) {
                      d.treeObj.trigger(a.event.CHECK, [null, d.treeId, g])
                  }
              }
              if (g.parentTId) {
                  var n = true;
                  if (!e) {
                      var m = g.getParentNode()[j];
                      for (var h = 0, k = m.length; h < k; h++) {
                          if ((m[h].nocheck !== true && m[h].chkDisabled !== true && m[h][c]) || ((m[h].nocheck === true || m[h].chkDisabled === true) && m[h].check_Child_State > 0)) {
                              n = false;
                              break
                          }
                      }
                  }
                  if (n) {
                      U.setParentNodeCheckBox(d, g.getParentNode(), e, b)
                  }
              }
          },
          setSonNodeCheckBox: function (e, h, f, c) {
              if (!h) {
                  return
              }
              var k = e.data.key.children
                , d = e.data.key.checked
                , g = Z(h, a.id.CHECK, e);
              if (!c) {
                  c = h
              }
              var b = false;
              if (h[k]) {
                  for (var j = 0, m = h[k].length; j < m; j++) {
                      var n = h[k][j];
                      U.setSonNodeCheckBox(e, n, f, c);
                      if (n.chkDisabled === true) {
                          b = true
                      }
                  }
              }
              if (h != X.getRoot(e) && h.chkDisabled !== true) {
                  if (b && h.nocheck !== true) {
                      X.makeChkFlag(e, h)
                  }
                  if (h.nocheck !== true && h.chkDisabled !== true) {
                      h[d] = f;
                      if (!b) {
                          h.check_Child_State = (h[k] && h[k].length > 0) ? (f ? 2 : 0) : -1
                      }
                  } else {
                      h.check_Child_State = -1
                  }
                  U.setChkClass(e, g, h);
                  if (e.check.autoCheckTrigger && h != c && h.nocheck !== true && h.chkDisabled !== true) {
                      e.treeObj.trigger(a.event.CHECK, [null, e.treeId, h])
                  }
              }
          }
      }
      , C = {
          tools: V,
          view: T,
          event: N,
          data: M
      };
    Y.extend(true, Y.fn.zTree.consts, H);
    Y.extend(true, Y.fn.zTree._z, C);
    var Q = Y.fn.zTree
      , D = Q._z.tools
      , a = Q.consts
      , U = Q._z.view
      , X = Q._z.data
      , F = Q._z.event
      , Z = D.$;
    X.exSetting(I);
    X.addInitBind(L);
    X.addInitUnBind(B);
    X.addInitCache(W);
    X.addInitNode(J);
    X.addInitProxy(E, true);
    X.addInitRoot(R);
    X.addBeforeA(K);
    X.addZTreeTools(P);
    var A = U.createNodes;
    U.createNodes = function (c, d, e, b, f) {
        if (A) {
            A.apply(U, arguments)
        }
        if (!e) {
            return
        }
        U.repairParentChkClassWithSelf(c, b)
    }
    ;
    var G = U.removeNode;
    U.removeNode = function (c, d) {
        var b = d.getParentNode();
        if (G) {
            G.apply(U, arguments)
        }
        if (!d || !b) {
            return
        }
        U.repairChkClass(c, b);
        U.repairParentChkClass(c, b)
    }
    ;
    var S = U.appendNodes;
    U.appendNodes = function (c, d, i, e, b, f, g) {
        var h = "";
        if (S) {
            h = S.apply(U, arguments)
        }
        if (e) {
            X.makeChkFlag(c, e)
        }
        return h
    }
})(jQuery);
