
import { NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);

export async function GET(request: Request, { params }: { params: { repoId: string } }) {
  const { repoId } = await params; 

  if (!repoId) {
    return NextResponse.json({ error: "Repository ID is required" }, { status: 400 });
  }

  try {
    
    const repoDetailsResponse = await axios.get(`https://api.github.com/repositories/${repoId}`, {
      headers: {
        Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
      },
    });

    const repoName = repoDetailsResponse.data.name;
    const owner = repoDetailsResponse.data.owner.login;
    const defaultBranch = repoDetailsResponse.data.default_branch;

    
    const repoContentsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/contents`,
      {
        headers: {
          Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    );

  
    const files = await Promise.all(
      repoContentsResponse.data.map(async (file: any) => {
        if (file.type === "file" && !file.name.endsWith(".md")) { 
          try {
            const fileContentResponse = await axios.get(file.download_url);
            return `File: ${file.path}\n\n${fileContentResponse.data}`;
          } catch (error) {
            console.error(`Error fetching file ${file.path}:`, error);
            return null;
          }
        }
        return null;
      })
    );

    const codeContent = files.filter(Boolean).join("\n\n");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
    const prompt = `
      Analyze the following code from a GitHub repository and generate a detailed README.md file.
      The repository name is "${repoName}", and the default branch is "${defaultBranch}".

      The README should include:
      1. A project title (use the repository name: ${repoName}).
      2. A description of the project (explain its purpose and functionality based on the code in detail and tech stack used).
      3. Installation instructions (include any dependencies and setup steps).
      4. Usage instructions (provide examples or commands to run the project).
      5. Contribution guidelines (explain how others can contribute).
      6. License information (if available in the repository).
      7. Any other relevant sections (e.g., acknowledgments, FAQs).

      Here is the code:
      ${codeContent}

      Analyze the code carefully and generate a README.md that accurately reflects the project's structure, functionality, and purpose.
    `;

    const result = await model.generateContent(prompt);
    const readmeContent = result.response.text(); 
    let readmeSha = "";
    try {
      const readmeShaResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/contents/README.md`,
        {
          headers: {
            Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
          },
        }
      );
      readmeSha = readmeShaResponse.data.sha;
    } catch (err) {
     
    }

    await axios.put(
      `https://api.github.com/repos/${owner}/${repoName}/contents/README.md`,
      {
        message: "Auto-generated README.md by Github Agent",
        content: Buffer.from(readmeContent).toString("base64"), 
        sha: readmeSha, 
      },
      {
        headers: {
          Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ success: true, message: "README.md generated and pushed successfully!" });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}