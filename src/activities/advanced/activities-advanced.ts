/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { blocks } from "../../blocks/text";
import { forBlock } from "../../generators/javascript";
import { javascriptGenerator, Order } from "blockly/javascript";
import { save, load } from "../../serialization";
import { toolbox } from "./toolbox";
import "./activities-advanced.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { showToast } from "../../toast/toast";
import { colour } from "blockly/core/utils";
// Get the current URL
const url = new URL(window.location.href);

// Create a URLSearchParams object
const params = new URLSearchParams(url.search);

// Get the value of the 'activity' parameter, default to 0 if it doesn't exist
let activity = parseInt(params.get("a") || "0", 10);

function updateQueryParam(newActivity: number) {
  activity = newActivity;

  params.set("a", activity.toString());
  window.history.replaceState({}, "", `${url.pathname}?${params.toString()}`);
  if (instructionDiv) {
    instructionDiv.innerHTML = activityArray[activity]["Instruction"];
  }
  if (activityHeading) {
    activityHeading.textContent = `Activity ${activity + 1}`;
  }

  
  if (taskHeading) {
    taskHeading.textContent = activityArray[activity]["Title"];
  }

  if(imageElement){
    imageElement.src = "assets/images/Advanced-" + (activity + 1) + ".jpeg";
  }

  ws.clear();
  delete Blockly.Blocks["input_dropdown"];
  if (activity != 1) {
    const index = toolbox.contents.findIndex(
      (obj) => obj.name != null && obj.name == "Inputs"
    );
    if (index === -1) {
      toolbox.contents.unshift({
        kind: "category",
        name: "Inputs",
        colour: "#ffff00",
        contents: [
          {
            kind: "block",
            type: "input_dropdown",
          },
        ],
      });
    }
    Blockly.defineBlocksWithJsonArray([input_blocks[activity]]);
    javascriptGenerator.forBlock["input_dropdown"] = function (
      block,
      generator
    ) {
      const field = block.getFieldValue("FIELDNAME");
      return [`Number(prompt("${field}"))`, Order.ATOMIC];
    };
  } else {
    const index = toolbox.contents.findIndex(
      (obj) => obj.name != null && obj.name == "Inputs"
    );
    if (index !== -1) {
      toolbox.contents.splice(index, 1);
    }
  }
  ws.updateToolbox(toolbox);
}

var start = {
  type: "start_block",
  message0: "Begin",
  style: "logic_blocks",
  nextStatement: null,
};

var end = {
  type: "end_block",
  message0: "End",
  style: "logic_blocks",
  previousStatement: null,
};

let input_blocks = [
  {
    type: "input_dropdown",
    message0: "Input %1",
    output: null,
    colour: 65,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [["Rows", "rows"]],
      },
    ],
  },
  {},
  {
    type: "input_dropdown",
    message0: "Input %1",
    output: null,
    colour: 65,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [["Square Side Length", "sSquare Side Length"]],
      },
    ],
  },
];

var output_block = {
  type: "output_block",
  message0: "Output %1",
  colour: 24,
  previousStatement: null,
  args0: [
    {
      type: "field_variable",
      name: "VAR",
      variable: "output",
      variableTypes: [""],
    },
  ],
};

var new_line_block = {
  type: "new_line_block",
  message0: "New Line",
  output: "",
};

if (activity != 1) {
  const index = toolbox.contents.findIndex(
    (obj) => obj.name != null && obj.name == "Inputs"
  );
  if (index === -1) {
    toolbox.contents.unshift({
      kind: "category",
      name: "Inputs",
      colour: "#ffff00",
      contents: [
        {
          kind: "block",
          type: "input_dropdown",
        },
      ],
    });
  }

  Blockly.defineBlocksWithJsonArray([
    start,
    end,
    input_blocks[activity],
    output_block,
    new_line_block,
  ]);
} else {
  Blockly.defineBlocksWithJsonArray([start, end, output_block, new_line_block]);
  const index = toolbox.contents.findIndex(
    (obj) => obj.name != null && obj.name == "Inputs"
  );
  if (index !== -1) {
    toolbox.contents.splice(index, 1);
  }
}

