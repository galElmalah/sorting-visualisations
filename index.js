const canvas = document.getElementById("my-c");
canvas.width = innerWidth;
canvas.height = innerHeight;
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const randomArrayInRange = ([bottom = 1, top = 100]) => {
  let arr = [];
  for (let i = bottom; i < top; i++) arr.push(i);
  return arr.sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
};

const ACTIONS = {
  swap: (i, j) => ({ type: "swap", index: [i, j] }),
  sorted: (i) => ({ type: "sorted", index: i }),
  comparing: (i, j) => ({ type: "comparing", index: [i, j] }),
};

function Line(x, y, width, height, color = "gray") {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;

  this.draw = () => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.resetColor = () => (this.color = "gray");

  this.setValue = (v, color) => {
    this.height = v;
    this.color = color;
  };
  this.getValue = (v) => this.height;
}

const arr = randomArrayInRange([5, 30]);
const lines = [];
arr.forEach((v, i) => {
  lines.push(new Line(10 * i + i, 10, 10, v * 5, this.color));
});

lines.forEach((l) => l.draw());

const bubbleSort = ([...a], onSort) => {
  const l = a.length;
  const actions = [];
  for (let i = 0; i < l; i++) {
    for (let j = i; j < l; j++) {
      if (a[i] > a[j]) {
        actions.push(ACTIONS.swap(i, j));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
    }
    actions.push(ACTIONS.sorted(i));
  }

  return actions;
};

function selectionSort([...arr]) {
  const actions = [];

  for (var i = 0; i < arr.length; i++) {
    let min = i; //  storing the index of minimum element

    for (var j = i + 1; j < arr.length; j++) {
      actions.push(ACTIONS.comparing(min, j));
      if (arr[min] > arr[j]) {
        min = j; // updating the index of minimum element
      }
    }

    if (i !== min) {
      let temp = arr[i];
      actions.push(ACTIONS.swap(i, min));

      arr[i] = arr[min];
      arr[min] = temp;
    }
    actions.push(ACTIONS.sorted(i));
  }
  return actions;
}

const actionsMap = {
  swap: (action) => {
    const [i, j] = action.index;
    let tmp = lines[i].getValue();
    lines[i].setValue(lines[j].getValue(), "red");
    lines[j].setValue(tmp, "yellow");
  },
  sorted: (action) => {
    const i = action.index;
    lines[i].color = "green";
  },
  comparing: (action) => {
    const [i, j] = action.index;
    lines[i].color = "blue";
    lines[j].color = "blue";
  },
};

const resetSpecifiedColor = (color) =>
  lines.forEach(
    (l) => (l.color === color || l.color === "blue") && l.resetColor()
  );

const sortingStates = {
  bubble: bubbleSort(arr),
  selection: selectionSort(arr),
};

function animate() {
  sortingStates.bubble.forEach((action, i) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      actionsMap[action.type](action);
      lines.forEach((l) => l.draw());
      resetSpecifiedColor("yellow");
    }, 50 * i);
  });
}

animate();
