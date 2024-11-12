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
import "./activities-beginner.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../toast/toast.css";
import { showToast } from "../../toast/toast";

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
    imageElement.src = "assets/images/Beginner-" + (activity + 1) + ".jpeg";
  }

  ws.clear();
  delete Blockly.Blocks["input_dropdown"];
  Blockly.defineBlocksWithJsonArray([input_blocks[activity]]);
  javascriptGenerator.forBlock["input_dropdown"] = function (block, generator) {
    const field = block.getFieldValue("FIELDNAME");
    let prompt = `prompt("${field}")`;
    if (field === "temperature") {
      prompt = `Number(${prompt})`;
    }
    return [prompt, Order.ATOMIC];
  };
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
        options: [["Temperature", "temperature"]],
      },
    ],
  },
  {
    type: "input_dropdown",
    message0: "Input %1",
    output: null,
    colour: 65,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [["Temperature", "temperature"]],
      },
    ],
  },
  {
    type: "input_dropdown",
    message0: "Input %1",
    output: null,
    colour: 65,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [
          ["Temperature", "temperature"],
          ["Condition", "condition"],
        ],
      },
    ],
  },
];

var output_block = {
  type: "output_block",
  message0: "Output %1",
  previousStatement: null,
  colour: 24,
  args0: [
    {
      type: "field_variable",
      name: "VAR",
      variable: "output",
      variableTypes: [""],
    },
  ],
};

Blockly.defineBlocksWithJsonArray([
  start,
  end,
  input_blocks[activity],
  output_block,
]);

javascriptGenerator.forBlock["start_block"] = function (block, generator) {
  return "";
};

javascriptGenerator.forBlock["end_block"] = function (block, generator) {
  return "";
};