javascriptGenerator.forBlock["start_block"] = function (block, generator) {
  return "";
};

javascriptGenerator.forBlock["end_block"] = function (block, generator) {
  return "";
};

javascriptGenerator.forBlock["new_line_block"] = function (block, generator) {
  return [`"\\n"`, Order.ATOMIC];
};

javascriptGenerator.forBlock["input_dropdown"] = function (block, generator) {
  const field = block.getFieldValue("FIELDNAME");
  return [`Number(prompt("${field}"))`, Order.ATOMIC];
};

javascriptGenerator.forBlock["output_block"] = function (block, generator) {
  if (generator.nameDB_ === undefined) {
    return "return '';";
  }
  var myvar = generator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Names.NameType.VARIABLE
  );
  console.log(myvar);

  return `return ${myvar};`;
};

const activityArray = [
  {
    Title: "It’s All a Pyramid Scheme",
    Instruction: `Teacher Jill wants a visual representation of a "number pyramid" for her math class. Each row of the pyramid contains numbers starting from 1 up to the row number. For example, a pyramid of 5 rows would look like this:<br><br>

1<br>
12<br>
123<br>
1234<br>
12345<br>
<br>
Create a Blockly program that:<br><br>
- Prompts for the number of rows in the pyramid.<br>
- Uses a nested loop to build and display each row in the correct format (you can use the text New Line block to break the line).<br>
`,
    Hint: [
      "Use an outer loop for each row, and an inner loop to add numbers from 1 up to the current row number.",
      " Use a text variable to store the row contents.",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [{ rows: 10 }, { rows: 6 }, { rows: 1 }];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          return element["rows"];
        };
        const func = new Function("prompt", code);
        const return_value_1: string = func(mockPrompt);
        if (!return_value_1) {
          return false;
        }

        let expected_value = "";
        for (let i = 1; i <= element["rows"]; i++) {
          for (let j = 1; j <= i; j++) {
            expected_value += j;
          }

          expected_value += "\n";
        }

        if (return_value_1 !== expected_value) {
          return false;
        }
      }
      return true;
    },
  },
  {
    Title: "It’s About Times",
    Instruction: `Teacher Jill wants a new poster in her classroom that will show all the times tables from 1 to 12. She is however too lazy to type them out herself. She has come to you to help her out. She has already typed out the following structure:<br>
<br>
        X123456789101112<br>
        1<br>
        2<br>
        3<br>
        4<br>
        5<br>
        6<br>
        7<br>
        8<br>
        9<br>
        10<br>
        11<br>
        12<br><br>
        Create a blockly program that will print out the times tables from 1 to 12 to fit into this grid (you can use the text New Line block to break the line).<br>

`,
    Hint: [
      "Use a text variable block to store the times tables and then print out that variable at the end",
      "use a loop within a loop to add the correct times tables",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";

      const func = new Function(code);
      const return_value_1: string = func();
      if (!return_value_1) {
        return false;
      }

      let expected_value = "X123456789101112\n";
      for (let i = 1; i <= 12; i++) {
        expected_value += i;
        for (let j = 1; j <= 12; j++) {
          expected_value += i * j;
        }
        expected_value += "\n";
      }
      if (return_value_1 !== expected_value) {
        return false;
      }

      return true;
    },
  },
  {
    Title: "X’s and O’s",
    Instruction: `Teacher Jill wants a pattern of "X" and "O" for a new classroom decoration.The pattern should alternate between "X" and "O" for each cell, creating a checkered square grid.Jill can choose the grid size(e.g., 5x5, 8x8, etc.).<br> <br>
      For example, a 5x5 grid would look like this: <br><br>
        XOXOX<br>
OXOXO<br>
XOXOX<br>
OXOXO<br>
XOXOX<br>
<br>
Create a Blockly program that: <br>
  - Prompts for the grid size(e.g., 5x5, 8x8).<br>
    - Uses a nested loop to build and display each row in the correct format(you can use the text New Line block to break the line).<br>

      `,
    Hint: [
      "Check if the sum of the row and column index is even or odd to alternate between X and O.",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [
        { "Square Side Length": 5 },
        { "Square Side Length": 8 },
        { "Square Side Length": 1 },
      ];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          return element["Square Side Length"];
        };

        const func = new Function("prompt", code);
        const return_value_1: string = func(mockPrompt);

        if (!return_value_1) {
          return false;
        }

        let expected_value = "";
        for (let i = 0; i < element["Square Side Length"]; i++) {
          for (let j = 0; j < element["Square Side Length"]; j++) {
            if ((i + j) % 2 === 0) {
              expected_value += "X";
            } else {
              expected_value += "O";
            }
          }
          expected_value += "\n";
        }

        if (return_value_1 !== expected_value) {
          return false;
        }
      }
      return true;
    },
  },
];

