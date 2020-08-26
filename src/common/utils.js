// http类
function toQueryString(param, key, encode) {
  if (param instanceof FormData) {
    return param;
  }

  let paramStr = '';

  // 当值为null时转为空字串
  if (param == null) {
    paramStr += `&${key}=`;
  }

  const t = typeof param;
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += `&${key}=${encode == null || encode ? encodeURIComponent(param) : param}`;
  } else {
    Object.keys(param).forEach((i) => {
      const k = key == null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`);
      paramStr += toQueryString(param[i], k, encode);
    });
  }
  return paramStr;
}

function RndNum(n) {
  let rnd = '';
  for (let i = 0; i < n; i += 1) rnd += Math.floor(Math.random() * 10);
  return rnd;
}

// 生成uuid
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function Guid() {
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

/**
 * 深度遍历树
 * 入参：tree的node必须有children字段，并且只有一个根节点
 * 出参：是按深度遍历排序的node数组，每个node额外加了depth字段，标识该节点深度
 */
function deepTraversal(node) {
  const tree = node;
  const nodes = [];
  let depth = 1;
  if (tree != null) {
    const stack = [];// 同来存放将来要访问的节点
    tree.depth = depth;
    stack.push(tree);
    while (stack.length > 0) {
      const item = stack.pop();// 正在访问的节点
      // eslint-disable-next-line prefer-destructuring
      depth = item.depth;
      nodes.push(item);
      const childrens = item.children;
      if (childrens.length > 0) {
        depth += 1;
      }
      for (let i = childrens.length - 1; i >= 0; i -= 1) { // 将现在访问点的节点的子节点存入stack，供将来访问
        childrens[i].depth = depth;
        stack.push(childrens[i]);
      }
    }
  }
  return nodes;
}

/**
 * 在多棵树上查找目标节点的父节点
 * 入参：为多棵树，以及目标节点的ke和value
 * 出参：为多棵树的查找结果
 */
function getParents(trees, { key, value }) {
  const nodesList = [];
  const parentsList = [];
  let point = 0;
  for (let i = 0; i < trees.length; i += 1) {
    nodesList.push(deepTraversal(trees[i]));
  }
  for (let i = 0; i < nodesList.length; i += 1) {
    const curNodes = nodesList[i];
    let targetIndex = -1;
    const parents = [];
    for (let j = 0; j < curNodes.length; j += 1) {
      if (curNodes[j][key] === value) {
        targetIndex = j;
        point = curNodes[j].depth;
        parents.unshift(curNodes[j]);
        break;
      }
    }
    for (let j = targetIndex - 1; j >= 0; j -= 1) {
      if (curNodes[j].depth < point) {
        parents.unshift(curNodes[j]);
        point -= 1;
      }
    }
    if (parents.length > 0) {
      parentsList.push(parents);
    }
  }

  return parentsList;
}

function getCascader(nodes) {
  for (let i = 0; i < nodes.length; i += 1) {
    const tempNode = nodes[i];
    Object.keys(tempNode).forEach((key) => {
      if (['schoolId', 'teachingBuildingId', 'classroomId'].includes(key)) {
        tempNode.value = tempNode[key];
        delete tempNode[key];
      }
      if (['schoolName', 'teachingBuildingName', 'classroomName'].includes(key)) {
        tempNode.label = tempNode[key];
        delete tempNode[key];
      }
      if (key === 'teachingBuildingTreeList' || key === 'classroomTreeList') {
        tempNode.children = tempNode[key];
        delete tempNode[key];
        getCascader(tempNode.children);
      }
    });
  }
}

function isDispaly(params) {
  const outerArray = [];
  for (let i = 0; i < params.length; i += 1) {
    let hasClassroom = false;
    const obj = {
      value: '',
      label: '',
      children: [],
    };
    if (params[i].children.length === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }
    for (let j = 0; j < params[i].children.length; j += 1) {
      const innerobj = {
        value: '',
        label: '',
        children: [],
      };
      if (params[i].children[j].children.length > 0) {
        hasClassroom = true;
        innerobj.value = params[i].children[j].value;
        innerobj.label = params[i].children[j].label;
        innerobj.children = params[i].children[j].children;
        obj.children.push(innerobj);
      }
    }
    obj.value = params[i].value;
    obj.label = params[i].label;
    if (hasClassroom) outerArray.push(obj);
  }
  return outerArray;
}

function getCascader2(nodes) {
  for (let i = 0; i < nodes.length; i += 1) {
    const tempNode = nodes[i];
    if (tempNode.teachingBuildingTreeList && tempNode.teachingBuildingTreeList.length < 1) {
      nodes.splice(i, nodes.length - i); // 剔除没有校区的学校
      // eslint-disable-next-line no-continue
      continue;
    }
    Object.keys(tempNode).forEach((key) => {
      if (['schoolId', 'teachingBuildingId'].includes(key)) {
        tempNode.value = tempNode[key];
        delete tempNode[key];
      }
      if (['schoolName', 'teachingBuildingName'].includes(key)) {
        tempNode.label = tempNode[key];
        delete tempNode[key];
      }
      if (key === 'classroomTreeList') {
        delete tempNode[key];
      }
      if (key === 'teachingBuildingTreeList') {
        tempNode.children = tempNode[key];
        delete tempNode[key];
        getCascader2(tempNode.children);
      }
    });
  }
}

function getObjByKeyValue(objList, key, value) {
  return objList.find((obj) => {
    let targetIndex = -1;
    Object.keys(obj).forEach((objKey, index) => {
      if (objKey === key && obj[objKey] === value) {
        targetIndex = index;
      }
    });
    return objList[targetIndex];
  });
}

/**
 * 
 * @description 动态生成link和script标签
 * @param {HTMLElement} parentDom 父节点
 * @param {string} type 
 * @param {sting} src 
 * @param {boolean} refresh 是否启用刷新
 */
function insertDom(parentDom, type, src, refresh = false) {
  var promise = new Promise((resove, reject) => {
    var hrefstr = `${src}?t=${refresh ? (new Date()).valueOf() : ''}`;
    if (type === 'link') {
      var linkDom = document.createElement('link');
      linkDom.setAttribute('rel', 'stylesheet');
      linkDom.setAttribute('href', hrefstr);
      linkDom.onload = resove;
      parentDom.appendChild(linkDom);
    }
    if (type === 'script') {
      var scriptDom = document.createElement('script');
      scriptDom.setAttribute('src', hrefstr);
      scriptDom.onload = resove;
      parentDom.appendChild(scriptDom);
    }
  });
  return promise;
}

export default {
  toQueryString,
  RndNum,
  Guid,
  deepTraversal,
  getParents,
  getCascader,
  isDispaly,
  getCascader2,
  getObjByKeyValue,
  insertDom,
};
