import { NextResponse } from "next/server";
import axios from "axios";

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const owner=process.env.GITHUB_OWNER;
const fetchAllRepos = async () => {
  let allRepos: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get(
      `https://api.github.com/user/repos?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (response.data.length > 0) {
      allRepos = [...allRepos, ...response.data];
      page++;
    } else {
      hasMore = false;
    }
  }

  return allRepos;
};

export async function GET(
 
) {
  


  try {
    const allRepos = await fetchAllRepos();

    // ✅ Filter and return only required fields
    const repos = await Promise.all(
      allRepos
        .filter((repo: any) => repo.owner.login === owner)
        .map(async (repo: any) => {
          let hasReadme = false;
          try {
            await axios.get(
              `https://api.github.com/repos/${owner}/${repo.name}/contents/README.md`,
              {
                headers: {
                  Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
                },
              }
            );
            hasReadme = true;
          } catch (err) {
            hasReadme = false;
          }

          return {
            id: repo.id, 
            name: repo.name,
            hasReadme,
          };
        })
    );

    return NextResponse.json({success:true,repos}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Repositories not found or unauthorized" }, { status: 404 });
  }
}