javascriptGenerator.forBlock["input_dropdown"] = function (block, generator) {
  const field = block.getFieldValue("FIELDNAME");
  let prompt = `prompt("${field}")`;
  if (field === "temperature") {
    prompt = `Number(${prompt})`;
  }
  return [prompt, Order.ATOMIC];
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
    Title: "You’re Hot or You’re Cold",
    Instruction: `A meteorologist wants to create a small program that reads the temperature from his thermostat. He wants this program to store and output text saying “Hot” if the temperature is above or equal to 30 C else it should store and output “Cold”.<br><br>
Help him create this program within Blockly, that takes in temperature as input, outputs the message whether it’s hot or cold.<br>
<br><b>NOTE</b>: For Inputs, you <b>MUST</b> use the Input block, and the Output <b>MUST</b> use the Output block<br>
`,
    Hint: [
      "The else statement will execute upon every condition not met by the if statement.",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";

      const mockPrompt1 = (message: string) => {
        return 30;
      };

      const mockPrompt2 = (message: string) => {
        return 0;
      };

      const mockPrompt3 = (message: string) => {
        return 50;
      };

      const func = new Function("prompt", code);
      const return_value_1: string = func(mockPrompt1);
      if (!return_value_1) {
        return false;
      }
      if (return_value_1.toLowerCase().trim() !== "hot") {
        return false;
      }

      const return_value_2 = func(mockPrompt2);
      if (!return_value_1) {
        return false;
      }
      if (return_value_2.toLowerCase().trim() !== "cold") {
        return false;
      }

      const return_value_3 = func(mockPrompt3);
      if (!return_value_1) {
        return false;
      }
      if (return_value_3.toLowerCase().trim() !== "hot") {
        return false;
      }
      return true;
    },
  },
  {
    Title: "More Temperatures, Please",
    Instruction: `The meteorologist wants to extend his program he has created to be more specific by including more categories than just hot and cold. The new categories he is creating should be following these conditions:<br><br>
    - Temperature above or equal to 35: Very Hot<br>
    - Temperature above or equal 30 but below 35: Hot<br>
    - Temperature above or equal 20 but below 30: Warm<br>
    - Temperature above or equal 10 but below 20: Cool<br>
    - Temperature above or equal 0 but below 10: Cold<br>
    - Temperature below 0: Very Cold<br><br>
    Help him create this program in Blockly that takes in temperature and outputs its determined category<br>
    <br><b>NOTE</b>: For Inputs, you <b>MUST</b> use the Input block, and the Output <b>MUST</b> use the Output block<br>

    `,
    Hint: ["Else if’s are checked only if the above logic check fails."],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [
        { Temp: 35, Output: "Very Hot" },
        { Temp: 30, Output: "Hot" },
        { Temp: 20, Output: "Warm" },
        { Temp: 10, Output: "Cool" },
        { Temp: 0, Output: "Cold" },
        { Temp: -5, Output: "Very Cold" },
        { Temp: 40, Output: "Very Hot" },
        { Temp: 32, Output: "Hot" },
        { Temp: 29, Output: "Warm" },
        { Temp: 19, Output: "Cool" },
        { Temp: 9, Output: "Cold" },
      ];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          return element["Temp"];
        };
        const func = new Function("prompt", code);
        const return_value_1: string = func(mockPrompt);
        if (!return_value_1) {
          return false;
        }

        if (
          return_value_1.toLowerCase().trim() !==
          element["Output"].toLowerCase().trim()
        ) {
          return false;
        }
      }
      return true;
    },
  },
  {
    Title: "Everyone Needs a Holiday",
    Instruction: `Finally, the meteorologist wants to change his program slightly to determine what activity should be done based on the conditions.As well as temperature, he wants his program to now accept if it's sunny, or if it’s raining as input. Like the previous questions, the text to be output must be stored and output.\n He then wants to make the following categorisations:<br><br>
  - Temperature above or equal to 25 and its "Sunny": Beach <br>
    - Temperature above or equal to 15 but below 25 and its "Sunny": Hike <br>
      - Temperature below 10 and it's "Raining": Read A Book<br>
        - Everything else: Walk In Park <br>
          <br>
          Help him create this program in Blockly that takes in temperature and condition and outputs the activity.<br>
          <br><b>NOTE</b>: For Inputs, you <b>MUST</b> use the Input block, and the Output <b>MUST</b> use the Output block<br>

    `,
    Hint: [
      "Make use of the available logical operators learnt about (and, or)",
      "The else if statements can be used much like the previous example.",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [
        { Temp: 25, Cond: "Sunny", Output: "Beach" },
        { Temp: 30, Cond: "Sunny", Output: "Beach" },
        { Temp: 15, Cond: "Sunny", Output: "Hike" },
        { Temp: 18, Cond: "Sunny", Output: "Hike" },
        { Temp: 24, Cond: "Sunny", Output: "Hike" },
        { Temp: -8, Cond: "Raining", Output: "Read A Book" },
        { Temp: 9, Cond: "Raining", Output: "Read A Book" },
        { Temp: 10, Cond: "Raining", Output: "Walk In Park" },
        { Temp: 30, Cond: "Raining", Output: "Walk In Park" },
      ];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          if (
            message.toLowerCase().trim() === "Temperature".toLowerCase().trim()
          ) {
            return element["Temp"];
          } else if (
            message.toLowerCase().trim() === "Condition".toLowerCase().trim()
          ) {
            return element["Cond"];
          }
        };
        const func = new Function("prompt", code);
        const return_value_1: string = func(mockPrompt);
        if (!return_value_1) {
          return false;
        }
        if (
          return_value_1.toLowerCase().trim() !==
          element["Output"].toLowerCase().trim()
        ) {
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
imageElement.src = "assets/images/Beginner-" + (activity + 1) + ".jpeg";

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
const ws = Blockly.inject(blocklyDiv, { toolbox });

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
  console.log("Done");
  const res = activityArray[activity].checkCode();

  if (res === true) {
    showToast("Correct Answer", "Well done! You got the correct answer.");

    localStorage.setItem(`t${activity}`, "2");

    if (localStorage.getItem(`t${activity + 1}`) !== "2") {
      localStorage.setItem(`t${activity + 1}`, "1");
    }

    if (activity < activityArray.length - 1) {
      updateQueryParam(++activity);
    } else {
      navigateTo("difficulty-selection.html");
    }

    ws.clear();
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
  showToast("Hint", activityArray[activity]["Hint"][hintIndex++ % numHints]);
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
