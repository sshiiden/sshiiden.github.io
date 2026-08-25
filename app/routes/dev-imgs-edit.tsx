import type { Route } from "./+types/dev-imgs-edit";
import style from "css/devenv.module.css";
import { MetaTags } from "comps/metatags";
import fs from "node:fs/promises";
import path from "node:path";
import { Form, Link } from "react-router";

async function walkImageFiles(): Promise<string[]> {
  const dir = "public/images";
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && (entry.name.toLowerCase().endsWith(".png") || entry.name.toLocaleLowerCase().endsWith(".jpg")))
      .map((entry) => path.join(dir, entry.name))
      .sort();
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function getImageData() {
  const jsonFile = "app/data/images_data.json";
  const raw = await fs.readFile(jsonFile, 'utf8');
  const data = JSON.parse(raw);
  return data as {
    path: string,
    description: string,
  }[];
}

async function updateImageData() {
  console.log("Updating images_data.json...");
  const existingData = await getImageData();
  const imageFiles = await walkImageFiles();
  const imageData = imageFiles.map((filePath) => {
    const relativePath = filePath.replace(/^public/, "");
    return {
      path: relativePath,
      description: "",
    };
  });
  imageData.forEach((imgData) => {
    const existingImgData = existingData.find((data) => data.path === imgData.path);
    if (existingImgData) {
      imgData.description = existingImgData.description;
    }
  });
  await fs.writeFile("app/data/images_data.json", JSON.stringify(imageData));
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  if (formData.has("description")) {
    const path = formData.get("path") as string;
    const description = formData.get("description") as string;
    const data = await getImageData();
    const updatedData = data.map((imgData) => {
      if (imgData.path === path) {
        return { ...imgData, description };
      }
      return imgData;
    });
    await fs.writeFile("app/data/images_data.json", JSON.stringify(updatedData));
  }

  if (formData.has("update-img-data")) {
    await updateImageData();
  }

  return new Response(null, { status: 302, headers: { Location: "/dev/imgs-edit" } });
}

export async function loader({ }: Route.LoaderArgs) {
  return await getImageData();
}

export default ({ loaderData }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main-imgs-edit"]}>
      <h1>DEVTOOL: Images Edit</h1>
      <Form method="POST">
        <button type="submit">Update images_data.json</button>
      </Form>
      <hr />
      <ul>
        {loaderData.map(imgData => (
          <li key={imgData.path}>
            <Link to={imgData.path} target="_blank"><img src={imgData.path} /></Link>
            <Form method="POST">
              <code>PATH: {imgData.path}</code>
              <input readOnly name="path" defaultValue={imgData.path} hidden />
              <label>
                <code>DESC: </code>
                <textarea
                  placeholder="Write a description for the image here..."
                  name="description"
                  defaultValue={imgData.description}
                  maxLength={200}
                />
              </label>
              <button type="submit">UPDATE</button>
            </Form>
          </li>
        ))}
      </ul>
    </main>
  </>
}