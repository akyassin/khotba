import { Translation } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  json,
} from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const speech = await prisma.speech.findUnique({
    where: { id: Number(params.speechId) },
    include: { translations: true },
  });

  if (!speech) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ speech });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const arabicTranslation = formData.get("arabicTranslation");
  const swedishTranslation = formData.get("swedishTranslation");

  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof arabicTranslation !== "string" ||
    typeof swedishTranslation !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  await prisma.speech.update({
    where: { id: Number(params.speechId) },
    data: {
      title,
      body,
      translations: {
        updateMany: [
          {
            where: { language: "Arabic" },
            data: { text: arabicTranslation },
          },
          {
            where: { language: "Swedish" },
            data: { text: swedishTranslation },
          },
        ],
      },
    },
  });

  return redirect(`/speeches/${params.speechId}`);
};

export default function EditSpeech() {
  const { speech } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Edit Speech</h1>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      <Form method="post">
        <div>
          <label>
            Title:{" "}
            <input type="text" name="title" defaultValue={speech.title} />
          </label>
        </div>
        <div>
          <label>
            Body: <textarea name="body" defaultValue={speech.body}></textarea>
          </label>
        </div>
        <div>
          <label>
            Arabic Translation:{" "}
            <textarea
              name="arabicTranslation"
              defaultValue={
                speech.translations.find(
                  (t: Translation) => t.language === "Arabic"
                )?.text
              }
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Swedish Translation:{" "}
            <textarea
              name="swedishTranslation"
              defaultValue={
                speech.translations.find(
                  (t: Translation) => t.language === "Swedish"
                )?.text
              }
            ></textarea>{" "}
          </label>
        </div>
        <button type="submit" style={{ display: "block", marginTop: "10px" }}>
          Save
        </button>
      </Form>
    </div>
  );
}