const instructionDiv = document.getElementById("instruction");

if (instructionDiv) {
  instructionDiv.innerHTML = activityArray[activity]["Instruction"];
}

const activityHeading = document.getElementById("activity-heading");

if (activityHeading) {
  activityHeading.textContent = `Activity ${activity + 1} `;
}

const imageElement = document.getElementById("taskImage") as HTMLImageElement;
imageElement.src = "assets/images/Advanced-" + (activity + 1) + ".jpeg";

const taskHeading = document.getElementById("task-header");

if (taskHeading) {
  taskHeading.textContent = activityArray[activity]["Title"];
}

const goBackButton = document.getElementById("backButton");

if (goBackButton) {
  goBackButton.addEventListener("click", () => {
    navigateTo("difficulty-selection.html");
  });
}

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const outputDiv = document.getElementById("output");
const blocklyDiv = document.getElementById("blocklyDiv");
const submitButton = document.getElementById("submitButton");
const testButton = document.getElementById("testButton");
const hintButton = document.getElementById("hintButton");

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}
let ws = Blockly.inject(blocklyDiv, { toolbox });

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const testCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
  if (codeDiv) codeDiv.textContent = code;

  if (outputDiv) outputDiv.innerHTML = "";

  const func = new Function(code);
  const return_value = func();
  alert(return_value);
};

const submitCode = () => {
  const res = activityArray[activity].checkCode();
  if (res === true) {
    showToast("Correct Answer", "Well done! You got the correct answer.");
    localStorage.setItem(`t${activity + 6} `, "2");

    if (localStorage.getItem(`t${activity + 7} `) !== "2") {
      localStorage.setItem(`t${activity + 7} `, "1");
    }

    if (activity < activityArray.length - 1) {
      updateQueryParam(++activity);
    } else {
      navigateTo("difficulty-selection.html");
    }
  } else {
    showToast(
      "Incorrect Answer",
      "Oh No! You got the incorrect answer. Give it another try."
    );
  }
  return res;
};

var hintIndex = 0;

const giveHint = () => {
  const numHints = activityArray[activity]["Hint"].length;
  showToast("Hint", activityArray[activity]["Hint"][(hintIndex++) % numHints]);
};

if (ws) {
  // Load the initial state from storage and run the code.
  load(ws);
  // runCode();

  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
  });

  // Whenever the workspace changes meaningfully, run the code again.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      ws.isDragging()
    ) {
      return;
    }
  });

  if (testButton) {
    testButton.addEventListener("click", testCode);
  }
  if (submitButton) {
    submitButton.addEventListener("click", submitCode);
  }
  if (hintButton) {
    hintButton.addEventListener("click", giveHint);
  }
}

export function navigateTo(route: string) {
  window.location.href = route;
}

(window as any).navigateTo = navigateTo;
