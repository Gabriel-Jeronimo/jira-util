import axios from "axios";
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Basic Z2FicmllbC5saW1hLnNpbHZhQGFjY2VudHVyZS5jb206QVRBVFQzeEZmR0YwTnJoRlNBWUx6ZmlFY21PQk83bk5qQ1UyU1ktTUNOc2pFbkZaTWEtRDItejliZ2RjSDhMbGQxVVpZaV9IX0FxR1NKc3paWndxN00zdlNwVWNTZnFDdER2Umk1dHVUZlBkc2dHN3l0akFYcnNSR1lyZ2lIVXlMRWtfLVMzNzA4SFgyRmZPZzJ5bHVsNVRaNUFQOU04eXhiTDYwSnBIRGp1U0h5aDl6dXZscnk0PUY5NTI1Mzc1",
  },
};

interface getIssueResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: [];
}

export interface TransitionToReview {
  // Actual Draft Completion:
  customfield_10212: string;
  // Document link
  customfield_10203: string;
  // Reviewer1
  customfield_10215: { accountId: string };
}

export interface TransitionToDraft {
  // Actual Start
  customfield_10211: string;
  //   Target Date
  customfield_10210: string;
  //   Target Draft Completion
  customfield_10208: string;
  //   Target Review Completion:
  customfield_10209: string;
  assignee: { accountId: string };
}

export interface TransitionBody {
  transition: { id: number };
  fields: TransitionToDraft | TransitionToReview;
}
export async function getIssueByKey(
  key: string
): Promise<getIssueResponse | null> {
  try {
    const result = await axios.get(
      `${process.env.BASE_URL}rest/api/3/search?jql=issueKey=${key}`,
      options
    );
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateIssueStatus(key: string, data: any) {
  try {
    const result = await axios.post(
      `${process.env.BASE_URL}rest/api/3/issue/${key}/transitions/`,
      data,
      options
    );
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
