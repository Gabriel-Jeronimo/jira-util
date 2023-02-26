import fs from "fs";
import {
  getIssueByKey,
  TransitionToDraft,
  TransitionToReview,
  updateIssueStatus,
} from "./jiraClient.service";
import dotenv from "dotenv";
import { TransitionBody } from "./jiraClient.service";

dotenv.config();

export async function runRoutine() {
  const data = readStories("./src/data/pefa_list.csv");
  data.forEach(async (key: string) => {
    const result = await getIssueByKey(key);
    // @ts-ignore
    const issueStatus = result?.issues[0].fields.status.name;
    if (issueStatus == "Done") {
      // @ts-ignore
      result?.issues[0].fields.subtasks.forEach(async (subtask: any) => {
        await updateSubtaskStatus(subtask.key);
      });
    }
  });
}

export function readStories(pathfile: string): string[] {
  try {
    const FILEPATH = fs.realpathSync(pathfile);
    const data = fs.readFileSync(FILEPATH, "utf8").toString().split(";");
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateSubtaskStatus(key: string) {
  while (true) {
    const subtask = await getIssueByKey(key);
    console.log("Hello");
    if (
      // @ts-ignore
      subtask?.issues[0].fields.status.name === "In Review" ||
      // @ts-ignore
      subtask?.issues[0].fields.status.name === "Complete"
    ) {
      return;
    }
    // @ts-ignore
    switch (subtask?.issues[0].fields.status.name) {
      case "New":
        updateIssueStatus(key, {
          transition: { id: 11 },
          fields: {
            customfield_10211: "2023-02-24",
            customfield_10210: "2023-02-25",
            customfield_10208: "2023-02-25",
            customfield_10209: "2023-02-25",
            assignee: { accountId: "633db5a4234d44d406d4a28c" },
          } as TransitionToDraft,
        } as TransitionBody);
        break;
      case "In Draft":
        updateIssueStatus(key, {
          transition: { id: 21 },
          fields: {
            customfield_10212: "2023-02-25",
            customfield_10203: "N/A",
            customfield_10215: {
              accountId: "633db5a4234d44d406d4a28c",
            },
          } as TransitionToReview,
        } as TransitionBody);
        break;
      case "In Review":
        break;
      case "In Signoff":
        break;
    }
  }
}
