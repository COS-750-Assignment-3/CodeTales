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
import { Toast } from "bootstrap";
import { show } from "blockly/core/contextmenu";

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
    instructionDiv.textContent = activityArray[activity]["Instruction"];
  }
  if (activityHeading) {
    activityHeading.textContent = `Activity ${activity + 1}`;
  }
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

var input_temperature = {
  type: "input_dropdown",
  message0: "Input %1",
  output: null,
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
};

var output_block = {
  type: "output_block",
  message0: "Output %1",
  previousStatement: null,
  args0: [
    {
      type: "field_input",
      name: "output",
      text: "hello",
    },
  ],
};

Blockly.defineBlocksWithJsonArray([
  start,
  end,
  input_temperature,
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
  return [`prompt("${field}")`, Order.ATOMIC];
};

javascriptGenerator.forBlock["output_block"] = function (block, generator) {
  const field = block.getFieldValue("output");

  return `return "${field}"`;
};

const activityArray = [
  {
    Instruction: `A meteorologist wants to create a small program that reads the temperature from his thermostat. He wants this program to store and output text saying “Hot” if the temperature is above or equal to 30 C else it should store and output “Cold”.
Help him create this program within Blockly, that takes in temperature as input, outputs the message whether it’s hot or cold.`,
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
    Instruction: `The meteorologist wants to extend his program he has created to be more specific by including more categories than just hot and cold. The new categories he is creating should be following these conditions:\n
    - Temperature above or equal to 35: Very Hot\n
    - Temperature above or equal 30 but below 35: Hot\n
    - Temperature above or equal 20 but below 30: Warm\n
    - Temperature above or equal 10 but below 20: Cool\n
    - Temperature above or equal 0 but below 10: Cold\n
    - Temperature below 0: Very Cold\n
    Help him create this program in Blockly that takes in temperature and outputs its determined category
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
    Instruction: `Finally, the meteorologist wants to change his program slightly to determine what activity should be done based on the conditions. As well as temperature, he wants his program to now accept if it's sunny, and if it’s raining as input. Like the previous questions, the text to be output must be stored and output.\n He then wants to make the following categorisations:
Temperature above or equal to 25 and its "Sunny": Beach\n
Temperature above or equal to 15 but below 25 and its "Sunny": Hike\n
Temperature below 10 and it's "Raining": Read A Book\n
All other conditions: Walk In Park\n

    Help him create this program in Blockly that takes in temperature and condition and outputs the activity.
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
  instructionDiv.textContent = activityArray[activity]["Instruction"];
}

const activityHeading = document.getElementById("activity-heading");

if (activityHeading) {
  activityHeading.textContent = `Activity ${activity + 1}`;
}

const goBackButton = document.getElementById("backButton");

if (goBackButton) {
  goBackButton.addEventListener("click", () => {
    if (activity > 0) {
      updateQueryParam(--activity);
    }
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
  const res = activityArray[activity].checkCode();
  if (res === true) {
    showToast("Correct Answer", "Well done! You got the correct answer.");
    if (activity < activityArray.length - 1) {
      updateQueryParam(++activity);
    } else {
      navigateTo("difficulty-selection.html");
    }

    ws.clear();
  } else {
    showToast("Incorrect Answer", "Oh No! You got the incorrect answer. Give it another try.");
  }
  return res;
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
}

function showToast(heading: string, body: string) {
  const toastHeading = document.getElementById('toast-heading');
  if (toastHeading)
    toastHeading.innerHTML = heading;

  const toastBody = document.getElementById('toast-body');
  if (toastBody)
    toastBody.innerHTML = body;

  const toastElement = document.getElementById('myToast');
  if (toastElement) {
    const toast = new Toast(toastElement);
    toast.show();
  }
}

export function navigateTo(route: string) {
  window.location.href = route;
}

(window as any).navigateTo = navigateTo;
